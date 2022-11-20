import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDtoFromFrontend } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('auth/register')
  async register(@Body() dto: CreateUserDtoFromFrontend) {
    this.usersService.create(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('auth/google/login')
  async googleLogin(@Body() body: GoogleBody) {
    return this.authService.googleLogin(body.googleToken);
  }

  @Post('auth/github/login')
  async githubLogin(@Body() body: GithubBody) {
    return this.authService.githubLogin(body.code);
  }
}

interface GoogleBody {
  googleToken: string;
}

interface GithubBody {
  code: string;
}
