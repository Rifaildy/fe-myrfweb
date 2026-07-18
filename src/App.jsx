import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import ParticlesBg from './components/ui/ParticlesBg';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Anett from './pages/Anett';
import Random from './pages/Random';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-deepest)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '1rem',
        gap: '1rem',
        flexDirection: 'column',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(59,130,246,0.2)',
          borderTop: '3px solid var(--blue-main)',
          borderRadius: '50%',
          animation: 'spin-slow 0.8s linear infinite',
        }} />
        Authenticating...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <ParticlesBg />
    <Navbar />
    {children}
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/anett" element={<Anett />} />
      <Route path="/random" element={<Random />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomCursor />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
