import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="w-fit mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>Restricted Access</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-yellow-800 mb-1">Authorized Personnel Only</p>
            <p className="text-yellow-700">
              Only approved @juron.net email addresses and authorized Google accounts can access this portal.
            </p>
          </div>

          <Button
            type="button"
            className="w-full bg-gray-800 hover:bg-gray-900"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-gray-500">
            Attempting to access without authorization will be logged and reported.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
