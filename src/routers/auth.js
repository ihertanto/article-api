const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const authController = require('../controllers/auth')

// Create User
router.post('/users', authController.register)
// Login route
router.post('/users/login', authController.login)
// Logout route
router.post('/users/logout', auth, authController.logout)
// Logout All route
router.post('/users/logoutAll', auth, authController.logoutAll)
// Delete User
router.delete('/users/me', auth, authController.unregister)

module.exports = router