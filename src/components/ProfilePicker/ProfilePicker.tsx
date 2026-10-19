import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button/Button'
import { posterStyle } from '../../catalog'
import { useMotion } from '../../motion'
import { maxProfiles, useProfiles } from '../../store/profiles'

export function ProfilePicker() {
  const { profiles, addProfile, removeProfile, selectProfile } = useProfiles()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const { reduced, fadeUp, stagger, micro } = useMotion()

  const item = {
    hidden: fadeUp.initial,
    show: { ...fadeUp.animate, transition: fadeUp.transition },
  }
  const canDelete = profiles.length > 1

  function choose(id: string) {
    selectProfile(id)
    navigate('/browse')
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    addProfile(name)
    setName('')
    setAdding(false)
  }

  return (
    <main className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-10">
      <motion.h1 {...fadeUp} className="font-heading text-4xl font-bold">Who's watching?</motion.h1>
      <motion.ul
        className="flex flex-wrap justify-center gap-6"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: stagger }}
      >
        {profiles.map((profile) => (
          <motion.li key={profile.id} variants={item} className="flex flex-col items-center gap-2">
            <motion.button
              type="button"
              onClick={() => choose(profile.id)}
              whileHover={reduced ? undefined : { scale: 1.08 }}
              whileTap={reduced ? undefined : { scale: 0.95 }}
              transition={micro}
              className="flex flex-col items-center gap-2 rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
            >
              <span
                aria-hidden
                style={posterStyle(profile.id)}
                className="grid size-28 place-items-center rounded-card text-4xl font-bold shadow-elevated"
              >
                {profile.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-muted">{profile.name}</span>
            </motion.button>
            <button
              type="button"
              aria-label={`Delete ${profile.name}`}
              disabled={!canDelete}
              onClick={() => removeProfile(profile.id)}
              className="text-xs text-muted hover:text-highlight disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete
            </button>
          </motion.li>
        ))}
        {profiles.length < maxProfiles && (
          <motion.li variants={item} className="flex flex-col items-center gap-2">
            {adding ? (
              <form onSubmit={handleAdd} className="flex flex-col items-center gap-2">
                <label className="flex flex-col gap-1 text-sm text-muted">
                  Profile name
                  <input
                    autoFocus
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={20}
                    className="w-28 rounded-control bg-surface px-3 py-2 text-base text-text"
                  />
                </label>
                <Button type="submit" disabled={!name.trim()}>Save</Button>
              </form>
            ) : (
              <motion.button
                type="button"
                onClick={() => setAdding(true)}
                whileHover={reduced ? undefined : { scale: 1.08 }}
                transition={micro}
                className="flex flex-col items-center gap-2 rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
              >
                <span aria-hidden className="grid size-28 place-items-center rounded-card border-2 border-dashed border-muted text-4xl text-muted">+</span>
                <span className="text-muted">Add profile</span>
              </motion.button>
            )}
          </motion.li>
        )}
      </motion.ul>
    </main>
  )
}
