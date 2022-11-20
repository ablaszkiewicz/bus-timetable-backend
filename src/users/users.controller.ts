import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDtoFromFrontend } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  getOneById(@Param('id') id: string) {
    return this.usersService.getOneById(+id);
  }
}
