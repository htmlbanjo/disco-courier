import express, { Express } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from '../config.json';
import fs from 'fs';

const app: Express = express();

/************************************************************************************
 *                              Basic Express Middlewares
 ***********************************************************************************/

app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle logs in console during development
if (process.env.NODE_ENV === 'development' || config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(cors());
}

// Handle security and origin in production
if (process.env.NODE_ENV === 'production' || config.NODE_ENV === 'production') {
  app.use(helmet());
}

/************************************************************************************
 *                               Register all routes
 ***********************************************************************************/
 const getFilesWithKeyword = (keyword: string, folderName: string, files_?: Array<string>) => {
  files_ = (typeof files_ === 'undefined') ? [] : files_;
  const files = fs.readdirSync(folderName);
  for (let i in files) {
    let name = folderName + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFilesWithKeyword(keyword, name, files_);
    } else {
      name.includes(keyword) && files_.push(name);
    }
  }
  return files_;
}
getFilesWithKeyword('router', __dirname + '/app').forEach((file: string) => {
  const { router } = require(file);
  app.use('/', router);
})
/************************************************************************************
 *                               Express Error Handling
 ***********************************************************************************/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.status(500).json({
    errorName: err.name,
    message: err.message,
    stack: err.stack || 'no stack defined'
  });
});

export default app;