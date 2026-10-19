import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { posterStyle } from '../../catalog'
import { useMotion } from '../../motion'
import { useAuth } from '../../store/auth'
import { useProfiles } from '../../store/profiles'
import { SearchBox } from './SearchBox'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const signOut = useAuth((state) => state.signOut)
  const { profiles, activeId } = useProfiles()
  const { reduced, scaleIn, micro } = useMotion()

  const activeProfile = profiles.find((p) => p.id === activeId) ?? profiles[0]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleSwitchProfile() {
    setMenuOpen(false)
    navigate('/profiles')
  }

  function handleSignOut() {
    setMenuOpen(false)
    signOut()
    navigate('/signin')
  }

  return (
    <header
      data-testid="navbar"
      data-scrolled={scrolled}
      className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-3 transition-all duration-250 sm:px-6 ${
        scrolled ? 'bg-surface/90 shadow-elevated backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-8">
        <Link to="/browse" className="font-heading text-base font-bold tracking-wider text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight sm:text-xl">
          BrainCells
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-control px-2 py-1 text-xl text-text sm:hidden"
        >
          ☰
        </button>
        <nav aria-label="Main" className="hidden items-center gap-6 sm:flex">
          <Link to="/browse" className="text-sm font-medium text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
            Browse
          </Link>
          <Link to="/browse/my-list" className="text-sm font-medium text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
            My List
          </Link>
          <Link to="/insights" className="text-sm font-medium text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight">
            Insights
          </Link>
        </nav>
      </div>

      {mobileOpen && (
        <nav id="mobile-navigation" aria-label="Mobile" className="absolute inset-x-0 top-full flex flex-col gap-1 bg-surface p-3 shadow-elevated sm:hidden">
          <Link to="/browse" onClick={() => setMobileOpen(false)} className="rounded-control px-3 py-2">Browse</Link>
          <Link to="/browse/my-list" onClick={() => setMobileOpen(false)} className="rounded-control px-3 py-2">My List</Link>
          <Link to="/insights" onClick={() => setMobileOpen(false)} className="rounded-control px-3 py-2">Insights</Link>
        </nav>
      )}

      <div className="flex items-center gap-2 sm:gap-4">
        <SearchBox />

        <div className="relative" ref={menuRef}>
          <motion.button
            type="button"
            aria-label="Profile menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            transition={micro}
            className="flex items-center gap-2 rounded-control p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
          >
            <span
              aria-hidden
              style={activeProfile ? posterStyle(activeProfile.id) : undefined}
              className="grid size-8 place-items-center rounded-control bg-accent text-sm font-bold shadow-elevated"
            >
              {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : 'U'}
            </span>
            <span className="hidden text-sm font-medium text-text md:inline">
              {activeProfile?.name ?? 'Profile'}
            </span>
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                aria-label="Profile options"
                initial={scaleIn.initial}
                animate={scaleIn.animate}
                exit={scaleIn.initial}
                transition={scaleIn.transition}
                className="absolute right-0 mt-2 w-48 origin-top-right rounded-card bg-surface p-2 shadow-elevated ring-1 ring-white/10 focus:outline-none"
              >
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="text-xs text-muted">Signed in as</p>
                  <p className="truncate text-sm font-medium text-text">{activeProfile?.name ?? 'User'}</p>
                </div>
                <div className="py-1">
                  <button type="button" role="menuitem" onClick={handleSwitchProfile} className="flex w-full items-center px-3 py-2 text-left text-sm text-text transition-colors hover:bg-white/5 hover:text-accent rounded-control">
                    Switch profile
                  </button>
                  <button type="button" role="menuitem" onClick={handleSignOut} className="flex w-full items-center px-3 py-2 text-left text-sm text-highlight transition-colors hover:bg-white/5 rounded-control">
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
