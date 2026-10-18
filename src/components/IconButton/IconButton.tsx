import type { HTMLMotionProps } from 'framer-motion'
import { Button } from '../Button/Button'

type IconButtonProps = Omit<HTMLMotionProps<'button'>, 'aria-label'> & {
  label: string
}

export function IconButton({ label, className = '', children, ...props }: IconButtonProps) {
  return (
    <Button aria-label={label} className={`size-10 p-0! ${className}`} {...props}>
      {children}
    </Button>
  )
}
