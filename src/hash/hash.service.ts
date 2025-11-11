import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async verifyPassword(password: string, hashed: string): Promise<boolean> {
    return compare(password, hashed);
  }
}
