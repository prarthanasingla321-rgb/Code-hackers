import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('invoices')
export class InvoicesController {
constructor(private prisma: PrismaService, private http: HttpService) {}

@Get()
async list() {
    return this.prisma.invoice.findMany({ include: { lines: true, document: true }, orderBy: { createdAt: 'desc' } });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.prisma.invoice.findUnique({ where: { id }, include: { lines: true, document: true } });
  }

  // Kick off AI extraction from a storageKey (uploaded file)
  @Post()
  async extract(@Body() body: { storageKey: string }) {
    // 1) Create Document
    const doc = await this.prisma.document.create({
      data: { storageKey: body.storageKey, mimeType: 'application/pdf' },
    });

    // 2) Call AI Worker OCR+Extract (simplified: one endpoint to do both)
    const res = await firstValueFrom(
      this.http.post(`${process.env.AI_WORKER_URL}/extract_from_s3`, { storage_key: body.storageKey })
    );
    const { data, confidence, lines } = res.data;

    // 3) Persist Invoice + Lines
    const inv = await this.prisma.invoice.create({
      data: {
        ...data,
        documentId: doc.id,
        confidence,
        lines: { create: (lines || []).map((l: any) => ({ ...l })) },
      },
      include: { lines: true },
    });

    return inv;
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string) {
    return this.prisma.invoice.update({ where: { id }, data: { status: 'approved' } });
  }
}
