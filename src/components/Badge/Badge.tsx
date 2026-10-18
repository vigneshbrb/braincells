import { motion, type HTMLMotionProps } from 'framer-motion'
import { useMotion } from '../../motion'

export function Badge({ children, className = '', ...props }: HTMLMotionProps<'span'>) {
  const { reduced, micro } = useMotion()

  return (
    <motion.span
      {...props}
      className={`inline-flex items-center rounded-control bg-surface px-2 py-1 text-xs font-semibold text-highlight ${className}`}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      transition={micro}
    >
      {children}
    </motion.span>
  )
}
