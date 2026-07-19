const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getDashboard, postQuickRequest } = require('../controllers/dashboard.controller');

const router = Router();

router.get('/', requireAuth, requireRole('admin', 'manager', 'user'), getDashboard);
router.post('/quick-request', requireAuth, requireRole('admin', 'manager'), postQuickRequest);

module.exports = router;
