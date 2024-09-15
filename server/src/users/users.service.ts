import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.UserModel.create(createUserDto);
  }

  findAll() {
    return this.UserModel.find({});
  }

  findOne(id: string) {
    return this.UserModel.findById(id).populate('preferedTags');
  }

  findByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async findByEmailorCreate(email: string, name: string) {
    const user = await this.UserModel.findOne({ email });
    if (user) {
      return user;
    }
    return this.create({ email, name });
  }

  updateCurrent(id: string, updateUserDto: UpdateUserDto) {
    const { maxPreferedPreperationTimeMinutes, preferedTags } = updateUserDto;
    return this.UserModel.findByIdAndUpdate(
      id,
      { maxPreferedPreperationTimeMinutes, preferedTags },
      {
        returnOriginal: false,
      },
    );
  }

  remove(id: string) {
    return this.UserModel.findByIdAndDelete(id);
  }
}
