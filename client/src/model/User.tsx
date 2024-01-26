export interface UserRegister {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    status: string;
    proof?: any;
    school: string;
    country: string;
    city: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserPasswordReset {
    reset_token: string;
    password: string;
}

export interface User {
    lastName: string;
    firstName: string;
    email: string;
}