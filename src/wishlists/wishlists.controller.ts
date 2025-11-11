import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { ValidationFilter } from '../common/filters/validation.filter';
import { GetUser, GetUserId } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('wishlistlists')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt)
@UseInterceptors(PasswordInterceptor)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @ApiOperation({ summary: 'Получить список всех подборок' })
  @ApiResponse({ status: 200, description: 'Список подборок успешно получен' })
  @Get()
  getWishlists() {
    return this.wishlistsService.getWishLists();
  }

  @ApiOperation({ summary: 'Создать новую подборку' })
  @ApiResponse({ status: 201, description: 'Подборка успешно создана' })
  @UseFilters(ValidationFilter)
  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @GetUser() user: User,
  ) {
    return await this.wishlistsService.create(createWishlistDto, user);
  }

  @ApiOperation({ summary: 'Получить подборку по ID' })
  @ApiResponse({ status: 200, description: 'Подборка найдена' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  getWishlist(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.findById(id);
  }

  @ApiOperation({ summary: 'Обновить данные подборки' })
  @ApiResponse({ status: 200, description: 'Подборка обновлена' })
  @ApiParam({ name: 'id', type: Number })
  @UseFilters(ValidationFilter)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @GetUserId() userId: number,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, userId);
  }

  @ApiOperation({ summary: 'Удалить подборку' })
  @ApiResponse({ status: 200, description: 'Подборка успешно удалена' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUserId() userId: number) {
    return this.wishlistsService.remove(id, userId);
  }
}
