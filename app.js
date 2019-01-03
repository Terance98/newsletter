//jshint esversion:6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req, res){

  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members : [
      {
        email_address: email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);
  //The part following /lists/ is the unique list ID of your mailchimp list. This is a sample mailchimp listID.
  //In Authorization the part following skippy is your API key. This is a deactivated API key of mine.
  //Since both the list ID and API are confidential. I haven't shared them in this project.
  var option = {
    url : 'https://us7.api.mailchimp.com/3.0/lists/22h69263c0',
    method : "POST",
    headers : {
      "Authorization" : "skippy 8c0cfe6e95b95f9b0cbcdfc0228c9cda-us7"
    },
    body : jsonData
  };
  request(option, function(error, response, body){
    if(error){
      res.sendFile(__dirname+"/failure.html");
    }else{
      if (response.statusCode == 200){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html");
      }
    }

  });
});

app.post("/failure",function(req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Started hosting at heroku ");
});
