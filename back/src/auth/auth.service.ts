import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    console.log('User from DB:', user);

    // Ici, je suppose que vous avez une logique de vérification du mot de passe.
    const isPasswordMatching = await this.usersService.comparePasswords(
      password,
      user.password,
    );
    console.log('Is password matching:', isPasswordMatching);

    if (user && isPasswordMatching) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.createToken(payload),
    };
  }

  createToken(payload: any): string {
    return jwt.sign(payload, 'YOUR_SECRET_KEY', { expiresIn: '60m' }); // Remplacez 'YOUR_SECRET_KEY' par une clé secrète de votre choix
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async register(userData: CreateUserDto) {
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    return user;
  }

  async validateUserByJwt(payload: any): Promise<any> {
    const user = await this.usersService.findOneById(payload.sub);
    if (user) {
      return user; // retourne l'utilisateur s'il est trouvé
    } else {
      throw new UnauthorizedException(); // lance une exception si l'utilisateur n'est pas trouvé
    }
  }
}
