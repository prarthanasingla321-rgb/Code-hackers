from fastapi import FastAPI
from pydantic import BaseModel
import re, os, boto3

app = FastAPI()

S3_ENDPOINT = os.environ.get("S3_ENDPOINT", "http://minio:9000")
S3_BUCKET = os.environ.get("S3_BUCKET", "ledgerflow")
S3_ACCESS_KEY = os.environ.get("S3_ACCESS_KEY", "admin")
S3_SECRET_KEY = os.environ.get("S3_SECRET_KEY", "adminadmin")

s3 = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name="us-east-1",
)

class ExtractFromS3Req(BaseModel):
    storage_key: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/extract_from_s3")
def extract_from_s3(req: ExtractFromS3Req):
    # For hackathon speed: just read bytes and pretend OCR output;
    # you can integrate real OCR later.
    # obj = s3.get_object(Bucket=S3_BUCKET, Key=req.storage_key)
    # pdf_bytes = obj["Body"].read()
    fake_text = """
    VENDOR: ACME SUPPLIES PVT LTD
    INVOICE NO: INV-1234
    INVOICE DATE: 2025-10-01
    DUE DATE: 2025-10-31
    CURRENCY: INR
    SUBTOTAL: 1000.00
    TAX TOTAL: 180.00
    TOTAL: 1180.00
    LINES:
    - QTY: 2 | DESC: USB-C Cable | UNIT: 200.00 | TOTAL: 400.00 | ACCT: 6020 | TAX: GST18
    - QTY: 3 | DESC: Charger | UNIT: 200.00 | TOTAL: 600.00 | ACCT: 6020 | TAX: GST18
    """
    # very naive regex parse:
    def num(rx):
        m = re.search(rx, fake_text); 
        return float(m.group(1)) if m else None
    def txt(rx):
        m = re.search(rx, fake_text); 
        return m.group(1) if m else None

    data = {
      "number": txt(r"INVOICE NO:\s*([A-Z0-9\-]+)"),
      "vendorName": txt(r"VENDOR:\s*(.+)"),
      "invoiceDate": txt(r"INVOICE DATE:\s*([\d\-]+)"),
      "dueDate": txt(r"DUE DATE:\s*([\d\-]+)"),
      "currency": txt(r"CURRENCY:\s*([A-Z]{3})") or "INR",
      "subtotal": num(r"SUBTOTAL:\s*([\d\.]+)"),
      "taxTotal": num(r"TAX TOTAL:\s*([\d\.]+)"),
      "total": num(r"TOTAL:\s*([\d\.]+)")
    }
    lines = [
      {"description": "USB-C Cable", "qty": 2, "unitPrice": 200.00, "accountCode": "6020", "taxCode": "GST18", "lineTotal": 400.00},
      {"description": "Charger", "qty": 3, "unitPrice": 200.00, "accountCode": "6020", "taxCode": "GST18", "lineTotal": 600.00}
    ]
    confidence = 0.93
    return {"data": data, "lines": lines, "confidence": confidence}
