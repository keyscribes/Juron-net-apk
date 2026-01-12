import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

// Pages
import LoginPortal from './pages/LoginPortal';
import CustomerLogin from './pages/auth/CustomerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import CustomerManagement from './pages/admin/CustomerManagement';
import FinancialDashboard from './pages/admin/FinancialDashboard';
import PaymentVerification from './pages/admin/PaymentVerification';
import MapsView from './pages/admin/MapsView';
import CustomerPortal from './pages/customer/CustomerPortal';
import AdminLayout from './components/layouts/AdminLayout';
import CustomerLayout from './components/layouts/CustomerLayout';

function App() {
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch user details from database
        fetchUserDetails(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserDetails(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  const fetchUserDetails = async (id: string, email: string) => {
    try {
      // Check if user is admin/technician
      const { data: adminUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminUser) {
        setUser({
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
        });
        return;
      }

      // Check if user is customer
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (customer) {
        setUser({
          id: customer.id,
          email: customer.email || '',
          full_name: customer.name,
          role: 'customer',
          invoice_number: customer.invoice_number,
        });
        return;
      }

      // No user found
      setUser(null);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser(null);
    }
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPortal />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            user && ['super_admin', 'admin', 'technician'].includes(user.role) ? (
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="customers" element={<CustomerManagement />} />
                  <Route path="financial" element={<FinancialDashboard />} />
                  <Route path="payments" element={<PaymentVerification />} />
                  <Route path="maps" element={<MapsView />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Customer Routes */}
        <Route
          path="/customer/portal"
          element={
            user && user.role === 'customer' ? (
              <CustomerLayout>
                <CustomerPortal />
              </CustomerLayout>
            ) : (
              <Navigate to="/customer/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
