export class CreateUserDto {
  username: string;
  passwordInput: string;

  constructor(username, passwordInput) {
    this.username = username;
    this.passwordInput = passwordInput;
  }
}
