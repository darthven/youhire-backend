import env from "./env.config"

export default {
    swaggerDefinition: {
        info: {
          title: "YouHire API",
          version: "1.0.0",
          description: "This is a simple API"
        },
        host: `localhost:${env.PORT}`,
        basePath: "/"
    },
    apis: ["src/services/api/docs/docs.ts"]
}
