import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body, UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalStrategy)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    // 1. Authentifiez l'utilisateur ici...
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Récupérez l'ID unique de l'utilisateur
    const userId = user._id; // ou user.id, dépend de la structure de votre objet user

    // 3. Créez le payload avec cet ID
    const payload = {
      username: loginUserDto.username,
      sub: userId,
    };

    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  // Pour JWT, le "logout" est souvent géré côté client en supprimant le token.
  // Cependant, si vous avez une liste noire de tokens ou une autre logique serveur, vous pouvez l'ajouter ici.
  @UseGuards(JwtStrategy)
  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(@Request() req): Promise<any> {
    // Par exemple : invalider le token actuel, ajouter à une liste noire, etc.
    return { message: 'Déconnexion réussie.' };
  }

  @UseGuards(JwtStrategy)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
