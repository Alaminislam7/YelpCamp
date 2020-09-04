const mongoose = require('mongoose');


// Scema setup
var campgraundScema = new mongoose.Schema({
    name: String,
    username: String,
    image: String,
    description: String,
    comments : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Comment"
            }
        ]
  });
  

 module.exports = mongoose.model('Campgraund', campgraundScema);

 