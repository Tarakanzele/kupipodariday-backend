import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { User } from '../users/entities/user.entity';
import { GetUser, GetUserId } from '../common/decorators/get-user.decorator';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { OfferInterceptor } from '../common/interceptors/offers.interceptor';
import { ValidationFilter } from '../common/filters/validation.filter';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOperation({ summary: 'Получить все подарки' })
  @ApiResponse({ status: 200, description: 'Список всех подарков' })
  @UseInterceptors(PasswordInterceptor)
  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @ApiOperation({ summary: 'Создать новый подарок' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Подарок успешно создан' })
  @UseGuards(AuthGuardJwt)
  @Post()
  create(@GetUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @ApiOperation({ summary: 'Получить последние добавленные подарки' })
  @ApiResponse({ status: 200, description: 'Список последних подарков' })
  @UseInterceptors(PasswordInterceptor)
  @Get('last')
  findLatestWishes() {
    return this.wishesService.findLatestWishes();
  }

  @ApiOperation({ summary: 'Получить самые популярные подарки' })
  @ApiResponse({ status: 200, description: 'Список популярных подарков' })
  @UseInterceptors(PasswordInterceptor)
  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @ApiOperation({ summary: 'Получить подарок по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseInterceptors(PasswordInterceptor, OfferInterceptor)
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  findWish(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findById(id);
  }

  @ApiOperation({ summary: 'Обновить данные подарка' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @UseFilters(ValidationFilter)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @GetUserId() userId: number,
  ) {
    return this.wishesService.update(wishId, updateWishDto, userId);
  }

  @ApiOperation({ summary: 'Удалить подарок' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) wishId: number,
    @GetUserId() userId: number,
  ) {
    return this.wishesService.remove(wishId, userId);
  }

  @ApiOperation({ summary: 'Скопировать подарок другого пользователя' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @Post(':id/copy')
  copy(@Param('id', ParseIntPipe) wishId: number, @GetUser() user: User) {
    return this.wishesService.copy(wishId, user);
  }
}
