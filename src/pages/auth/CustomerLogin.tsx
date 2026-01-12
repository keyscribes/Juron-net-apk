import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvoiceLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate invoice number format
      if (!/^JRN-\d{6}$/.test(invoiceNumber)) {
        toast.error('Invalid invoice number format. Use JRN-XXXXXX');
        return;
      }

      // Find customer by invoice number and phone
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('invoice_number', invoiceNumber)
        .eq('phone', phoneNumber)
        .single();

      if (error || !customer) {
        toast.error('Invalid invoice number or phone number');
        return;
      }

      setUser({
        id: customer.id,
        email: customer.email || '',
        full_name: customer.name,
        role: 'customer',
        invoice_number: customer.invoice_number,
      });

      toast.success('Login successful!');
      navigate('/customer/portal');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/customer/portal`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
          <CardTitle className="text-2xl">Customer Login</CardTitle>
          <CardDescription>
            Login with your invoice number or Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invoice Login Form */}
          <form onSubmit={handleInvoiceLogin} className="space-y-4">
            <div>
              <label htmlFor="invoice" className="block text-sm font-medium mb-2">
                Invoice Number
              </label>
              <input
                id="invoice"
                type="text"
                placeholder="JRN-240501"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+6281234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login with Invoice'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
