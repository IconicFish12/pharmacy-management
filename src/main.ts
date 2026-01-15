import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ResponseInterceptors } from './common/interceptors/response-interceptors.interceptor';
import { ErrorReponseInterceptor } from './common/interceptors/error-reponse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
    logger: ['error', 'warn', 'debug', 'verbose'],
  });
  useContainer(app.select(AppModule, { abortOnError: true }), {
    fallbackOnErrors: true,
  });

  app.useGlobalInterceptors(
    new ResponseInterceptors(),
    new ErrorReponseInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
    // new CostumeValidationPipe(),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
