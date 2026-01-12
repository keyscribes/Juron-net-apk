import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function CustomerLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Juron.Net Customer Portal</h1>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
