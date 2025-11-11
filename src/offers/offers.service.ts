import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const { itemId, amount } = createOfferDto;

    const wish = await this.wishesService.findById(itemId);

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Вы не можете сделать вклад в своё собственное желание',
      );
    }

    const newRaised = Number(wish.raised) + Number(amount);
    if (newRaised > Number(wish.price)) {
      throw new BadRequestException('Сумма превышает необходимую для покупки');
    }

    await this.wishesService.updateRaised(itemId, newRaised);

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    const savedOffer = await this.offerRepository.save(offer);
    return savedOffer.toJSON();
  }

  async getOffer(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer.toJSON();
  }

  async getOffers() {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });

    return offers.map((offer) => offer.toJSON());
  }
}
