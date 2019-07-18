const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Article = require('../../src/models/article')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Andrew',
    email: 'andrwe@example.com',
    password: 'P@sw0rd2019',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const articleOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'First Article - Title',
    body: 'First Article - Body',
    publish: false,
    owner: userOne._id
}

const articleTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Second Article - Title',
    body: 'Second Article - Body',
    publish: true,
    owner: userOne._id
}

const articleThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Third Article - Title',
    body: 'Third Article - Body',
    publish: false,
    owner: userTwo._id
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Article.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()    
    await new Article(articleOne).save()
    await new Article(articleTwo).save()
    await new Article(articleThree).save()    
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    articleOne,
    articleTwo,
    articleThree,
    setupDatabase,
}