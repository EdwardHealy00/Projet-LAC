import * as jwt from 'jsonwebtoken';
import { PRIVATE_KEY, PUBLIC_KEY } from '@app/constant/constant';

export const signJwt = (payload: Object, options: jwt.SignOptions = {}) => {
    const privateKey = Buffer.from(
        PRIVATE_KEY,
        'base64'
    ).toString('ascii');
    return jwt.sign(payload, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });
};

export const verifyJwt = <T>(token: string): T | null => {
    try {
        const publicKey = Buffer.from(
            PUBLIC_KEY,
            'base64'
        ).toString('ascii');
        return jwt.verify(token, publicKey) as T;
    } catch (error) {
        console.log(error);
        return null;
    }
};
