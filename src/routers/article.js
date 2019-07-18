const express = require('express')
const auth = require('../middleware/auth')
const article = require('../controllers/article')

const router = express.Router()

// Create Article
router.post('/articles/me', auth, article.create)

// GET /articles?publish=true
// GET /articles?limit=10&skip=20
// GET /articles?sortBy=createdAt:desc
router.get('/articles/me', auth, article.getMany)

//Read Article by id, auth user id
router.get('/articles/me/:id', auth, article.getOne)

// Update Article
router.patch('/articles/me/:id', auth, article.update)

router.delete('/articles/me/:id', auth, article.remove)

router.get('/articles/search/:keyword', article.search)

// GET /articles?limit=10&skip=20
// GET /articles?sortBy=createdAt:desc
router.get('/articles', article.getManyPublic)

router.get('/articles/:id', article.getOnePublic)



module.exports = router