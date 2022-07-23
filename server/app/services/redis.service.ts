import { createClient } from 'redis';
import { Service } from 'typedi';

const redisUrl = `redis://localhost:6379`;

@Service()
export class RedisService {

    redisClient = createClient({
        url: redisUrl,
    });

    constructor() {
        this.connectRedis();

        this.redisClient.on('error', (err) => console.log(err));
    }

    getClient() {
        return this.redisClient;
    }

    async connectRedis() {
        try {
            await this.redisClient.connect();
            console.log('Redis client connected...');
        } catch (err: any) {
            console.log(err.message);
            setTimeout(this.connectRedis, 5000);
        }
    }

}








