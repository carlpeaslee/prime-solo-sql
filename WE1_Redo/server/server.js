var express = require("express");
var app = express();
var index = require("./routes/index");
var path = require("path");
var bodyparser = require('body-parser');

app.set("port", (process.env.PORT || 5000));


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use("/", index);


app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});
