export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">LedgerFlow</h1>
      <div className="flex gap-4">
        <a className="underline" href="/upload">Upload Invoice</a>
        <a className="underline" href="/invoices">Invoices</a>
      </div>
    </main>
  );
}
