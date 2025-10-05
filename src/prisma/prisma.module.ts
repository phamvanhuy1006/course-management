import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export PrismaService để các module khác có thể sử dụng
})
export class PrismaModule {}
