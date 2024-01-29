import {
    getModelForClass,
    index,
    modelOptions,
    pre,
    prop,
} from '@typegoose/typegoose';
import * as bcrypt from 'bcryptjs';
import { Role } from './Role';

@index({ email: 1 })
@pre<User>('save', async function () {
    // Hash password if the password is new or was updated
    if (!this.isModified('password')) return;

    // Hash password with costFactor of 12
    this.password = await bcrypt.hash(this.password, 12);
})
@modelOptions({
    schemaOptions: {
        // Add createdAt and updatedAt fields
        timestamps: true,
    },
})

// Export the User class to be used as TypeScript type
export class User {
    @prop({ required: true })
    lastName: string;

    @prop({ required: true })
    firstName: string;

    @prop({ unique: true, required: true })
    email: string;

    @prop({ required: true, minlength: 8, select: false })
    password: string;

    @prop({ default: Role.Student, required: true })
    role: string;

    @prop({ required: true })
    school: string;

    @prop({ required: true })
    country: string;

    @prop({ required: true })
    city: string;

    @prop()
    proof: any;

    // Instance method to check if passwords match
    async comparePasswords(hashedPassword: string, candidatePassword: string) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}

// Create the user model from the User class
const userModel = getModelForClass(User);
export default userModel;

