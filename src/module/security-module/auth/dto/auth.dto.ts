import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  readonly email!: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  readonly password!: string;
}
