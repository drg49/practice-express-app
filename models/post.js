const {Schema, model} = require("mongoose")

const postSchema = new Schema({
    username: {type: String, required: true},
    title: String,
    body: String,
    upVotes: [String],
    downVotes: [String],
    comment: [{username: String, body: String}]
}, {timestamps: true})

const Post = model("Post", postSchema)

module.exports = Post