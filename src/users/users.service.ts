import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  CreateUserDtoFromFrontend,
} from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDtoFromFrontend) {
    const hashedPassword = hashSync(createUserDto.password, 10);

    const dtoWithHash: CreateUserDto = {
      email: createUserDto.email,
      passwordHash: hashedPassword,
    };

    const createdUser = new this.userModel(dtoWithHash);
    return createdUser.save();
  }

  getOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async getFavouriteStops(email: string) {
    const user = await this.getOneByEmail(email);
    return user.favouriteStops;
  }

  async addFavouriteStop(email: string, stopId: number) {
    const user = await this.getOneByEmail(email);
    if (!user.favouriteStops.includes(stopId)) {
      user.favouriteStops.push(stopId);
    }
    return user.save();
  }

  async removeFavouriteStop(email: string, stopId: number) {
    const user = await this.getOneByEmail(email);
    user.favouriteStops = user.favouriteStops.filter(
      (favouriteStopId) => favouriteStopId != stopId,
    );
    return user.save();
  }
}
