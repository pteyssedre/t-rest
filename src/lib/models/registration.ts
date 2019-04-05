export class RegisterModel {
    username: string;
    password: string;

    isValid() {
        return !this.username || !this.password;
    }
}
