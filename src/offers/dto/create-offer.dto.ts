import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @Transform(({ value }) => Number(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Сумма должна быть числом' })
  @Min(1, { message: 'Минимальная сумма — 1' })
  @IsNotEmpty({ message: 'Укажите сумму пожертвования' })
  amount: number;

  @IsOptional()
  @IsBoolean({ message: 'Поле hidden должно быть true или false' })
  hidden?: boolean = false;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Неверный формат ID желания' })
  @IsNotEmpty({ message: 'Не указан ID желания' })
  itemId: number;
}
