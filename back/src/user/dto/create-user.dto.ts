import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Pseudo de l'user" })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Mot de passe de l'user" })
  password: string;
}
