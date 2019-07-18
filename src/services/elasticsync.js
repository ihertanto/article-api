require('../db/mongoose')
const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const articleSchema = require('../models/articleSchema')
const nsq = require('./nsq')

articleSchema.plugin(mongoosastic, {
    hosts: [
        process.env.ELASTIC_URL
    ],
    filter: (doc) => {
        return doc.publish === false
    },
})

const Article = mongoose.model('Article', articleSchema )

const elasticsync = () => {    
    console.log('Running..')
    const stream = Article.synchronize({}, {saveOnSynchronize: false})
    let count = 0
    
    stream.on('data', () => {
        count++
    })
    
    stream.on('close', () => {
        console.log('Indexed ' + count + " documents" )
    })
    
    stream.on('error', (err) => {
        console.log(err)
    })
}

const reader = nsq.read('article_api', 'elasticsync')
reader.connect()
 
reader.on('message', msg => {
    if (msg.body.toString() == 'sync') {
        elasticsync()
    } 
  msg.finish()
})