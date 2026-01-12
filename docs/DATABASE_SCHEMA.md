# Juron.Net Database Schema

This document describes the complete database schema for the Juron.Net ISP Management System using Supabase/PostgreSQL.

## Tables

### 1. customers

Customer information and subscription details.

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  package_id UUID REFERENCES packages(id),
  monthly_fee DECIMAL(10, 2) NOT NULL,
  due_date INTEGER NOT NULL CHECK (due_date >= 1 AND due_date <= 31),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'overdue', 'inactive')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_invoice ON customers(invoice_number);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_location ON customers(latitude, longitude);
```

### 2. payments

Payment records and verification tracking.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  invoice_number VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  payment_method VARCHAR(50) NOT NULL,
  proof_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_month ON payments(payment_month);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

### 3. expenses

Business expense tracking.

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  vendor VARCHAR(255),
  payment_method VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100),
  receipt_url TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
```

**Expense Categories:**
- Infrastructure (Cables, Routers, Equipment)
- Salaries (Technician, Admin)
- Marketing (Ads, Promotions)
- Maintenance (Repairs, Servicing)
- Utilities (Electricity, Internet)
- Office Supplies
- Transportation
- Other

### 4. income

Manual income entries (non-subscription sources).

```sql
CREATE TABLE income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  source VARCHAR(255),
  payment_method VARCHAR(50) NOT NULL,
  reference_number VARCHAR(100),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_income_date ON income(date);
CREATE INDEX idx_income_category ON income(category);
```

**Income Categories:**
- Monthly Subscriptions (auto from payments)
- New Installations
- Late Payment Fees
- Equipment Sales
- Service Calls
- Other Income

### 5. packages

Internet service packages.

```sql
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  download_speed VARCHAR(20) NOT NULL,
  upload_speed VARCHAR(20) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quota VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_active ON packages(is_active);
```

**Example Packages:**
- 20 Mbps - Rp 200,000/month
- 50 Mbps - Rp 350,000/month
- 100 Mbps - Rp 500,000/month

### 6. tickets

Customer support tickets.

```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  admin_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tickets_customer ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
```

### 7. users

Admin and technician accounts.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'technician' CHECK (role IN ('super_admin', 'admin', 'technician')),
  permissions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Roles:**
- `super_admin`: Full access (juronnett@gmail.com)
- `admin`: Management access
- `technician`: Field operations only

### 8. settings

Application configuration settings.

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
```

**Key Settings:**
- `auto_isolir_days`: Days before automatic isolation (default: 30)
- `whatsapp_templates`: WhatsApp message templates
- `payment_methods`: Accepted payment methods
- `allowed_admin_emails`: List of allowed admin emails

## Row Level Security (RLS) Policies

### Enable RLS on all tables:

```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

### Customer Access Policies:

```sql
-- Customers can read their own data
CREATE POLICY customers_read_own 
  ON customers FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM users WHERE email = customers.email));

-- Customers can update their own contact info
CREATE POLICY customers_update_own 
  ON customers FOR UPDATE 
  USING (auth.uid() IN (SELECT id FROM users WHERE email = customers.email))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE email = customers.email));
```

### Admin/Staff Access Policies:

```sql
-- Admins can do everything
CREATE POLICY admin_all_customers 
  ON customers FOR ALL 
  USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('super_admin', 'admin', 'technician')));

CREATE POLICY admin_all_payments 
  ON payments FOR ALL 
  USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('super_admin', 'admin', 'technician')));

CREATE POLICY admin_all_expenses 
  ON expenses FOR ALL 
  USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('super_admin', 'admin')));

CREATE POLICY admin_all_income 
  ON income FOR ALL 
  USING (auth.uid() IN (SELECT id FROM users WHERE role IN ('super_admin', 'admin')));
```

## Triggers

### Update timestamp trigger:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-update customer status trigger:

```sql
CREATE OR REPLACE FUNCTION update_customer_status()
RETURNS TRIGGER AS $$
DECLARE
  customer_due_date INTEGER;
  days_overdue INTEGER;
BEGIN
  SELECT due_date INTO customer_due_date 
  FROM customers 
  WHERE id = NEW.customer_id;
  
  IF NEW.status = 'verified' THEN
    UPDATE customers 
    SET 
      last_payment_date = NEW.payment_date,
      status = 'active'
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_verified_trigger 
  AFTER UPDATE ON payments 
  FOR EACH ROW 
  WHEN (NEW.status = 'verified' AND OLD.status != 'verified')
  EXECUTE FUNCTION update_customer_status();
```

## Views

### Monthly Financial Summary View:

```sql
CREATE OR REPLACE VIEW monthly_financial_summary AS
SELECT 
  TO_CHAR(date, 'YYYY-MM') as month,
  SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
  SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
  SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_profit
FROM (
  SELECT date, amount, 'income' as type FROM income
  UNION ALL
  SELECT payment_date as date, amount, 'income' as type 
  FROM payments WHERE status = 'verified'
  UNION ALL
  SELECT date, amount, 'expense' as type FROM expenses
) combined
GROUP BY TO_CHAR(date, 'YYYY-MM')
ORDER BY month DESC;
```

## Seed Data

### Default Packages:

```sql
INSERT INTO packages (name, download_speed, upload_speed, price, quota, description) VALUES
('Paket Home 20', '20 Mbps', '10 Mbps', 200000, 'Unlimited', 'Paket rumahan untuk browsing dan streaming'),
('Paket Home 50', '50 Mbps', '25 Mbps', 350000, 'Unlimited', 'Paket untuk keluarga dengan banyak device'),
('Paket Business 100', '100 Mbps', '50 Mbps', 500000, 'Unlimited', 'Paket bisnis dengan prioritas tinggi');
```

### Default Settings:

```sql
INSERT INTO settings (key, value, description) VALUES
('auto_isolir_days', '30', 'Jumlah hari sebelum isolir otomatis'),
('payment_methods', '["Transfer Bank", "Cash", "E-Wallet", "QRIS"]', 'Metode pembayaran yang diterima'),
('whatsapp_reminder_enabled', 'true', 'Aktifkan reminder WhatsApp otomatis'),
('allowed_admin_domains', '["juron.net", "gmail.com"]', 'Domain email yang diizinkan untuk admin');
```

### Super Admin User:

```sql
-- Note: This should be created through Supabase Auth first
-- Then insert into users table
INSERT INTO users (id, email, full_name, role, is_active) VALUES
('auth-user-id-here', 'juronnett@gmail.com', 'Super Admin', 'super_admin', true);
```

## Backup and Maintenance

### Automated Daily Backups:
Configure Supabase to perform daily backups at 2 AM UTC.

### Data Retention:
- Payments: Keep indefinitely
- Tickets: Archive after 1 year
- Expenses: Keep indefinitely
- Audit logs: Keep for 2 years

## Security Considerations

1. **Encryption**: All sensitive data is encrypted at rest
2. **Access Control**: Use RLS policies for row-level access
3. **API Keys**: Never expose anon key in public repositories
4. **Audit Trail**: Log all financial transactions
5. **Backups**: Daily automated backups with 30-day retention

## Migration Steps

1. Create a new Supabase project
2. Run all CREATE TABLE statements in order
3. Enable RLS on all tables
4. Create RLS policies
5. Create triggers and functions
6. Create views
7. Insert seed data
8. Test with sample data
9. Configure backups
10. Set up monitoring alerts
