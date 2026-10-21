import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import ReportPage from './pages/ReportPage.jsx'
import TrackPage from './pages/TrackPage.jsx'
import MapPage from './pages/MapPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import MissionsPage from './pages/MissionsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lapor" element={<ReportPage />} />
        <Route path="/lapor/:locationId" element={<ReportPage />} />
        <Route path="/lacak" element={<TrackPage />} />
        <Route path="/lacak/:code" element={<TrackPage />} />
        <Route path="/peta" element={<MapPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/misi" element={<MissionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}