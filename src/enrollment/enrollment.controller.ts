import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EnrollDto } from './dto/enrollment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Enroll a student into a course' })
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully enrolled in the course.',
  })
  @ApiResponse({
    status: 400,
    description: 'Already enrolled or invalid course ID.',
  })
  async enroll(@Body() dto: EnrollDto, @Req() req) {
    return this.enrollmentService.enroll(dto.courseId, req.user.id);
  }

  @Get(':courseId/students')
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all students enrolled in a specific course' })
  @ApiResponse({
    status: 200,
    description: 'List of students enrolled in the given course.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only instructor or admin can access this.',
  })
  async getStudents(@Param('courseId') courseId: number) {
    return this.enrollmentService.getStudents(Number(courseId));
  }
}
