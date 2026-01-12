import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatPhoneNumber(phone: string): string {
  // Convert to +62 format
  let formatted = phone.replace(/\D/g, '');
  
  if (formatted.startsWith('0')) {
    formatted = '62' + formatted.substring(1);
  } else if (!formatted.startsWith('62')) {
    formatted = '62' + formatted;
  }
  
  return '+' + formatted;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `JRN-${year}${month}${random}`;
}

export function validateInvoiceNumber(invoice: string): boolean {
  const regex = /^JRN-\d{6}$/;
  return regex.test(invoice);
}

export function calculateCustomerStatus(
  lastPaymentDate: string | null,
  dueDate: number
): 'active' | 'overdue' | 'inactive' {
  if (!lastPaymentDate) return 'inactive';
  
  const now = new Date();
  const lastPayment = new Date(lastPaymentDate);
  const currentMonthDue = new Date(now.getFullYear(), now.getMonth(), dueDate);
  
  if (lastPayment >= currentMonthDue) {
    return 'active';
  }
  
  const daysDiff = Math.floor((now.getTime() - currentMonthDue.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 30) {
    return 'overdue';
  }
  
  return 'inactive';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    overdue: 'text-yellow-600 bg-yellow-50',
    inactive: 'text-red-600 bg-red-50',
    verified: 'text-green-600 bg-green-50',
    pending: 'text-yellow-600 bg-yellow-50',
    rejected: 'text-red-600 bg-red-50',
    open: 'text-blue-600 bg-blue-50',
    in_progress: 'text-yellow-600 bg-yellow-50',
    resolved: 'text-green-600 bg-green-50',
    closed: 'text-gray-600 bg-gray-50',
  };
  
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}

export function getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

export function openInGoogleMaps(lat: number, lng: number): void {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank');
}
