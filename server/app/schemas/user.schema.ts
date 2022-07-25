import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        email: string({ required_error: 'Email is required' }).email(
            'Invalid email'
        ),
        password: string({ required_error: 'Password is required' })
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        //passwordConfirm: string({ required_error: 'Please confirm your password' }),
    // }).refine((data) => data.password === data.passwordConfirm, {
    //     path: ['passwordConfirm'],
    //     message: 'Passwords do not match',
    // }),
        firstName: string({ required_error: 'First name is required' }),
        lastName: string({ required_error: 'Last name is required' }),
        status: string({ required_error: 'Status is required' }),
        proof: string({ required_error: 'Proof is required' }),
        school: string({ required_error: 'School is required' }),
        country: string({ required_error: 'Country is required' }),
        city: string({ required_error: 'City is required' }),
    }),
});

export const loginUserSchema = object({
    body: object({
        email: string({ required_error: 'Email is required' }).email(
            'Invalid email or password'
        ),
        password: string({ required_error: 'Password is required' }).min(
            8,
            'Invalid email or password'
        ),
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema> ['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema> ['body'];
