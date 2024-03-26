const exp = require('express');
const router = exp.Router();
const controller = require('../controllers/db_controller');

// post req
router.post('/', controller.postReq);

// get req
router.get('/', controller.getReq);

// delete req
router.delete('/', controller.deleteReq);

module.exports = router;