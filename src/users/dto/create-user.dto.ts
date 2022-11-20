export class CreateUserDtoFromFrontend {
  email: string;
  password: string;
}

export class CreateUserDto {
  email: string;
  passwordHash: string;
}
