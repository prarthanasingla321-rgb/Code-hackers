import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InvoicesController } from './routes/invoices';
import { UploadsController } from './routes/uploads';
import { PrismaService } from './prisma';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [InvoicesController, UploadsController],
  providers: [PrismaService],
})
export class AppModule {}