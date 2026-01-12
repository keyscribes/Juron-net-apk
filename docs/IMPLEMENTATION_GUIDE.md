# Juron.Net Implementation Guide

This guide provides step-by-step instructions to complete the implementation of the Juron.Net ISP Management System.

## Current Status

✅ **Completed:**
- Project structure and configuration
- Package dependencies setup
- Database schema design
- Type definitions
- Supabase client configuration
- Authentication store (Zustand)
- Utility functions (formatting, GPS, validation)
- Base UI components (Button, Card)
- Main routing structure (App.tsx)
- Login portal page
- PWA manifest
- Environment variables template
- Comprehensive documentation

🚧 **To Be Implemented:**

The following files need to be created based on the requirements. Stub files have been created to show the structure:

### 1. Authentication Pages (Priority: HIGH)

**Customer Login** - `src/pages/auth/CustomerLogin.tsx`
- Invoice number input with validation (JRN-XXXXXX format)
- Google OAuth button
- Phone verification for invoice login
- Redirect to customer portal on success

**Admin Login** - `src/pages/auth/AdminLogin.tsx`
- Google OAuth only
- Email domain validation (@juron.net or approved emails)
- Role-based redirect
- Remember me functionality

### 2. Layout Components (Priority: HIGH)

**Admin Layout** - `src/components/layouts/AdminLayout.tsx`
- Top navigation bar
- Sidebar with menu items:
  - Dashboard
  - Customers
  - Financial
  - Payments
  - Maps
  - Settings
- User profile dropdown
- Logout button
- Dark mode toggle

**Customer Layout** - `src/components/layouts/CustomerLayout.tsx`
- Simple header with logo
- Customer info display
- Logout button
- Navigation tabs (if needed)

### 3. Admin Pages (Priority: HIGH)

**Dashboard** - `src/pages/admin/Dashboard.tsx`
Features:
- 4 KPI cards (Total Customers, Monthly Revenue, Pending Payments, Overdue)
- Recent activity feed
- Quick actions
- Mini map preview
- Monthly revenue chart

**Customer Management** - `src/pages/admin/CustomerManagement.tsx`
Features:
- Customer list table with search/filter
- Add customer modal with GPS location picker
- Edit/delete customer
- Bulk actions
- Export to CSV
- Status filtering (Active/Overdue/Inactive)

**Financial Dashboard** - `src/pages/admin/FinancialDashboard.tsx`
Features:
- Monthly income vs expense chart
- Category breakdown pie charts
- Add expense form
- Add manual income form
- Transaction list
- Export reports
- Date range filter

**Payment Verification** - `src/pages/admin/PaymentVerification.tsx`
Features:
- Pending payments list
- Payment proof viewer (image)
- Approve/Reject buttons with notes
- Payment history
- Bulk verification
- WhatsApp notification preview

**Maps View** - `src/pages/admin/MapsView.tsx`
Features:
- Interactive Leaflet map
- Customer markers (color-coded by status)
- Marker clustering
- Filter by status
- Customer detail popup
- "Open in Google Maps" link
- Technician location tracking (optional)

### 4. Customer Pages (Priority: MEDIUM)

**Customer Portal** - `src/pages/customer/CustomerPortal.tsx`
Features:
- Account overview
- Current package details
- Payment status
- Upload payment proof
- Payment history
- Submit ticket
- View open tickets

### 5. Feature Components (Priority: HIGH)

**Location Picker** - `src/components/features/LocationPicker.tsx`
Features:
- "Get Current Location" button
- Display lat/long with accuracy
- Mini map preview
- Manual coordinate input
- Copy coordinates button
- Address geocoding (optional)

**Customer Form** - `src/components/features/CustomerForm.tsx`
Features:
- Form fields (name, phone, email, package, due date, address)
- Location picker integration
- Validation with react-hook-form + zod
- Submit handler
- Edit mode support

**Payment Proof Viewer** - `src/components/features/PaymentProofViewer.tsx`
Features:
- Image viewer with zoom
- Payment details display
- Approve/reject form
- Notes textarea
- Status indicator

**Financial Charts** - `src/components/features/FinancialCharts.tsx`
Features:
- Line chart (income vs expenses over time)
- Pie chart (expense categories)
- Bar chart (monthly comparison)
- Uses recharts library

**Map Component** - `src/components/features/MapView.tsx`
Features:
- React-Leaflet integration
- OpenStreetMap tiles
- Custom markers
- Marker clustering
- Popup with customer info
- Layer controls

### 6. Additional UI Components (Priority: MEDIUM)

Create in `src/components/ui/`:
- `Input.tsx` - Text input component
- `Select.tsx` - Dropdown select
- `Label.tsx` - Form label
- `Table.tsx` - Data table
- `Modal.tsx` - Modal dialog
- `Tabs.tsx` - Tab component
- `Badge.tsx` - Status badge
- `Avatar.tsx` - User avatar
- `Switch.tsx` - Toggle switch
- `Toast.tsx` - Notification toast

### 7. Hooks (Priority: MEDIUM)

Create in `src/hooks/`:
- `useCustomers.ts` - Customer CRUD operations
- `usePayments.ts` - Payment operations
- `useFinancials.ts` - Financial data queries
- `useAuth.ts` - Authentication helpers
- `useGeolocation.ts` - GPS location hook

### 8. API Services (Priority: MEDIUM)

Create in `src/services/`:
- `customerService.ts` - Customer API calls
- `paymentService.ts` - Payment API calls
- `financialService.ts` - Financial API calls
- `whatsappService.ts` - WhatsApp integration

### 9. PWA Configuration (Priority: LOW)

