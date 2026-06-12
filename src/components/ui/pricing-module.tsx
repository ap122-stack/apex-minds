'use client'

import * as React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import { Button } from './button'
import { Check, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface PlanFeature {
  label: string
  included: boolean
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  price: number
  sessions: number
  features: PlanFeature[]
  recommended?: boolean
  stripeUrl?: string
}

export interface PricingModuleProps {
  title?: string
  subtitle?: string
  buttonLabel?: string
  plans: PricingPlan[]
  className?: string
}

export function PricingModule({
  title = 'Pricing Plans',
  subtitle = 'Choose a plan that fits your needs.',
  buttonLabel = 'Get started',
  plans,
  className,
}: PricingModuleProps) {
  return (
    <section className={cn('w-full bg-cream text-foreground py-20 px-4 md:px-8', className)}>
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--apex-plum)' }}>
          {title}
        </h2>
        <p className="text-muted-foreground mb-8">{subtitle}</p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'relative border border-muted rounded-xl transition-all hover:shadow-md hover:border-primary/30',
                plan.recommended && 'border-apex-plum ring-1 ring-apex-plum/30 scale-[1.05]'
              )}
              style={
                plan.recommended
                  ? {
                      borderColor: 'var(--apex-plum)',
                      boxShadow: 'rgba(33,28,48,0.25) 0px 12px 48px',
                      background: '#fff',
                    }
                  : { background: '#fff', borderColor: 'var(--apex-line)' }
              }
            >
              {plan.recommended && (
                <div
                  className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--apex-plum)', color: '#fff' }}
                >
                  Recommended
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">{plan.icon}</div>
                <CardTitle style={{ color: 'var(--apex-plum)' }}>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div
                  className="text-3xl font-bold mb-2 transition-all duration-300"
                  style={{ color: 'var(--apex-plum)', fontFamily: 'var(--font-display)' }}
                >
                  ${plan.price}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.sessions} session{plan.sessions > 1 ? 's' : ''}
                </p>

                <button
                  onClick={() => {
                    if (plan.stripeUrl) {
                      window.location.href = plan.stripeUrl
                    }
                  }}
                  className="w-full mb-6 py-2 px-4 rounded-lg font-medium transition"
                  style={{
                    background: plan.recommended ? 'var(--apex-plum)' : 'var(--apex-plum-soft)',
                    color: '#fff',
                  }}
                >
                  {buttonLabel}
                </button>

                <div className="text-left text-sm">
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--apex-plum)' }}>
                    What's included
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-4 h-4" style={{ color: 'var(--apex-plum)' }} />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span
                          className={f.included ? 'text-muted-foreground' : 'text-muted-foreground/60 line-through'}
                        >
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
