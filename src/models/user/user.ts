export class User {
    username: string;
    email: string;
    password: string;
    role: string;
    lastLogin?: Date | null;

    constructor(username: string, email: string, password: string, role: string, lastLogin?: Date){
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.lastLogin = lastLogin;
    }
}