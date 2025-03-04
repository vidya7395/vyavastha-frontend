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
      <iframe
        src="http://localhost:8088/superset/dashboard/p/MQqW48zAp9G/?standalone=1"
        width="100%"
        height="600px"
        style={{ border: 'none' }}
      />
      <iframe
        width="600"
        height="400"
        seamless
        frameBorder="0"
        scrolling="no"
        src="http://localhost:8088/superset/explore/p/PgEnz6Q7q05/?standalone=1&height=400"
      ></iframe>

      <Routes basename="/login">
        <Route path="/login" element={<LoginPage />} />

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
