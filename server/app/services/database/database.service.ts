import mongoose from 'mongoose';
import { DATABASE_URL } from '@app/constant/constant';
import { Service } from 'typedi';

const dbUrl = DATABASE_URL;

@Service()
export class DatabaseService {

    async connectDB() {
        try {
            await mongoose.connect(dbUrl);
            console.log('Database connected...');
        } catch (error: any) {
            console.log(error.message);
            setTimeout(this.connectDB, 5000);
        }
    }

}
