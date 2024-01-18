import { object, string, TypeOf, z } from 'zod';

//const MAX_FILE_SIZE = 500000;
//const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
        role: string({ required_error: 'Status is required' }),
        // proof: z.any().refine((files: any) => files?.length === 0, 'No files were uploaded') 
        //     .refine((files: any) => files?.length > 1, 'Only one file can be uploaded')
        //     .refine((files: any) => files?.length === 1 && files[0]?.size > MAX_FILE_SIZE, 'File size is too big')
        //     .refine((files: any) => files?.length === 1 && !ACCEPTED_IMAGE_TYPES.includes(files[0].type), 'File type is not supported'),
        proof: z.any().refine((files: any) => { return true; }),
        school: string({ required_error: 'School is required' }),
        country: string({ required_error: 'Country is required' }),
        city: string({ required_error: 'City is required' }),
    }),
});

export const loginUserSchema = object({
    body: object({
        email: z.string().min(1, 'Adresse courriel requise').email("Format d'adresse courriel invalide"),
        password: z.string().min(1, 'Mot de passe requis'),
    }),
});

export const updatePasswordSchema = object({
    body: object({
        password: string({ required_error: 'Veuillez entrez un mot de passe' })
            .min(8, 'Le mot de passe doit avoir au minimum 8 caractères')
            .max(32, 'Le mot de passe doit avoir au maximum 32 caractères'),
        reset_token: string({ required_error: 'La demande de réinitialisation du mot de passe a expiré' }),
    }),

});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
