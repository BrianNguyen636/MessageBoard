import express from 'express';

// Import App routes
import router from './routes.js';
import swaggerjsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

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
