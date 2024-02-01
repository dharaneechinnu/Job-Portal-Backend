const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
    userid:String,
    postMail: String,
    postTitle: String,
    number: Number,
    postbody: String,
    locations:String,
    time:String
});

const createModel = mongoose.model("creates", createSchema);

module.exports = createModel;
