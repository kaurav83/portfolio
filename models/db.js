var mongoClient = require("mongodb").MongoClient;

var users = [{name: "Bob", age: 34}, 
             {name: "Alice", age: 21},
             {name: "Tom", age: 45}];

mongoClient.connect("mongodb://localhost:27017/usersdb", function(err, db){
    
    var col = db.collection("users");
    col.updateOne(
        {name: "Tom"}, 
        { $set: {name: "Tom Junior", age:33}},
        function(err, result){
                 
            console.log(result);
            db.close();
        }
    );
});