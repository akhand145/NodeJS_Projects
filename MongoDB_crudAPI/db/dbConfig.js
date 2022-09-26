const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connection Creation
mongoose.connect("mongodb://localhost:27017/mongoCRUD",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connection Successfully Created"))
    .catch((err) => console.log(err));
    
