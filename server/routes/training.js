const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const trainingController = require('../controllers/trainingController');
const multer = require('multer');
const { checkSourceLimit } = require('../middleware/planLimits');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// GET /api/bots/:id/sources
router.get('/:id/sources', authenticate, trainingController.getSources);

// DELETE /api/bots/:id/sources/:sourceId
router.delete('/:id/sources/:sourceId', authenticate, trainingController.deleteSource);

// POST /api/bots/:id/train/text
router.post('/:id/train/text', authenticate, checkSourceLimit, trainingController.trainWithText);

// POST /api/bots/:id/train/url
router.post('/:id/train/url', authenticate, checkSourceLimit, trainingController.trainWithUrl);

// POST /api/bots/:id/train/file
router.post('/:id/train/file', authenticate, checkSourceLimit, upload.single('file'), trainingController.trainWithFile);

// POST /api/bots/:id/retrain
router.post('/:id/retrain', authenticate, trainingController.retrainBot);

module.exports = router;
