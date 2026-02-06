import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module.js';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ResponseInterceptors } from './common/interceptors/response-interceptors.interceptor.js';
import { ErrorReponseInterceptor } from './common/interceptors/error-reponse.interceptor.js';
import { ActivityTrackingInterceptor } from './common/interceptors/activity-tracking.interceptor.js';
import { ActivityLogService } from './module/logs-module/activity-log.service.js';
import { DatabaseService } from './common/database/database.service.js';
import { RolesGuard } from './common/security/guards/roles.guard.js';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule, {
    cors: true,
    bodyParser: true,
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  useContainer(app.select(AppModule, { abortOnError: true }), {
    fallbackOnErrors: true,
  });

  const logService = new ActivityLogService(new DatabaseService());

  app.useGlobalInterceptors(
    new ResponseInterceptors(),
    new ErrorReponseInterceptor(),
    new ActivityTrackingInterceptor(logService),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        interface FormattedError {
          property: string;
          errors: string[];
        }

        const formatErrors = (errors: ValidationError[]): FormattedError[] => {
          const formattedErrors: FormattedError[] = [];
          for (const error of errors) {
            if (error.constraints) {
              formattedErrors.push({
                property: error.property,
                errors: Object.values(error.constraints),
              });
            }
            if (error.children && error.children.length > 0) {
              formattedErrors.push(...formatErrors(error.children));
            }
          }
          return formattedErrors;
        };

        const formattedValidationErrors = formatErrors(validationErrors);

        return new BadRequestException({
          message: 'Input Validation is Failed',
          errors: formattedValidationErrors,
        });
      },
    }),
  );

  app.useGlobalGuards(new RolesGuard(new Reflector()));

  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
void bootstrap();
