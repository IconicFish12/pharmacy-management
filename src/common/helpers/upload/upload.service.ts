import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
import { memoryStorage } from 'multer';

@Injectable()
export class UploadService implements MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      // dest: 'src/common/helpers/upload/images',
      // storage: diskStorage({
      //   destination: 'src/common/helpers/upload/images',
      //   filename(req, file, callback) {
      //     const uniqueSuffix =
      //       Date.now() + '-' + Math.round(Math.random() * 1e9);
      //     const ext = extname(file.originalname);
      //     const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      //     callback(null, filename);
      //   },
      // }),
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    };
  }
}
