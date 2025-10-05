import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cache: Cache) {}

  async listAll() {
    const cacheKey = 'courses:all';
    const fromCache = await this.cache.get(cacheKey);
    if (fromCache) return fromCache;

    const courses = await this.prisma.course.findMany({ include: { instructor: true } });
    // await this.cache.set(cacheKey, courses, { ttl: 30 });
    return courses;
  }

  async create(data: { title: string; description?: string; instructorId: number }) {
    const course = await this.prisma.course.create({ data });
    await this.cache.del('courses:all');
    return course;
  }

  async update(id: number, data: any, currentUserId: number, isAdmin = false) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException();
    if (!isAdmin && course.instructorId !== currentUserId) throw new NotFoundException();
    const updated = await this.prisma.course.update({ where: { id }, data });
    await this.cache.del('courses:all');
    return updated;
  }

  async remove(id: number, currentUserId: number, isAdmin = false) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException();
    if (!isAdmin && course.instructorId !== currentUserId) throw new NotFoundException();
    await this.prisma.course.delete({ where: { id } });
    await this.cache.del('courses:all');
    return { ok: true };
  }
}
