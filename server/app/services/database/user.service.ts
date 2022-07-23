import { omit } from 'lodash';
import { FilterQuery, QueryOptions } from 'mongoose';
import userModel, { User } from '@app/models/user.model';
import { excludedFields } from '@app/controllers/auth.controller';
import { signJwt } from '@app/utils/jwt';
import { RedisService } from '@app/services/redis.service';
import { DocumentType } from '@typegoose/typegoose';
import { Service } from 'typedi';
import { ACCESS_TOKEN_EXPIRES_IN } from '@app/constant/constant';

@Service()
export class UserService {

    constructor(private readonly redisService: RedisService) { }

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

    // Find one user by any fields
    async findUser(
        query: FilterQuery<User>,
        options: QueryOptions = {}
    ) {
        return userModel.findOne(query, {}, options).select('+password');
    }

    // Sign Token
    async signToken(user: DocumentType<User>) {
        // Sign the access token
        const access_token = signJwt(
            { sub: user._id },
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            }
        );
        // Create a Session
        const redisClient = this.redisService.getClient();
        await redisClient.set(JSON.stringify(user._id), JSON.stringify(user), {
            EX: 60 * 60,
        });

        // Return access token
        return { access_token };
    }
}
