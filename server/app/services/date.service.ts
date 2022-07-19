import { Message } from '@app/message';
import { Service } from 'typedi';
import { FsManager } from '@app/classes/fs-manager';
import * as fs from 'fs';

@Service()
export class DateService {
    async currentTime(): Promise<Message> {
        return {
            title: 'Time',
            body: new Date().toString(),
        };
    }

    async test() {
        fs.existsSync("123")
        const fs0 = new FsManager();
        fs0.data = [];
    }
}
