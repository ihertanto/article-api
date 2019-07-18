const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()

const userController = require('../controllers/user')

// Get user profile
router.get('/users/me', auth, userController.getProfile)

router.patch('/users/me', auth, userController.update)

router.post('/users/me/avatar', auth, userController.avatar.single('avatar'), userController.avatarUpload), (error, req, res, next) => {
    res.status(400).send({error: error.message})
}

router.delete('/users/me/avatar', auth, userController.avatarDelete)

router.get('/users/:id/avatar', userController.avatarView)

// Get other user profile
router.get('/users/:id', userController.getProfilebyID)

module.exports = router