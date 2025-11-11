import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Некорректный формат ссылки на аватар' })
  avatar?: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsNotEmpty()
  password: string;
}
