const Article = require('../models/article')
const redis = require('../db/redis')

const getArticle = async (_id) => {
    const key = `article_one_${_id}`    
    const data = await redis.getData(key)
    if (data) {
        console.log('getArticle: Redis cache get')
        return JSON.parse(data)
    } else {
        const article = await Article.findOne({ _id })
        if (article) {
            console.log('getArticle: Mongoose get')
            redis.client.set(key, JSON.stringify(article.toJSON()))
            return article.toJSON()
        }
    }
    return null
}

const create = async (req, res) => {
    const article = new Article({
        ...req.body,
        owner: req.user._id
    })

    try {
        await article.save()
        res.status(201).send(article)
    } catch (e) {
        res.status(400).send(e)
    }
}

const getMany = async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.publish) {
        match.publish = req.query.publish === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'articles',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.articles)
    } catch (e) {
        res.status(500).send()
    }
}

const getOne = async (req, res) => {
    const _id = req.params.id
    try {
        const article = await getArticle(_id)   
        if (!article || article.owner.toString() != req.user._id.toString()) {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

const update = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'body', 'publish']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    
    try {
        const article = await Article.findOne( { _id: req.params.id, owner: req.user._id})
        
        if(!article) {
            return res.status(404).send()
        }

        updates.forEach((update) => article[update] = req.body[update])
        article.save()
        res.send(article)
    } catch (e) {
        res.status(400).send()
    }
}

const remove = async (req, res) => {
    try {
        const article = await Article.findOneAndDelete({ _id:req.params.id, owner:req.user._id })
        if (!article) {
            res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
} 


const getManyPublic = async (req, res) => {
    // const match = {}
    const sort = {}

    // match.publish = true

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const options = {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
    }

    try {
        const articles = await Article.find({ publish: true }, null, options)
        res.send(articles)
    } catch (e) {
        res.status(404).send()
    }
}

const getOnePublic = async (req, res) => {
    const _id = req.params.id

    try {
        const article = await getArticle(_id)   
        if (!article || article.publish.toString() != 'true') {
            return res.status(404).send()
        }
        res.send(article)
    } catch (e) {
        res.status(500).send()
    }
}

const search = async (req, res, next) => {
    console.log('search', req.params.keyword)
   
    Article.search(
        {query_string: {query: req.params.keyword}},
        {
          hydrate: true,
          hydrateOptions: {select: 'title body _id'}
        },
        function(err, results) {
            if (err) return next(err)
            const data = results.hits.hits.map((hit) => {
                return hit
            })
          res.status(200).send(data)
      });
}

module.exports = {
    create,
    getMany,
    getOne,
    update,
    remove,
    getManyPublic,
    getOnePublic,
    search
}