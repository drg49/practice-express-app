require("dotenv/config")
const Post = require("../models/post")
const User = require("../models/user")
const auth = require("../auth/index")
const {Router} = require("express")
const router = Router()

//The user doesn't have to be logged in to read posts but the user must be logged in to create posts

//Index
router.get("/", async (req, res) => {
    try {
        res.status(200).json(await Post.find({}))
    }
    catch (error) {
        res.status(400).json({error})
    }
})

//Show
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        res.status(200).json(await Post.find({"_id": id}))
    }
    catch (error) {
        res.status(400).json({error})
    }
})

//Post
router.post("/", auth, async (req, res) => {
    try {
        const {username} = req.payload
        req.body.username = username
        res.status(200).json(await Post.create(req.body))
    }
    catch(error) {
        res.status(400).json({error})
    }
})

//Update
router.put("/:id", auth, async (req, res) => {
    try {
        const {username} = req.payload
        req.body.username = username
        const {id} = req.params //req.params.id destructured
        res.status(200).json(await Post.findByIdAndUpdate(id, req.body, {new: true}))
    }
     catch (error) {
        res.status(400).json({error})
    }
})

//Track who votes on a single post 
router.put("/:id/upvote/:username", auth, async (req, res) => {
    try {
        const {id} = req.params
        const {username} = req.params
        const pullFromDownvote = await Post.findByIdAndUpdate(id, { $pull: {downVotes: username}}, {new: true})
        const pushToUpvote = await Post.findByIdAndUpdate(id, { $push: {upVotes: username}}, {new: true})
        res.status(200).json(pullFromDownvote, pushToUpvote)
    }
     catch (error) {
        res.status(400).json({error})
     }
})
//remove an upvote
router.put("/:id/removeupvote/:username", auth, async (req, res) => {
    try {
        const {id} = req.params
        const {username} = req.params
        res.status(200).json(await Post.findByIdAndUpdate(id, { $pull: {upVotes: username}}, {new: true}))
    }
     catch (error) {
        res.status(400).json({error})
     }
})

//remove a downvote
router.put("/:id/removedownvote/:username", auth, async (req, res) => {
    try {
        const {id} = req.params
        const {username} = req.params
        res.status(200).json(await Post.findByIdAndUpdate(id, { $pull: {downVotes: username}}, {new: true}))
    }
     catch (error) {
        res.status(400).json({error})
     }
})

router.put("/:id/downvote/:username", auth, async (req, res) => {
    try {
        const {id} = req.params
        const {username} = req.params
        const pullFromUpvote = await Post.findByIdAndUpdate(id, { $pull: {upVotes: username}}, {new: true})
        const pushToDownvote = await Post.findByIdAndUpdate(id, { $push: {downVotes: username}}, {new: true})
        res.status(200).json(pullFromUpvote, pushToDownvote)
    }
     catch (error) {
        res.status(400).json({error})
     }
})

//DELETE
router.delete("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params 
        res.status(200).json(await Post.findByIdAndDelete(id))
    } catch (error) {
        res.status(400).json({error})
    }
})

module.exports = router