import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/сommon-entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsNumber, Min } from 'class-validator';

@Entity()
export class Offer extends CommonEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, { onDelete: 'CASCADE' })
  item: Wish;

  toJSON() {
    const { id, amount, hidden, createdAt, updatedAt } = this;
    return {
      id,
      amount: Number(amount),
      hidden,
      createdAt,
      updatedAt,
    };
  }
}
