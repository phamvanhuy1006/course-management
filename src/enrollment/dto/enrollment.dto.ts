import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class EnrollDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the course to enroll in',
  })
  @IsInt()
  courseId: number;
}
