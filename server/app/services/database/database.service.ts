import mongoose from 'mongoose';
import { DATABASE_URL } from '@app/constant/constant';
import { Service } from 'typedi';

const dbUrl = DATABASE_URL;

@Service()
export class DatabaseService {

    bucket: InstanceType<typeof mongoose.mongo.GridFSBucket>;

    async connectDB() {
        try {
            await mongoose.connect(dbUrl);
            console.log('Database connected...');
            this.addBucket();
        } catch (error: any) {
            console.log(error.message);
            setTimeout(this.connectDB, 5000);
        }
    }

    addBucket() {
        const db = mongoose.connections[0].db;
        this.bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "paidCaseStudy" });
    }

}
