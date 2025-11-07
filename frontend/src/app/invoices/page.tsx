async function getData() {
  const res = await fetch(process.env.NEXT_PUBLIC_API + "/invoices", { cache: "no-store" });
  return res.json();
}
export default async function Invoices() {
  const data = await getData();
  return (
    <main className="p-8">
      <h2 className="text-xl font-semibold mb-4">Invoices</h2>
      <table className="w-full border">
        <thead><tr className="bg-gray-100">
          <th className="p-2 text-left">Number</th>
          <th className="p-2 text-left">Vendor</th>
          <th className="p-2 text-left">Total</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Actions</th>
        </tr></thead>
        <tbody>
          {data.map((inv:any)=>(
            <tr key={inv.id} className="border-t">
              <td className="p-2">{inv.number || "-"}</td>
              <td className="p-2">{inv.vendorName || "-"}</td>
              <td className="p-2">{inv.total ? `${inv.total} ${inv.currency}` : "-"}</td>
              <td className="p-2">{inv.status}</td>
              <td className="p-2">
                {inv.status !== "approved" && (
                  <form action={`${process.env.NEXT_PUBLIC_API}/invoices/${inv.id}/approve`} method="post">
                    <button className="px-2 py-1 border rounded" formMethod="PUT">Approve</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
