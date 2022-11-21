import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { GoogleResponse } from './models/GoogleModels';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getOneByEmail(email);

    if (user && (await compare(password, user.passwordHash))) {
      return { id: user._id, email: user.email };
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user._id, email: user.email };

    return {
      email: user.email,
      token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleToken: string) {
    const response: GoogleResponse = await firstValueFrom(
      this.httpService.post(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${googleToken}`,
      ),
    );
    const email = response.data.email;

    let user = await this.usersService.getOneByEmail(email);

    if (!user) {
      await this.usersService.create({ email, password: '' });
      user = await this.usersService.getOneByEmail(email);
    }

    const payload = { email: user.email, sub: user._id };

    return {
      email: email,
      token: this.jwtService.sign(payload),
    };
  }

  async githubLogin(code: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `https://github.com/login/oauth/access_token?client_id=faaeeab1e2875e97f09f&code=${code}&client_secret=d51a04d7f72c9f968ab2b72fd1311f2e8c6a0f3d`,
      ),
    );

    const token = response.data.split('&')[0].split('=')[1];

    const userResponse = await firstValueFrom(
      this.httpService.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    const email = userResponse.data.find(
      (entry) => entry.visibility == 'private',
    ).email;

    let user = await this.usersService.getOneByEmail(email);

    if (!user) {
      await this.usersService.create({ email, password: '' });
      user = await this.usersService.getOneByEmail(email);
    }

    const payload = { email: user.email, sub: user._id };

    return {
      email: email,
      token: this.jwtService.sign(payload),
    };
  }
}
