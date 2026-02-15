
import * as React from 'react'
import { cn } from '@/lib/utils'

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    title: string
    description?: string
  }[]
  currentStep?: number
}

export function Steps({ steps, currentStep = 1, className, ...props }: StepsProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:gap-6', className)} {...props}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        return (
          <div
            key={index}
            className={cn('flex gap-4 md:gap-6', {
              'opacity-60': stepNumber !== currentStep,
            })}
          >
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-input text-sm font-medium',
                {
                  'bg-primary text-primary-foreground border-primary':
                    stepNumber === currentStep,
                }
              )}
            >
              {stepNumber}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-base font-medium">{step.title}</div>
              {step.description ? (
                <div className="text-sm text-muted-foreground">
                  {step.description}
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
