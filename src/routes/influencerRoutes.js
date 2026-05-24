const express = require('express');
const { getAll, getById, getTopByCategory, create, update, remove } = require('../controllers/influencerController');

const router = express.Router();

router.get('/', getAll);                           // GET    /api/influencers
router.get('/category/:category', getTopByCategory); // GET    /api/influencers/category/:category
router.get('/:id', getById);                       // GET    /api/influencers/:id
router.post('/', create);         // POST   /api/influencers
router.put('/:id', update);       // PUT    /api/influencers/:id
router.delete('/:id', remove);    // DELETE /api/influencers/:id

module.exports = router;
