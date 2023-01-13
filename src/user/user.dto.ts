import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail, Matches } from 'class-validator';

export class UserCreateDto {
  @IsEmail({ allow_utf8_local_part: false })
  @ApiProperty({
    example: 'johndoe@email.com',
    description: 'The email of the user',
  })
  readonly email: string;

  @IsString()
  @Matches('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$', '', {
    message:
      'Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @Length(8, 256)
  @ApiProperty({
    example: 'strongpassword',
    description: 'The password of the user',
  })
  readonly password: string;
}
