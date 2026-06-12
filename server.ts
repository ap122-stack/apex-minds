import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173' }))
app.use(express.json())

// Server-side pricing (never trust frontend)
const PRICING: Record<string, Record<number, { name: string; pricePerSession: number }>> = {
  standard: {
    1: { name: 'Standard Tutoring - 1 Session', pricePerSession: 40 },
    4: { name: 'Standard Tutoring - 4 Sessions', pricePerSession: 38 },
    8: { name: 'Standard Tutoring - 8 Sessions', pricePerSession: 36 },
    12: { name: 'Standard Tutoring - 12 Sessions', pricePerSession: 34 },
  },
  ap: {
    1: { name: 'AP Exam Prep - 1 Session', pricePerSession: 45 },
    4: { name: 'AP Exam Prep - 4 Sessions', pricePerSession: 43 },
    8: { name: 'AP Exam Prep - 8 Sessions', pricePerSession: 41 },
    12: { name: 'AP Exam Prep - 12 Sessions', pricePerSession: 39 },
  },
  testprep: {
    1: { name: 'SAT/ACT Prep - 1 Session', pricePerSession: 70 },
    4: { name: 'SAT/ACT Prep - 4 Sessions', pricePerSession: 68 },
    8: { name: 'SAT/ACT Prep - 8 Sessions', pricePerSession: 66 },
    12: { name: 'SAT/ACT Prep - 12 Sessions', pricePerSession: 64 },
  },
}

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { packageId, sessions, studentName, studentEmail } = req.body

    if (!packageId || !sessions || !studentName || !studentEmail) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const pricing = PRICING[packageId as keyof typeof PRICING]
    if (!pricing || !pricing[sessions as keyof typeof pricing]) {
      return res.status(400).json({ error: 'Invalid package or session count' })
    }

    const { name, pricePerSession } = pricing[sessions as keyof typeof pricing]
    const totalAmount = Math.round(pricePerSession * sessions * 100) // Convert to cents

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: studentEmail,
      submit_type: 'book',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: name,
              description: `${sessions} one-hour tutoring session${sessions > 1 ? 's' : ''}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/packages`,
      metadata: {
        packageId,
        sessions: String(sessions),
        studentName,
        studentEmail,
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// Webhook for payment completion
app.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✓ Payment completed:', {
          sessionId: session.id,
          studentName: session.metadata?.studentName,
          studentEmail: session.metadata?.studentEmail,
          packageId: session.metadata?.packageId,
          sessions: session.metadata?.sessions,
          amount: session.amount_total,
        })

        // TODO: Save booking to database, send confirmation email, update calendar
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(400).json({ error: 'Webhook failed' })
    }
  }
)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

const PORT = process.env.BACKEND_PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
