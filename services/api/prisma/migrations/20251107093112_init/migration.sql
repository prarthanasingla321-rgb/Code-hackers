-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT,
    "vendorName" TEXT,
    "invoiceDate" DATETIME,
    "dueDate" DATETIME,
    "currency" TEXT DEFAULT 'INR',
    "subtotal" DECIMAL,
    "taxTotal" DECIMAL,
    "total" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "confidence" REAL NOT NULL DEFAULT 0,
    "documentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT,
    "qty" DECIMAL,
    "unitPrice" DECIMAL,
    "taxCode" TEXT,
    "accountCode" TEXT,
    "lineTotal" DECIMAL,
    CONSTRAINT "InvoiceLine_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_documentId_key" ON "Invoice"("documentId");
