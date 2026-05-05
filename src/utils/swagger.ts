import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sécurisée - Medoune",
      version: "1.0.0",
      description: "Documentation de mon API avec JWT et MongoDB",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Swagger va lire les commentaires dans tes fichiers routes
};

export const specs = swaggerJsdoc(options);