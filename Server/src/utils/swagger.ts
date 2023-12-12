import {Express, Request, Response} from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {version} from '../../package.json'
const path = require('path');

const options: swaggerJsdoc.Options = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Audiofy API Docs",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: [
        path.join(process.cwd(), '/routers/audio.ts'),
        path.join(process.cwd(), "/schema/*.ts")
    ],
  };
  
  const swaggerSpec = swaggerJsdoc(options);
 
  
  function swaggerDocs(app: Express, port: string | number) {
    // Swagger page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
    // Docs in JSON format
    app.get("/docs.json", (req: Request, res: Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });
  
    console.log(`Docs available at http://localhost:${port}/docs`);
  }
  
  export default swaggerDocs;
  