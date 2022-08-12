export interface UserRegister {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    status: string;
    proof?: File;
    school: string;
    country: string;
    city: string;
}

export interface UserLogin {
    email: string;
    password: string;
}