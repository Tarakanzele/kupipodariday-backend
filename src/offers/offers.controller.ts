import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('offers')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt)
@UseInterceptors(PasswordInterceptor)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({ summary: 'Создать новое предложение (offer)' })
  @ApiResponse({ status: 201, description: 'Предложение успешно создано' })
  @Post()
  async createOffer(@Body() dto: CreateOfferDto, @GetUser() user: User) {
    return this.offersService.create(dto, user);
  }

  @ApiOperation({ summary: 'Получить список всех предложений' })
  @ApiResponse({ status: 200, description: 'Список предложений получен' })
  @Get()
  async findAll() {
    return this.offersService.getOffers();
  }

  @ApiOperation({ summary: 'Получить предложение по ID' })
  @ApiResponse({ status: 200, description: 'Предложение найдено' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.getOffer(id);
  }
}
