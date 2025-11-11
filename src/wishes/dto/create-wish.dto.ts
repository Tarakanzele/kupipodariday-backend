import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishDto {
  @IsString({ message: 'Название подарка должно быть строкой' })
  @Length(1, 250, { message: 'Название должно содержать от 1 до 250 символов' })
  name: string;

  @IsUrl({}, { message: 'Некорректный формат ссылки на товар' })
  link: string;

  @IsUrl({}, { message: 'Некорректный формат ссылки на изображение' })
  image: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Цена должна быть числом с максимум двумя знаками после запятой',
    },
  )
  @Min(1, { message: 'Цена должна быть больше 0' })
  price: number;

  @IsString({ message: 'Описание подарка должно быть строкой' })
  @Length(1, 1024, {
    message: 'Описание должно содержать от 1 до 1024 символов',
  })
  description: string;
}
