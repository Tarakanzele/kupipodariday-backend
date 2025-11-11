import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { WishErrors, WishesLimits } from './wishes.constants';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, user: User) {
    const newWish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });
    return this.wishRepository.save(newWish);
  }

  async findAll() {
    const wishes = await this.wishRepository.find({
      relations: ['owner', 'offers', 'offers.user'],
      order: { createdAt: 'DESC' },
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async findById(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) throw new NotFoundException(WishErrors.NotFound);

    return wish.toJSON();
  }

  async findLatestWishes() {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: WishesLimits.latest,
      relations: ['owner', 'offers', 'offers.user'],
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async findTopWishes() {
    const wishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: WishesLimits.mostCopied,
      relations: ['owner', 'offers', 'offers.user'],
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async update(wishId: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) throw new NotFoundException(WishErrors.NotFound);
    if (wish.owner.id !== userId)
      throw new BadRequestException(WishErrors.NotOwner);

    const isPriceChanged =
      updateWishDto.price !== undefined && updateWishDto.price !== wish.price;
    const hasContributions = wish.raised > 0;

    if (isPriceChanged && hasContributions) {
      throw new BadRequestException(WishErrors.CannotChangePrice);
    }

    await this.wishRepository.update(wishId, updateWishDto);
    const updatedWish = await this.wishRepository.findOneBy({ id: wishId });
    if (!updatedWish) throw new NotFoundException(WishErrors.NotFound);

    return updatedWish.toJSON();
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) throw new NotFoundException(WishErrors.NotFound);
    if (wish.owner.id !== userId)
      throw new BadRequestException(WishErrors.NotOwner);

    await this.wishRepository.delete(wishId);
    return wish.toJSON();
  }

  async copy(wishId: number, user: User) {
    const originalWish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!originalWish) throw new NotFoundException(WishErrors.NotFound);
    if (originalWish.owner.id === user.id)
      throw new BadRequestException(WishErrors.OwnWishCopy);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        id,
        createdAt,
        updatedAt,
        copied,
        owner,
        offers,
        raised,
        ...wishData
      } = originalWish;

      await this.wishRepository.update(wishId, { copied: copied + 1 });

      const newWish = await this.create(wishData, user);

      const savedWish = await this.wishRepository.findOne({
        where: { id: newWish.id },
        relations: ['owner', 'offers', 'offers.user'],
      });

      if (!savedWish) throw new NotFoundException(WishErrors.NotFound);

      await queryRunner.commitTransaction();
      return savedWish.toJSON();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getManyByIds(wishIds: number[]) {
    if (!wishIds.length) return [];

    const wishes = await this.wishRepository.find({
      where: { id: In(wishIds) },
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async updateRaised(id: number, raisedAmount: number) {
    await this.wishRepository.update(id, { raised: raisedAmount });
    const updatedWish = await this.wishRepository.findOneBy({ id });
    if (!updatedWish) throw new NotFoundException(WishErrors.NotFound);
    return updatedWish.toJSON();
  }
}
