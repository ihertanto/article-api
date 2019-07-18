const request = require('supertest')
const Article = require('../src/models/article')
const app = require('../src/app')
const { 
    userOneId, 
    userOne, 
    userTwoId,
    userTwo,
    articleOne,
    articleTwo,
    articleThree,
    setupDatabase
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create article for user', async () => {
    const response = await request(app)
        .post('/articles/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: 'Title From my test',
            body: 'Body From my test'
        })
        .expect(201)
    const article = await Article.findById(response.body._id)
    expect(article).not.toBeNull()
    expect(article.publish).toEqual(false)
})

test('Should fetch user article', async () => {
    const response = await request(app)
        .get('/articles/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)        
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})

test('Should fetch user articles by id', async () => {    
    const response = await request(app)
        .get(`/articles/me/${articleOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)        
        .send()
        .expect(200)
})

test('Should update user articles by id', async () => {
    const response = await request(app)
        .patch(`/articles/me/${articleOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)        
        .send({
            publish: true            
        })
        .expect(200)

    const article = await Article.findById(articleOne._id)
    expect(article.publish).toBe(true)
})

test('Should not delete other user articles', async () => {
    const response = await request(app)
        .delete(`/articles/me/${articleOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const article = await Article.findById(articleOne._id)
    expect(article).not.toBeNull()
})


test('Should fetch published articles', async () => {
    const response = await request(app)
        .get('/articles')
        .send()
        .expect(200)

    // expect(response.body.length).toEqual(2)
})

test('Should fetch published articles by id', async () => {    
    const response = await request(app)
        .get(`/articles/${articleTwo._id}`)
        .send()
        .expect(200)
})
