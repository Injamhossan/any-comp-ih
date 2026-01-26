export default function ESignaturePage() {
  return (
    <div className="flex-1 bg-white min-h-screen font-sans text-gray-900 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">eSignature</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage electronic signatures and documents.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-gray-200 p-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">No documents pending</h3>
        <p className="mt-1 text-sm text-gray-500">Upload a document to get started.</p>
      </div>
    </div>
  );
}
