export abstract class TokenProvider {

    abstract saveToken(token: string): Promise<boolean>;

    abstract revokeToken(token: string): Promise<boolean>;

    abstract deleteToken(token: string): Promise<boolean>;
}
