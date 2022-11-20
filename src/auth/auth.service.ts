import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.getOneByEmail(email);

    if (user && compare(user.passwordHash, password)) {
      return { id: user._id, email: user.email };
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user._id, email: user.email };

    return {
      id: user._id,
      email: user.email,
      token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleToken: string) {
    const response = await firstValueFrom(
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
      //id: user.id,
      email: email,
      token: this.jwtService.sign(payload),
    };
  }
}
