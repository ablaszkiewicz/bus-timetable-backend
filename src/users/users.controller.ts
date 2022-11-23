import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDtoFromFrontend } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDtoFromFrontend) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/stops')
  getFavouriteStops(@Req() req) {
    const user = req.user;
    return this.usersService.getFavouriteStops(user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/me/stops')
  addFavouriteStop(@Req() req, @Body() body: { stopId: number }) {
    const user = req.user;
    return this.usersService.addFavouriteStop(user.email, body.stopId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/me/stops/:stopId')
  removeFavouriteStop(@Req() req, @Param('stopId') stopId: number) {
    const user = req.user;
    return this.usersService.removeFavouriteStop(user.email, stopId);
  }
}
