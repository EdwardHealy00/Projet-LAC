export default class AppError extends Error {
    status: string;

    constructor(public message: string, public statusCode: number = 500) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

