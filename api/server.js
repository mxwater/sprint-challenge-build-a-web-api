const express = require('express');
const server = express();

// Import routers
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

// Middleware to parse JSON requests
server.use(express.json());

// Define routes
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

// Export the server instance
module.exports = server;
