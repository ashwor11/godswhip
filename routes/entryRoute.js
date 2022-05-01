const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController')


router.get('/add', entryController.entry_add_get)
router.post('/add', entryController.entry_add_post)
router.get('/like/:entryId', entryController.entry_like_get)
router.delete('/delete/:entryId', entryController.entry_delete)
router.get('/:entryId', entryController.entry_get)

module.exports = router;


