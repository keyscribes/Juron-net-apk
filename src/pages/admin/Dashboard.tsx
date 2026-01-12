export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">
        Admin dashboard with KPIs, charts, and recent activity will be implemented here.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards will go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-3xl font-bold">142</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Monthly Revenue</p>
          <p className="text-3xl font-bold">Rp 28.4M</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Pending Payments</p>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
}
