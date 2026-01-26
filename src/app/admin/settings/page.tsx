export default function SettingsPage() {
  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and preferences.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-gray-200 p-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">General Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Configuration options will appear here.</p>
      </div>
    </div>
  );
}
