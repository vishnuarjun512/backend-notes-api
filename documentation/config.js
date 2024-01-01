import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import YAML from "yaml";

const openApiDocument = YAML.parse(fs.readFileSync("./api.yaml", "utf8"));

const swaggerOptions = {
  swaggerDefinition: openApiDocument,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
