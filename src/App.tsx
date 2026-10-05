import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { TripProvider } from './context/TripContext'
import { DestinationPage } from './pages/DestinationPage'
import { ExplorePage } from './pages/ExplorePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlannerPage } from './pages/PlannerPage'
import { TripPage } from './pages/TripPage'

export default function App() {
  return <TripProvider><AppShell><Routes><Route path="/" element={<ExplorePage />} /><Route path="/destination/:slug" element={<DestinationPage />} /><Route path="/planner" element={<PlannerPage />} /><Route path="/trip" element={<TripPage />} /><Route path="/not-found" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/not-found" replace />} /></Routes></AppShell></TripProvider>
}
