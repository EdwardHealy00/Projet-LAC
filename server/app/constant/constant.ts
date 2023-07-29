import * as dotenv from 'dotenv';

dotenv.config();

// JWT
export const PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
export const PUBLIC_KEY = process.env.ACCESS_TOKEN_PUBLIC_KEY as string;
export const ACCESS_TOKEN_EXPIRES_IN = "30m";

// Email
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

// Database infos
export const DATABASE_URL: string = process.env.MONGODB_URI as string;

// HTTP status
export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_ACCEPTED = 202;
export const HTTP_STATUS_NO_CONTENT = 204;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_FORBIDDEN = 403;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// Case Study
export const MAX_FILES_PER_CASE = 3;