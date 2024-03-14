const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
    names:String,
    userId:String,
    postMail: String,
    postTitle: String,
    number: Number,
    postbody: String,
    locations:String,
    time:String
});

const createModel = mongoose.model("creates", createSchema);

module.exports = createModel;
