import express from 'express';

// Import App routes
import router from './routes.js';
import swaggerjsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import cors from "cors";


const port = process.env.PORT || 3000;
const app = express();

const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'MessageBoard API',
          description: 'MessageBoard API info',
      },
      servers: [
          {
              url: "http://localhost:3000"
          }
      ],
  },
  apis: ['./*.js']
}


// Proper CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // onlly allow url start with this
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the allowed methods
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Connect App routes
// app.use('/api-docs', openapi);
app.use('/', router);

const specs = swaggerjsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
app.use('*', (_, res) => {
  res.redirect('/api-docs');
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
