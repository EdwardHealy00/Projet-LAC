import { HttpException } from '@app/classes/http.exception';
//import bodyParser = require('body-parser');
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as logger from 'morgan';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { Service } from 'typedi';
import { DatabaseService } from '@app/services/database/database.service';
import { UserController } from '@app/controllers/user.controller';
import { AuthController } from '@app/controllers/auth.controller';
import { CaseStudyController } from './controllers/caseStudy.controller';
import * as multer from 'multer';
import * as path from 'path';

@Service()
export class Application {
    app: express.Application;
    private readonly internalError: number = StatusCodes.INTERNAL_SERVER_ERROR;
    private readonly swaggerOptions: swaggerJSDoc.Options;
    upload: multer.Multer;


    constructor(private readonly databaseService: DatabaseService,
        private readonly userController: UserController,
        private readonly authController: AuthController,
        private readonly caseStudyController: CaseStudyController) {
        this.app = express();

        this.swaggerOptions = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'Cadriciel Serveur',
                    version: '1.0.0',
                },
            },
            apis: ['**/*.ts'],
        };

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                const folderName = req.originalUrl.includes("caseStudies") ? 'paidCaseStudies/' : 'proofUploads/';
                cb(null, folderName)
            },
            filename: function (req, file, cb) {
                const isCaseStudyReq = req.originalUrl.includes("caseStudies");
                const fileName = Date.now().toString() + "-" + (isCaseStudyReq ? file.originalname : "");
                if (isCaseStudyReq && req.files) {
                    req.files[(req.files.length as number) - 1]["serverFileName"] = fileName;
                }
                cb(null, fileName ) //Appending extension
            }
        });

        this.upload = multer({ storage });

        this.config();

        this.bindRoutes();

        this.databaseService.connectDB();

    }

    bindRoutes(): void {
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(this.swaggerOptions)));
        this.app.use('/api/users', this.userController.router);
        this.app.use('/api/auth', this.authController.router);
        this.app.use('/api/caseStudies', this.caseStudyController.router);
        this.app.use('/api/images', express.static(path.join(__dirname, '../public_images')));
        this.app.use('/', (req, res) => {
            res.redirect('/api/docs');
        });

        this.errorHandling();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(express.json( {limit: '50mb'}));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        // TODO: change cors origin when deployed
        this.app.use(cors({
            credentials: true, origin: ['http://10.0.0.57:3000', 'http://localhost:3000'] //TODO : update!
        }
        ));
        this.app.use(this.upload.any());
    }

    private errorHandling(): void {
        // When previous handlers have not served a request: path wasn't found
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: HttpException = new HttpException('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: HttpException, req: express.Request, res: express.Response) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
