import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth/RequireAuth'
import { SignIn } from './components/SignIn/SignIn'

function RootLayout() {
  return (
    <main className="min-h-screen p-6">
      <Outlet />
    </main>
  )
}

function PlaceholderPage({ title }: { title: string }) {
  return <h1>{title}</h1>
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
          <Route path="profiles" element={<PlaceholderPage title="Profiles" />} />
          <Route path="browse" element={<RequireAuth><PlaceholderPage title="Browse" /></RequireAuth>} />
          <Route path="watch/:id" element={<RequireAuth><PlaceholderPage title="Watch" /></RequireAuth>} />
          <Route path="insights" element={<PlaceholderPage title="Insights" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
