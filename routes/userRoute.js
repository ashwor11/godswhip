const express = require('express');
const userController = require('../controllers/userController')
const router = express.Router()
const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
  var upload = multer({ storage: storage })



router.get('/logout', userController.user_logout_get)
router.get("/login", userController.user_login_get)
router.post("/login", userController.user_login_post)
router.get("/signup", userController.user_signup_get)
router.post("/signup", userController.user_signup_post)
router.get('/update', userController.user_update_get)
router.get('/changepassword', userController.user_change_password_get)
router.post('/changepassword', userController.user_change_password_post)
router.get('/', userController.user_get_profile)



router.get('/follow/:username', userController.user_follow_get)
router.get('/unfollow/:username', userController.user_unfollow_get)
router.post('/update/:username',upload.single('image') , userController.user_update_post)





router.get("/:username", userController.user_get_profile)











module.exports = router