import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import LoginPage from './pages/LoginPage'; // Login is initial route
import ProtectedRoute from './components/protectedRoute';
import ComingSoon from './pages/ComingSoon';

// Lazy-loaded routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FinanceDashboard = lazy(() => import('./pages/FinanceDashboard'));

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route index element={<LoginPage />} />

        {/* ✅ Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <Suspense
                fallback={
                  <span style={{ fontSize: 12 }}>Loading dashboard...</span>
                }
              >
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/finance"
            element={
              <Suspense
                fallback={
                  <span style={{ fontSize: 12 }}>Loading finance...</span>
                }
              >
                <FinanceDashboard />
              </Suspense>
            }
          />
          <Route path="/setting" element={<ComingSoon />} />
          <Route path="/help" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
