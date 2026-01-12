import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Shield } from 'lucide-react';

export default function LoginPortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Juron.Net</h1>
          <p className="text-lg text-gray-600">Internet Service Provider Management</p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Portal Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Customer Portal</CardTitle>
              <CardDescription className="text-base">
                Login with your invoice number or Google account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Check payment status
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Upload payment proof
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  View service details
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Submit support tickets
                </p>
              </div>
              <Button
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={() => navigate('/customer/login')}
              >
                Login as Customer
              </Button>
            </CardContent>
          </Card>

          {/* Admin/Technician Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-gray-700">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription className="text-base">
                Restricted access for administrators and technicians
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  Manage customers
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  Track financials
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  Verify payments
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  Map view & GPS tracking
                </p>
              </div>
              <Button
                className="w-full mt-4 bg-gray-800 hover:bg-gray-900"
                size="lg"
                onClick={() => navigate('/admin/login')}
              >
                Login as Admin
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Juron.Net. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
