'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
  text: string
  className?: string
  /** Delay before the animation starts, in ms */
  delay?: number
  /** Stagger between each letter, in ms */
  stagger?: number
  /** Animation variant */
  variant?: 'letter-reveal' | 'word-rise'
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}

/**
 * Renders text with a per-letter (or per-word) staggered reveal animation.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 40,
  variant = 'letter-reveal',
  as: Tag = 'span',
}: AnimatedTextProps) {
  const units = useMemo(() => {
    if (variant === 'word-rise') {
      return text.split(' ')
    }
    return text.split('')
  }, [text, variant])

  return (
    <Tag className={cn('inline-block', className)} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          className={cn('inline-block', variant)}
          style={{ animationDelay: `${delay + i * stagger}ms` }}
          aria-hidden
        >
          {unit === ' ' ? '\u00A0' : unit}
        </span>
      ))}
    </Tag>
  )
}
