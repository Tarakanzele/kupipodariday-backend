import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt)
@UseInterceptors(PasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль найден' })
  @Get('me')
  getOwn(@GetUserId() id: number) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Обновить профиль текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль обновлён' })
  @UseFilters(ValidationFilter)
  @Patch('me')
  updateCurrentUser(@GetUserId() id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @ApiOperation({ summary: 'Получить хотелки текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Хотелки успешно получены' })
  @Get('me/wishes')
  getOwnWishes(@GetUserId() id: number) {
    return this.usersService.getOwnWishes(id);
  }

  @ApiOperation({ summary: 'Получить пользователя по username' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiParam({ name: 'username', type: String })
  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @ApiOperation({ summary: 'Получить хотелки пользователя по username' })
  @ApiResponse({ status: 200, description: 'Хотелки пользователя получены' })
  @ApiParam({ name: 'username', type: String })
  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }

  @ApiOperation({ summary: 'Поиск пользователей по email или username' })
  @ApiResponse({ status: 200, description: 'Список пользователей получен' })
  @Post('find')
  findUsers(@Body() dto: FindUserDto) {
    return this.usersService.findMany(dto);
  }
}
