const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
    userId: String,
    names:String,
    postMail: String,
    postTitle: String,
    number: {
        type: Number,
        validate: {
            validator: function (v) {
                return v.toString().length === 10;
            },
            message: props => `${props.value} is not a valid phone number! It should have 10 digits.`
        },
        required: true
    },
    postbody: String,
    locations: String,
    time: String
});

const PrivateModel = mongoose.model("recruities", createSchema);

module.exports = PrivateModel;
