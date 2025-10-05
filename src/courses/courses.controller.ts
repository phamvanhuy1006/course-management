import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Create a new course (Admin/INSTRUCTOR only)' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  createCourse(@Body() dto: CreateCourseDto, @Req() req) {
    const instructorId = req.user.userId;
    return this.coursesService.create({ ...dto, instructorId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses (Public)' })
  @ApiResponse({ status: 200, description: 'List of all courses.' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific course by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Course details.' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiOperation({ summary: 'Update course by ID (Admin/Teacher only)' })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete course by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
}
