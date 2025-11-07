"use client";
import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File|null>(null);

  const doUpload = async () => {
    if (!file) return;
    const presign = await fetch(process.env.NEXT_PUBLIC_API + "/uploads/presign", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type || "application/pdf" })
    }).then(r=>r.json());

    await fetch(presign.url, { method: "PUT", body: file }); // upload to MinIO directly

    // call API to extract & create invoice
    const inv = await fetch(process.env.NEXT_PUBLIC_API + "/invoices/extract", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storageKey: presign.storageKey })
    }).then(r=>r.json());

    alert("Invoice created: " + inv.id);
    window.location.href = "/invoices";
  };

  return (
    <main className="p-8 space-y-4">
      <h2 className="text-xl font-semibold">Upload Invoice</h2>
      <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
      <button className="px-3 py-1 border rounded" onClick={doUpload} disabled={!file}>
        Upload & Extract
      </button>
    </main>
  );
}
