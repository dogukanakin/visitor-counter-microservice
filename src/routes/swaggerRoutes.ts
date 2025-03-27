import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger';

export function createSwaggerRoutes(): Router {
    const router = Router();
    
    // Serve Swagger documentation
    router.use('/', swaggerUi.serve);
    router.get('/', swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Visitor Counter API Documentation',
    }));
    
    // Endpoint to get the Swagger specification as JSON
    router.get('/json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    
    return router;
} 