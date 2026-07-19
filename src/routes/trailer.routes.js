const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  getTrailers,
  getCreateTrailer,
  postCreateTrailer,
  getEditTrailer,
  postEditTrailer,
  postDeleteTrailer,
} = require('../controllers/trailer.controller');

const router = Router();

router.get('/', requireAuth, getTrailers);
router.get('/create', requireAuth, requireRole('admin', 'manager'), getCreateTrailer);
router.post('/create', requireAuth, requireRole('admin', 'manager'), postCreateTrailer);
router.get('/:id/edit', requireAuth, requireRole('admin', 'manager'), getEditTrailer);
router.post('/:id/edit', requireAuth, requireRole('admin', 'manager'), postEditTrailer);
router.post('/:id/delete', requireAuth, requireRole('admin'), postDeleteTrailer);

module.exports = router;
