const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

/**
 * Builds and configures the Express application.
 * Exported as a factory function (rather than a singleton instance)
 * so tests can create a fresh app without needing a real HTTP server.
 */
const createApp = () => {
  const app = express();

  const frontendUrl = process.env.FRONTEND_URL || '*';
  app.use(cors({ origin: frontendUrl }));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'OK',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/tasks', taskRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
