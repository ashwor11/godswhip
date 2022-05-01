const express = require('express')
const router = express.Router()



router.get('/', (req, res) => {res.redirect('/topic/index')})
router.get('/index', (req, res) => {res.redirect('/')})
router.get('/login', (req, res) => {res.redirect('/user/login')})
router.get('/logout', (req, res) => {res.redirect('/user/logout')})
router.get('/signup', (req, res) => {res.redirect('/user/signup')})
router.get('/aboutus', (req, res) => {res.render('about.ejs',{title: 'About us'})})
router.get('/howtouse', (req, res) => {res.render('howtouse.ejs',{title: 'How to use'})})

module.exports = router;
