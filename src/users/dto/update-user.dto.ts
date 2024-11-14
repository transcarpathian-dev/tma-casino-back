import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  last_name: string;
}
