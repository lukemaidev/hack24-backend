const express = require('express');
const { getAll, getById, getByUser, create, update, remove } = require('../controllers/uploadedImageController');

const router = express.Router();

router.get('/', getAll);                       // GET  /api/uploaded-images?userId=<id>
router.get('/user/:userId', getByUser);        // GET  /api/uploaded-images/user/:userId
router.get('/:id', getById);                   // GET  /api/uploaded-images/:id
router.post('/', create);                      // POST /api/uploaded-images
router.put('/:id', update);                    // PUT  /api/uploaded-images/:id
router.delete('/:id', remove);                 // DELETE /api/uploaded-images/:id

module.exports = router;