Update `vite.config.ts`:
- Add vite-plugin-pwa
- Configure service worker
- Cache strategies
- Offline support

### 10. Testing (Priority: LOW)

- Unit tests for utility functions
- Integration tests for API calls
- E2E tests for critical flows

## Implementation Order

### Week 1: Core Authentication & Structure
1. ✅ Setup project structure
2. ✅ Configure Supabase
3. ✅ Create database schema
4. Complete authentication pages
5. Build layout components
6. Test login flows

### Week 2: Admin Dashboard & Customer Management
1. Build admin dashboard with KPIs
2. Create customer management page
3. Implement location picker component
4. Add customer CRUD operations
5. Integrate maps view

### Week 3: Financial System
1. Create financial dashboard
2. Implement expense tracking
3. Add income tracking
4. Build financial charts
5. Export functionality

### Week 4: Payment System & Customer Portal
1. Build payment verification page
2. Create customer portal
3. Implement file upload for payment proofs
4. WhatsApp notification integration
5. Test end-to-end flows

### Week 5: Polish & Deploy
1. Add remaining UI components
2. Implement dark mode
3. PWA configuration
4. Performance optimization
5. Deploy to production

## Code Examples

### Example: Customer Form Component

```typescript
// src/components/features/CustomerForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LocationPicker } from './LocationPicker';

const customerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, 'Invalid phone number'),
  email: z.string().email().optional(),
  package_id: z.string().uuid(),
  monthly_fee: z.number().positive(),
  due_date: z.number().min(1).max(31),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export function CustomerForm({ onSubmit, initialData }: Props) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <LocationPicker 
        onChange={(location) => {
          form.setValue('latitude', location.latitude);
          form.setValue('longitude', location.longitude);
        }}
      />
      <Button type="submit">Save Customer</Button>
    </form>
  );
}
```

### Example: Location Picker Component

```typescript
// src/components/features/LocationPicker.tsx
import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { getCurrentLocation } from '../../lib/utils';
import { Button } from '../ui/Button';
import { MapPin, Copy } from 'lucide-react';

export function LocationPicker({ onChange }: Props) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
      onChange(loc);
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        type="button" 
        onClick={handleGetLocation}
        disabled={loading}
      >
        <MapPin className="mr-2 h-4 w-4" />
        {loading ? 'Getting location...' : 'Get Current Location'}
      </Button>
      
      {location && (
        <>
          <div className="text-sm">
            <p>Lat: {location.latitude.toFixed(6)}</p>
            <p>Lng: {location.longitude.toFixed(6)}</p>
            <p>Accuracy: {location.accuracy.toFixed(0)}m</p>
          </div>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={16}
            className="h-64 w-full rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.latitude, location.longitude]} />
          </MapContainer>
        </>
      )}
    </div>
  );
}
```

### Example: Using React Query for Data Fetching

```typescript
// src/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*, packages(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: NewCustomer) => {
      const { data, error } = await supabase
        .from('customers')
        .insert(customer)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
```

## Testing the Application

### 1. Setup Test Database

Create a separate Supabase project for testing or use local Supabase with Docker.

### 2. Seed Test Data

```sql
-- Insert test package
INSERT INTO packages (name, download_speed, upload_speed, price) 
VALUES ('Test Package', '50 Mbps', '25 Mbps', 350000);

-- Insert test customer
INSERT INTO customers (
  invoice_number, name, phone, package_id, 
  monthly_fee, due_date, address, latitude, longitude
) VALUES (
  'JRN-240501', 'Test Customer', '+6281234567890',
  'package-id-here', 350000, 10, 
  'Test Address', -6.200000, 106.816666
);
```

### 3. Test Authentication

- Test invoice login with valid/invalid numbers
- Test Google OAuth
- Test role-based redirects
- Test logout

### 4. Test Customer Management

- Add new customer with GPS
- Edit customer details
- Delete customer
- Filter and search
- Export to CSV

### 5. Test Financial System

- Add expenses
- Add manual income
- View monthly reports
- Export data

### 6. Test Payment Verification

- Upload payment proof
- Approve payment
- Reject payment
- Check WhatsApp notification

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase database migrations run
- [ ] RLS policies enabled
- [ ] Google OAuth configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] PWA manifest correct
- [ ] Service worker configured
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics enabled (Plausible/GA)
- [ ] Backup schedule configured
- [ ] Monitoring alerts set up

## Performance Optimization

1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Image Optimization**: Use WebP format, lazy loading
3. **Bundle Size**: Analyze with vite-bundle-visualizer
4. **Caching**: Configure service worker cache strategies
5. **Database**: Add indexes on frequently queried columns
6. **API**: Use React Query for caching and deduplication

## Security Checklist

- [ ] Environment variables not exposed
- [ ] RLS policies tested
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens (handled by Supabase)
- [ ] Rate limiting on sensitive endpoints
- [ ] Audit logs for financial transactions
- [ ] Regular security updates

## Maintenance

### Daily
- Monitor error logs
- Check payment verification queue
- Review customer tickets

### Weekly
- Database backup verification
- Performance metrics review
- Security patch updates

### Monthly
- Financial reconciliation
- Customer satisfaction survey
- Feature usage analytics

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Leaflet**: https://react-leaflet.js.org
- **Zustand**: https://github.com/pmndrs/zustand

## Getting Help

If you encounter issues:

1. Check the documentation in `docs/`
2. Review the database schema
3. Check Supabase dashboard for errors
4. Review browser console for client errors
5. Contact: juronnett@gmail.com

---

**Note**: This is a living document. Update as implementation progresses.
