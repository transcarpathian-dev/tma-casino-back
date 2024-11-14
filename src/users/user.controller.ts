import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import {AuthType} from "../auth/enums/auth-type.enum";
import {Auth} from "../auth/decorators/auth.decorator";

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @Get()
  async getUserById(@CurrentUser() id: number): Promise<User> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('delete')
  async deleteUserById(@CurrentUser() id: number): Promise<string> {
    return await this.usersService.deleteUserById(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Put('update')
  async updateUser(
    @CurrentUser() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(id, updateUserDto);
  }

    @Auth(AuthType.None)
    @Get('all')
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
    }
}
