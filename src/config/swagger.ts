import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Bate-papo estilo dos anos 2000',
            version: '1.3.0',
            description: 'Documentação da API',
        },
        components: {
            securitySchemes: {
                UserHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'user',
                },
            },
            schemas: {},
        },
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
