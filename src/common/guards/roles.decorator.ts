import { SetMetadata } from '@nestjs/common';
import { Role } from '../../database/generated/prisma/enums.js';

export const Roles = (...args: Role[]) => SetMetadata('roles', args);
