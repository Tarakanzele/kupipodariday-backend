import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return user;
    } catch (err) {
      throw new BadRequestException('Ошибка при регистрации');
    }
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username, true);
    if (!user) {
      throw new UnauthorizedException('Неверные данные для входа');
    }

    const isValid = await this.hashService.verifyPassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
