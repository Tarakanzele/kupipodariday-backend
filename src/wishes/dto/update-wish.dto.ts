import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Type(() => Number)
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Поле raised должно быть числом с максимум двумя знаками после запятой',
    },
  )
  @Min(0, { message: 'Собранная сумма не может быть отрицательной' })
  raised?: number;
}
