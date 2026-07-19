const { Router } = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { getDispatch, postScanBarcode } = require('../controllers/dispatch.controller');

const router = Router();

router.get('/', requireAuth, requireRole('security', 'admin', 'manager'), getDispatch);
router.post('/scan', requireAuth, requireRole('security', 'admin', 'manager'), postScanBarcode);

module.exports = router;
