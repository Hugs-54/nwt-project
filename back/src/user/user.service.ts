import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username: username }).exec();
    if (!user) {
      throw new NotFoundException(`User with username "${username}" not found`);
    }
    return user;
  }

  async findOneById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  async updateUser(
    userId: string,
    updatedUserData: Partial<User>,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updatedUserData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove(userId).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return deletedUser;
  }
}
