import { useState, type FormEvent } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button/Button'
import { useMotion } from '../../motion'
import { useAuth } from '../../store/auth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, password: string) {
  if (!emailPattern.test(email)) return 'Enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return null
}

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const signIn = useAuth((state) => state.signIn)
  const navigate = useNavigate()
  const controls = useAnimationControls()
  const { reduced, fadeUp } = useMotion()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const message = validate(email.trim(), password)
    setError(message)
    if (message) {
      if (!reduced) void controls.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } })
      return
    }
    signIn(email.trim())
    navigate('/profiles')
  }

  return (
    <main className="relative grid min-h-[calc(100vh-3rem)] place-items-center overflow-hidden rounded-card p-6">
      <motion.div
        aria-hidden
        data-testid="signin-background"
        className="pointer-events-none absolute -inset-1/2 bg-[conic-gradient(from_90deg,var(--accent),var(--highlight),var(--background),var(--accent))] opacity-30 blur-3xl"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
      />
      <motion.form
        {...fadeUp}
        noValidate
        onSubmit={handleSubmit}
        className="relative flex w-full max-w-sm flex-col gap-4 rounded-card bg-surface/90 p-8 shadow-elevated"
      >
        <motion.div animate={controls} className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Sign in</h1>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={error !== null}
              className="rounded-control bg-background px-3 py-2 text-base text-text"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={error !== null}
              className="rounded-control bg-background px-3 py-2 text-base text-text"
            />
          </label>
          {error && <p role="alert" className="text-sm text-highlight">{error}</p>}
        </motion.div>
        <Button type="submit">Sign in</Button>
      </motion.form>
    </main>
  )
}
