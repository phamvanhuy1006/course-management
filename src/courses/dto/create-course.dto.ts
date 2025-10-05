import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'NestJS Fundamentals' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Learn how to build scalable backend with NestJS',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CourseDto extends CreateCourseDto {
  @ApiProperty({ example: 2, description: 'Instructor ID' })
  @IsInt()
  instructorId: number;
}
