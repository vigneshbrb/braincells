import { useState } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { useMotion } from '../../motion'

export function Button({
  children,
  className = '',
  disabled,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: HTMLMotionProps<'button'>) {
  const [pressed, setPressed] = useState(false)
  const { reduced, micro } = useMotion()

  return (
    <motion.button
      type="button"
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-control bg-accent px-4 py-2 font-semibold text-text shadow-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      data-pressed={pressed}
      animate={{ scale: reduced || disabled ? 1 : pressed ? 0.96 : 1 }}
      whileHover={reduced || disabled ? undefined : { scale: 1.03 }}
      transition={micro}
      onPointerDown={(event) => { if (!disabled) setPressed(true); onPointerDown?.(event) }}
      onPointerUp={(event) => { setPressed(false); onPointerUp?.(event) }}
      onPointerCancel={(event) => { setPressed(false); onPointerCancel?.(event) }}
      onPointerLeave={(event) => { setPressed(false); onPointerLeave?.(event) }}
    >
      {children}
    </motion.button>
  )
}
