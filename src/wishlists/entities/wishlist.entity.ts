import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  @Length(1, 250, { message: 'Название должно быть от 1 до 250 символов' })
  name: string;

  @Column({ length: 1500 })
  @IsOptional()
  @Length(1, 1500, { message: 'Описание должно быть не длиннее 1500 символов' })
  description?: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl({}, { message: 'Некорректный формат URL изображения' })
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  @IsOptional()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  owner: User;

  toJSON(): Record<string, any> {
    const { owner, items, ...rest } = this;

    return {
      ...rest,
      owner: owner
        ? {
            id: owner.id,
            username: owner.username,
            avatar: owner.avatar,
          }
        : undefined,
      items: items?.map((i) => ({
        id: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
      })),
    };
  }
}
