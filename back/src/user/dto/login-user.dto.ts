import { IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Username de l'user" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mot de passe de l'user" })
  password: string;
}
