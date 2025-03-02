import * as dotenv from 'dotenv';

if(process.env.NODE_ENV === 'development') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
}

// TIP: Port must be a number, not a string!
const server = 'tcss545db.mysql.database.windows.net';
const database = 'tcss545db';
const port = 1433;
const type = 'azure-active-directory-default'
const user = 'admin545';
const password = 'uPjfeuow83';

export const noPasswordConfig = {
  server,
  port,
  database,
  authentication: {
    type
  },
  options: {
    encrypt: true
  }
};

export const passwordConfig = {
  server,
  port,
  database,
  user,
  password,
  options: {
    encrypt: true
  }
};