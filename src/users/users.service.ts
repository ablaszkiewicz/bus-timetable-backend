import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  CreateUserDtoFromFrontend,
} from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private stopModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDtoFromFrontend) {
    const hashedPassword = hashSync(createUserDto.password, 10);

    const dtoWithHash: CreateUserDto = {
      email: createUserDto.email,
      passwordHash: hashedPassword,
    };

    const createdUser = new this.stopModel(dtoWithHash);
    return createdUser.save();
  }

  getOneById(id: number) {
    return this.stopModel.findOne({
      id,
    });
  }

  getOneByEmail(email: string) {
    return this.stopModel.findOne({
      email,
    });
  }
}
