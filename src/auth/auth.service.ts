import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.getOneByEmail(email);

  //   if (user && user.password === password) {
  //     return { id: user.id, email: user.email };
  //   }

  //   return null;
  // }

  // async login(user: User) {
  //   const payload = { sub: user.id, email: user.email };

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     token: this.jwtService.sign(payload),
  //   };
  // }

  async googleLogin(googleToken: string) {
    const response = await firstValueFrom(
      this.httpService.post(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${googleToken}`,
      ),
    );
    const email = response.data.email;

    // let user = await this.usersService.getOneByEmail(email);

    // if (!user) {
    //   await this.usersService.createUser({ email, password: '12345678' });
    //   user = await this.usersService.getOneByEmail(email);
    // }

    const payload = { email: email, sub: 5 };

    return {
      //id: user.id,
      email: email,
      token: this.jwtService.sign(payload),
    };
  }
}
