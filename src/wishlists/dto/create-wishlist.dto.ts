import {
  IsString,
  IsUrl,
  IsArray,
  IsInt,
  IsOptional,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishlistDto {
  @IsString({ message: 'Название подборки должно быть строкой' })
  @Length(1, 250, { message: 'Название должно содержать от 1 до 250 символов' })
  name: string;

  @IsUrl({}, { message: 'Некорректный формат ссылки на изображение' })
  image: string;

  @IsArray({ message: 'Поле itemsId должно быть массивом' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Каждый элемент itemsId должен быть числом' })
  itemsId: number[];

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @Length(1, 1024, {
    message: 'Описание должно содержать от 1 до 1024 символов',
  })
  description?: string;
}
