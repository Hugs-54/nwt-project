import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalStrategy)
  @ApiOkResponse({ description: "L'user a été connecté avec succès." })
  @ApiBadRequestResponse({
    description: "L'username ou le mot de passe est incorrect",
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.username,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = user._id;

    const payload = {
      username: loginUserDto.username,
      sub: userId,
    };

    console.log(payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  @ApiCreatedResponse({ description: "L'user a été créé avec succès." })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtStrategy)
  @ApiOkResponse({ description: "L'user a été déconnecté avec succès." })
  @Post('logout')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(@Request() req): Promise<any> {
    return { message: 'Déconnexion réussie.' };
  }

  @UseGuards(JwtStrategy)
  @ApiOkResponse({ description: "Le profil de l'user." })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
