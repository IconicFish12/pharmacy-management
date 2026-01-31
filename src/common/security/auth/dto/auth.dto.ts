import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  readonly subId: string;
  @IsNotEmpty({
    message: 'email is required',
  })
  @IsEmail(
    {
      allow_utf8_local_part: true,
      allow_display_name: true,
      allow_underscores: true,
      domain_specific_validation: true,
    },
    {
      message: 'Email must be an valid email',
    },
  )
  readonly email: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsStrongPassword(
    {
      minLength: 4,
      minUppercase: 2,
      minNumbers: 3,
    },
    {
      message:
        'password must contain at least greater than 4 characters, 2 uppercase, and 3 numbers, ex: JhonDoe-123',
    },
  )
  readonly password: string;
}
