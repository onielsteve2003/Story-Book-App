const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

// @desc    Login/Landing Page
// @route   GET /
// We did res.render to be login coz we wanted to render the login.hbs in the views/layout page and layout:login is self explanatory
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth , async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        res.render('error/500')
    }

})

module.exports = router;