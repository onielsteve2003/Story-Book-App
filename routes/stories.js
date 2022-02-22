const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Story = require('../models/Story')

// @desc    Show add Page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    Process the add stories 
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// @desc    Show all Stories
// @route   GET /stories/user
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.log(err)
        res.render('error/505')
    }
})

// @desc    Show Single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate()
        .lean()

        if(!story) {
            return res.render('error/404')
        }
        res.render('stories/show', {
            story, 
        })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

// @desc    Show edit Page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        })
        .lean()
        // Checking if there is a created story already created by a user in the Story Database
        if(!story) {
            return res.render('error/404')
        }
        // redirect to public stories if its not the story owner because we don't want a user to go to another person's edit page and edit it
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story,
            })
        }
    } catch (err) {
        console.log(err)
        return res.redirect('error/500')
    }
})

// @desc    Update Story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story) {
            return res.render('error/404')
        } 
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new:true,
                runValidators: true,
            })
    
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// @desc    Dalete Story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Story.findOneAndDelete({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// @desc    User Stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })

        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router;