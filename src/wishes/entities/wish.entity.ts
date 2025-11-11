import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'decimal', default: 0 })
  raised: number;

  @Column({ length: 1024 })
  description: string;

  @Column({ default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];

  toJSON(): Record<string, any> {
    const { owner, offers, wishlists, ...rest } = this;

    return {
      ...rest,
      owner: owner
        ? {
            id: owner.id,
            username: owner.username,
            avatar: owner.avatar,
          }
        : undefined,
    };
  }
}
