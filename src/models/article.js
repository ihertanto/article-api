const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const articleSchema =  require('./articleSchema')
const nsq = require('../services/nsq')
const redis = require('../db/redis')

articleSchema.plugin(mongoosastic, {
    hosts: [
        process.env.ELASTIC_URL
    ],
    filter: (doc) => {
        return doc.publish === false
    },
    indexAutomatically: false,
    saveOnSynchronize: false
})

articleSchema.post('save', async function (doc, next) {
    postChange(this)
    next()
})


articleSchema.post('remove', async function (doc, next) {
    postChange(this)
    next()
})

const postChange = (article) => {
    // Push NSQ Message to re-index elastic
    nsq.write('article_api', 'sync')
    // Remove Redis cache
    const key = `article_one_${article._id}`    
    redis.delData(key) 
}
    

const Article = mongoose.model('Article', articleSchema )

module.exports = Article