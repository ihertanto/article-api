const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')

const getProfile = async (req, res) => {
    res.status(200).send(req.user)
}

const getProfilebyID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            throw new Error()
        }

        res.send(user)
    } catch (e) {
        res.status(404).send()
    }
}

const update = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
}

const avatar = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb (new Error('Please upload an image (jpg/jpeg/png)'))
        }

        cb(undefined, true)
    }
})

const avatarUpload = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}

const avatarDelete = async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}

const avatarView = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
}

module.exports = {
    getProfile,
    getProfilebyID,
    update,
    avatar,
    avatarUpload,
    avatarDelete,
    avatarView
}