var express = require('express');
var router = express.Router();
var firebase=require('firebase');
var fileupload = require("express-fileupload");
/* GET users listing. */
var multer=require('multer');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ '.png')
    }
})

var upload = multer({ storage : storage });


var memoryStorage=require('multer');
//import multer, {memoryStorage} from "multer";

var storage=require('@google-cloud/storage');

//import storage from "@google-cloud/storage";

var path=require('path');



// Instantiate a storage client

const googleCloudStorage = storage({

    projectId:'login-app-b3320',

    keyFilename:'C:/Users/Ganesha/Desktop/login/register/app.client_secret_320421664309-phc2icc6t30246kaan40950d9a1via4k.apps.googleusercontent.com'

});



const m = multer({

    storage: memoryStorage(),

    limits: {

        fileSize: 5 * 1024 * 1024 // no larger than 5mb

    }

});




// A bucket is a container for objects (files).

const bucket = googleCloudStorage.bucket('login-app-b3320.appspot.com');




router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res, next) {
  var user=req.body.username;
  console.log(user);
    firebase.auth().signInWithEmailAndPassword(user, req.body.password).then(function() {
        //res.send('Hello '+ req.query.username +'! Lets upload a file')
        res.render('welcome.html',{ title: 'Welcome '+user });
    }).
    catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        res.send('Hello '+req.body.username+" "  +errorMessage);
        // ...
    });
});

router.post('/register', function(req, res, next) {
    console.log(req.body.email);
    if(req.body.pass!=req.body.repass){
        res.send("both passwords should match!")
    }
    else{
        //res.send('Hello ' + req.query.name +'! Lets upload a file')
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.pass).then(function()
        {
            res.send('Hello '+ req.body.name +" Registration succesful! Sign in..")

        }).
        catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            //console.log(errorCode)
            res.send('Hello ' + req.body.name + ' ' + errorMessage)




            // ...
        });
    }


});
router.post('/signout', function(req, res, next) {

    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign-out successful");
        res.render('index.html',{ title: 'signed out' });
    }).catch(function(error) {
        // An error happened.
        console.log("An error happened")
    });
});

router.get('/googlelogin', function(req, res, next) {

    console.log('google signedin');
    res.render('welcome.html',{ title: 'Hello' });



});

router.post("/upload",upload.single('file'), function(req, res, next){

       // var title = req.file.title;
       // var section = req.file.section;

    //console.log(req.body, req.files);
//console.log(title);
            //if (req.file){


                console.log("image saved successfully in local");
                res.send("image saved successfully in local")

                //upload to the GCloud
               // bucket.upload(req.files, function(err, file) {
                   // if (!err) {
                       // console.log("image saved successfully in GCloud");

                        //store image name in firebase
                       // res.redirect("/upload");

                   // }
               // });




           // }
           // else {
              //  console.log("No file uploaded");
              //  res.redirect("/upload");
           // }

    });

module.exports = router;
