import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async create(createCourseDto: CourseDto) {
    const course = await this.prisma.course.create({
      data: createCourseDto,
    });

    // Clear cached courses list
    await this.cache.del('courses:all');
    return course;
  }

  async findAll() {
    const cached = await this.cache.get('courses:all');
    if (cached) return cached;

    const courses = await this.prisma.course.findMany();
    await this.cache.set('courses:all', courses, 60_000); // cache 1 phút
    return courses;
  }

  async findOne(id: number) {
    const cacheKey = `courses:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const course = await this.prisma.course.findUnique({ where: { id } });
    await this.cache.set(cacheKey, course, 60_000);
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const updated = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });

    // Clear relevant cache
    await this.cache.del('courses:all');
    await this.cache.del(`courses:${id}`);
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.prisma.course.delete({ where: { id } });
    await this.cache.del('courses:all');
    await this.cache.del(`courses:${id}`);
    return deleted;
  }
}
