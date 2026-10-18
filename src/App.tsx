import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { byGenre, genres } from './catalog'
import { Hero } from './components/Hero/Hero'
import { Navbar } from './components/Navbar/Navbar'
import { ProfilePicker } from './components/ProfilePicker/ProfilePicker'
import { RequireAuth } from './components/RequireAuth/RequireAuth'
import { Row } from './components/Row/Row'
import { SignIn } from './components/SignIn/SignIn'

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
  return (
    <div className="-mx-6 -mt-20 space-y-8 pb-12">
      <h1 className="sr-only">Browse</h1>
      <Hero />
      <div className="space-y-6">
        {genres.map((genre) => (
          <Row key={genre} title={genre} titles={byGenre(genre)} />
        ))}
      </div>
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
            <Route path="watch/:id" element={<RequireAuth><PlaceholderPage title="Watch" /></RequireAuth>} />
            <Route path="insights" element={<PlaceholderPage title="Insights" />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
