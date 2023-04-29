import { omit } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';
import userModel, { User } from '@app/models/user.model';
import { excludedFields } from '@app/controllers/auth.controller';
import { signJwt } from '@app/utils/jwt';
import { DocumentType } from '@typegoose/typegoose';
import { Service } from 'typedi';
import { ACCESS_TOKEN_EXPIRES_IN } from '@app/constant/constant';

@Service()
export class UserService {

    constructor() { }

    // CreateUser service
    async createUser(input: Partial<User>) {
        const user = await userModel.create(input);
        return omit(user.toJSON(), excludedFields);
    }

    // Find User by Id
    async findUserById(id: string) {
        const user = userModel.findById(id).lean();
        return omit(user, excludedFields);
    }

    // Find All users
    async findAllUsers() {
        return userModel.find();
    }

    // Find all users by any fields
    async findUsers(query: FilterQuery<User>, options: QueryOptions = {}) {
        return userModel.find(query, options);
    }

    // Find one user by any fields
    async findUser(
        query: FilterQuery<User>,
        options: QueryOptions = {}
    ) {
        return userModel.findOne(query, {}, options).select(['+password']);
    }

    // Find one user by any fields without password
    async findUserWithoutPassword(
        query: FilterQuery<User>,
        options: QueryOptions = {}
    ) {
        return userModel.findOne(query, {}, options);
    }

    // Update password
    async updatePassword(user: DocumentType<User>, password: string) {
        user.password = password;
        await user.save();
        return omit(user.toJSON(), excludedFields);
    }

    // Update user
    async updateUser(user: DocumentType<User>) {
        await user.save();
        return omit(user.toJSON(), excludedFields);
    }

    // Sign Token
    async signToken(user: DocumentType<User>) {
        // Sign the access token
        const access_token = signJwt(
            { sub: user._id, role: user.role },
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            }
        );
        
        // Return access token
        return { access_token };
    }

    // Create reset token
    async createResetToken(user: DocumentType<User>) {
        // Create reset token
        const reset_token = signJwt(
            { sub: user._id },
            {
                expiresIn: '1h',
            }
        );
        
        // Return reset token
        return { reset_token };
    }
}
