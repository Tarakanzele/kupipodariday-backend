import { IsOptional, IsString, Length } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsString({ message: 'Параметр запроса должен быть строкой' })
  @Length(1, 50, { message: 'Запрос должен содержать от 1 до 50 символов' })
  query?: string;
}
