import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom'; // 1. Import Outlet
import DashboardLayout from '../components/DashboardLayout';
import Loading from '../components/Loading';

// Import the dashboard "home" pages
import TenantAdminDashboard from './dashboards/TenantAdminDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';

export default function Dashboard() {
  const { authInfo, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !authInfo) {
      navigate('/login');
    }
  }, [authInfo, loading, navigate]);

  if (loading || !authInfo) {
    return <Loading />;
  }

  const { user, tenant } = authInfo;

  // 2. This is the new component for the "index" page
  const DashboardHome = user.role === 'admin' ? 
    <TenantAdminDashboard user={user} tenant={tenant} /> : 
    <CustomerDashboard user={user} tenant={tenant} />;

  return (
    <DashboardLayout>
      {/* 3. 'Outlet' is a placeholder from react-router-dom.
        It will render the correct child page (e.g., StoreSettingsPage)
        based on the URL. If the URL is just '/dashboard', it
        will render nothing. We'll fix this in the next step.
      */}
      <Outlet />
    </DashboardLayout>
  );
}