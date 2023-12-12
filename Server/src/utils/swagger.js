const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Audiofy API Docs",
      version: "1.0.0",
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
    path.join(process.cwd(), 'routers/*.js'), // Assuming your routers are in JS files
    path.join(process.cwd(), 'schema/*.js'),  // Assuming your schema files are in JS files
  ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", require('swagger-ui-express').serve, require('swagger-ui-express').setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;
