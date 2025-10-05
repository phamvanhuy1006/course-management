import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();

    // Định nghĩa middleware để bắt ngoại lệ trong mọi query
    this.$use(async (params, next) => {
      try {
        // Thực hiện truy vấn tiếp theo
        const result = await next(params);
        return result;
      } catch (error) {
        console.error(`Error with Prisma query: ${params.model} - ${params.action}`);
        console.error(error);
        // Ném lỗi với thông điệp rõ ràng
        throw new Error(`Database operation failed: ${error.message}`);
      }
    });
  }
}
