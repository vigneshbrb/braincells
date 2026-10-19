import { useCallback, useMemo, useState } from 'react'
import { byId } from './catalog'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { byGenre, genres } from './catalog'
import type { Title } from './catalog'
import { ContinueRow } from './components/ContinueRow/ContinueRow'
import { Hero } from './components/Hero/Hero'
import { MyListRow } from './components/MyListRow/MyListRow'
import { Navbar } from './components/Navbar/Navbar'
import { Player } from './components/Player/Player'
import { PosterCard } from './components/PosterCard/PosterCard'
import { ProfilePicker } from './components/ProfilePicker/ProfilePicker'
import { RequireAuth } from './components/RequireAuth/RequireAuth'
import { Row } from './components/Row/Row'
import { SignIn } from './components/SignIn/SignIn'
import { SearchPage } from './components/SearchPage/SearchPage'
import { TitleModal } from './components/TitleModal/TitleModal'
import { Top10Row } from './components/Top10Row/Top10Row'
import { useProfiles } from './store/profiles'
import { selectMyList, useMyList } from './store/myList'

function RootLayout() {
  return (
    <main className="min-h-screen p-6">
      <Outlet />
    </main>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6 pt-20">
        <Outlet />
      </main>
    </div>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return <h1>{title}</h1>
}

function BrowsePage() {
  const [selected, setSelected] = useState<{ title: Title; opener: HTMLElement; layoutId?: string } | null>(null)
  const closeModal = useCallback(() => setSelected(null), [])

  function openModal(title: Title, opener: HTMLElement, layoutId?: string) {
    const rect = opener.getBoundingClientRect()
    const visible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
      && rect.left < window.innerWidth && rect.right > 0
    setSelected({ title, opener, layoutId: visible ? layoutId : undefined })
  }

  return (
    <div className="-mx-6 -mt-20 space-y-8 pb-12">
      <h1 className="sr-only">Browse</h1>
      <Hero onMoreInfo={(title, opener) => openModal(title, opener)} />
      <div className="space-y-6">
        <ContinueRow onOpen={openModal} />
        <MyListRow onOpen={openModal} />
        <Top10Row onOpen={openModal} />
        {genres.map((genre) => (
          <Row key={genre} title={genre} titles={byGenre(genre)} onOpen={openModal} />
        ))}
      </div>
      <AnimatePresence>
        {selected && (
          <TitleModal
            title={selected.title}
            layoutId={selected.layoutId}
            opener={selected.opener}
            onClose={closeModal}
            onSelect={(title) => setSelected({ ...selected, title, layoutId: undefined })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function MyListPage() {
  const [selected, setSelected] = useState<{ title: Title; opener: HTMLElement; layoutId?: string } | null>(null)
  const activeProfileId = useProfiles((state) => state.activeId) || 'default'
  const titleIds = useMyList(selectMyList(activeProfileId))
  const myListTitles = useMemo(
    () => (titleIds || []).map((id) => byId(id)).filter((t): t is Title => t !== undefined),
    [titleIds],
  )
  const closeModal = useCallback(() => setSelected(null), [])

  function openModal(title: Title, opener: HTMLElement, layoutId?: string) {
    const rect = opener.getBoundingClientRect()
    const visible = rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
      && rect.left < window.innerWidth && rect.right > 0
    setSelected({ title, opener, layoutId: visible ? layoutId : undefined })
  }

  return (
    <div className="-mx-6 -mt-20 space-y-8 pb-12">
      <h1 className="px-6 text-3xl font-bold font-heading text-text sm:px-12">My List</h1>
      {myListTitles.length === 0 ? (
        <p className="px-6 text-muted sm:px-12">Your list is empty. Add titles to see them here.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 px-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 sm:px-12">
          {myListTitles.map((title) => (
            <PosterCard
              key={title.id}
              title={title}
              onOpen={openModal}
              layoutId={`mylist-page-${title.id}`}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <TitleModal
            title={selected.title}
            layoutId={selected.layoutId}
            opener={selected.opener}
            onClose={closeModal}
            onSelect={(title) => setSelected({ ...selected, title, layoutId: undefined })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function NotFoundPage() {
  return (
    <>
      <h1>Page not found</h1>
      <Link to="/">Go home</Link>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/signin" replace />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="profiles" element={<ProfilePicker />} />
          <Route element={<AppLayout />}>
            <Route path="browse" element={<RequireAuth><BrowsePage /></RequireAuth>} />
            <Route path="browse/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
            <Route path="browse/my-list" element={<RequireAuth><MyListPage /></RequireAuth>} />
            <Route path="watch/:id" element={<RequireAuth><Player /></RequireAuth>} />
            <Route path="insights" element={<PlaceholderPage title="Insights" />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
