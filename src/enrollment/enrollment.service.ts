import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enroll(courseId: number, userId: number) {
    const existing = await this.prisma.enrollment.findUnique({
      where: {
        courseId_studentId: { courseId, studentId: userId },
      },
    });

    if (existing) throw new BadRequestException('Already enrolled');

    return this.prisma.enrollment.create({
      data: { courseId, studentId: userId },
    });
  }

  async getStudents(courseId: number) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: { student: true },
    });
  }
}
