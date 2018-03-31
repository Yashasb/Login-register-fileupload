var express = require('express');
var router = express.Router();
var firebase=require('firebase');
var multer=require('multer');


var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    }
    ,
    filename: function (req, file, cb) {

        cb(null, file.fieldname+'-' +Date.now())
    }
})


var upload = multer({ storage : store });


var memoryStorage=require('multer');


const Storage=require('@google-cloud/storage');
const storage = new Storage({
    projectId: 'login-app-b3320',
    keyFilename:'./login-app-55494b6995e4.json'
});

//import storage from "@google-cloud/storage";

//var path=require('path');




const ma = multer({storage: memoryStorage(), limits: {fileSize: 5 * 1024 * 1024 // no larger than 5mb

    }

});


const bucket = storage.bucket('login-app-b3320.appspot.com');


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
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.pass).then(function()
        {
            res.send('Hello '+ req.body.name +" Registration succesful! Sign in..")

        }).
        catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            //console.log(errorCode)
            res.send('Hello ' + req.body.name + ' ' + errorMessage)

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


router.post("/upload",upload.single('file'),function(req, res, next){



console.log(req.file);

uploadFile('login-app-b3320.appspot.com',req.file.path);
                console.log("image saved successfully in local"+req.file.path);
                res.render('welcome.html',{ title: 'Success' });

    });
router.post('/listfiles', function(req, res, next) {
    //res.send('Files List:');

    listFiles('login-app-b3320.appspot.com',res);
   // console.log(arr);
   // res.send(arr);

});
function uploadFile(bucketName, filename) {

    storage
        .bucket(bucketName)
        .upload(filename)
        .then(function()  {
        console.log(filename + 'uploaded to ' + bucketName);


})
.catch(function(err)  {
        console.error('ERROR:', err);
});
    storage
        .bucket(bucketName).makePublic(filename.path).then(function() {console.log('made public')}).catch(function (error) { console.error(error) });
}

function listFiles(bucketName,res) {
    var arr=[];
    // Lists files in the bucket
    storage
        .bucket(bucketName)
        .getFiles()
        .then(function(results)  {const files = results[0];

    console.log('Files:');
    files.forEach(function(file)  {
        console.log(file.name);
        var name=file.name;
        arr.push('https://storage.googleapis.com/login-app-b3320.appspot.com/'+name)}
    );
            console.log(arr);
           // res.send(arr);
            res.render('list.html',{array:arr });


})
.catch(function(err)  {
        console.error('ERROR:', err);
});
    // [END storage_list_files]
}

module.exports = router;
