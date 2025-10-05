import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
// import { redisStore } from 'cache-manager-ioredis';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        // store: redisStore,
        url: process.env.REDIS_URL,
        ttl: 30, // default cache ttl,
      }),
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    PrismaModule,
    EnrollmentModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
