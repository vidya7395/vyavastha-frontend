import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
// import { fetchUser } from './store/authSlice';
import FinanceDashboard from './pages/FinanceDashboard';
function App() {
  return (
    <BrowserRouter basename="/">
      <Routes path="/">
        <Route index element={<LoginPage />} />

        {/* ✅ Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/finance" element={<FinanceDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
