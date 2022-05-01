const express = require('express');
const router = express.Router();
const topicController = require("../controllers/topicController")

router.get('/index', topicController.topic_index_get)
router.get('/yourpage', topicController.topic_index_followed_get)







router.get('/:topicname', topicController.topic_get)
module.exports = router;
