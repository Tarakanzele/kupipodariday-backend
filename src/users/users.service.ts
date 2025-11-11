import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password, avatar, about } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hashedPassword = await this.hashService.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      username,
      avatar,
      about,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    delete savedUser.password;
    return savedUser;
  }

  async findOne(username: string, includePassword = false): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!includePassword) {
      delete user.password;
    }

    return user;
  }

  async findMany(query: FindUserDto): Promise<User[]> {
    if (!query.query) return [];

    const users = await this.userRepository.find({
      where: [
        { username: Like(`%${query.query}%`) },
        { email: Like(`%${query.query}%`) },
      ],
    });

    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    delete user.password;
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, username, email } = updateUserDto;

    if (username) {
      const userByUsername = await this.userRepository.findOne({
        where: { username },
      });
      if (userByUsername && userByUsername.id !== id) {
        throw new ConflictException(
          'Пользователь с таким именем уже существует',
        );
      }
    }

    if (email) {
      const userByEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (userByEmail && userByEmail.id !== id) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
    }

    if (password) {
      updateUserDto.password = await this.hashService.hashPassword(password);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async getOwnWishes(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
  }

  async findWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.wishes;
  }
}
