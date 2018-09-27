const express = require('express');
const bodyParser = require('body-parser');
const assert = require('assert');
const path = require('path');
const app = express(); 
const fs = require('fs');
const dataFile = './data.json';
const dataFormat = 'utf8';
const MongoClient = require('mongodb').MongoClient;
// HTTP Listener
const server = app.listen(3000, function(){
    console.log('Server runing');
})
const io = require('socket.io').listen(server);

// CORS
// We are enabling CORS so that our 'ng serve' Angular server can still access
// our Node server. 
const cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))



// Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Routes
app.use(express.static(path.join(__dirname, '../chat-app/dist/chat-app')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});
app.get('/home', function(req,res){
    res.sendFile(path.join(__dirname,'../chat-app/dist/chat-app/index.html'))
});


// Login Module
const login = require('./login.js')();
const groups = require('./groups.js')();

app.post('/api/login', function(req, res){
    fs.readFile(dataFile, dataFormat, function(err, data){
        data = JSON.parse(data);
        let username = req.body.username; 
        let password = req.body.password;
        login.data = data;
        let match = login.findUser(username);
        if (password !== '123')
        {
            match = false;
        }
    
        // Check to see if we have a match, get groups if true
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
            console.log(match.groups[0].channels[0]);
        }
        res.send(match);
    });
});


// Group APIs
app.post('/api/groups', function(req,res){
    // We want to authenticate again -- usually you'd use a token
    fs.readFile(dataFile, dataFormat, function(err, data){
        data = JSON.parse(data);
        let username = req.body.username; 
        login.data = data;
        let match = login.findUser(username);
        
        // Check to see if we got a match, get groups if true
        if(match !== false){
            groups.data = data;
            match.groups = groups.getGroups(username, match.permissions);
        }
        res.send(match);
    });
});

app.delete('/api/group/delete/:groupname', function(req, res){
    let groupName = req.params.groupname;

    // Read the JSON file to get the current data
    fs.readFile(dataFile, dataFormat, function(err, data){
        let readData = JSON.parse(data);
        groups.data = readData.groups;
        readData.groups = groups.deleteGroup(groupName);
        console.log(readData);
        let json = JSON.stringify(readData);

        // Write the updated data to JSON
        fs.writeFile(dataFile, json, dataFormat, function(err, d){
            res.send(true);
            console.log("Deleted group: " + groupName);
        });
    });
});

app.post('/api/group/create', function(req, res){
    let groupName = req.body.newGroupName
    if(groupName == '' || groupName == 'undefined' || groupName == null){
        res.send(false);
    } else {
        // Read the JSON file to get an updated list of groups
        fs.readFile(dataFile, dataFormat, function(err, data){
            let readData = JSON.parse(data);
            let g = readData.groups;
    
            let newGroup = {
                'name': req.body.newGroupName,
                'admins':[],
                'members':[]
            }
            g.push(newGroup)
            readData.groups = g;
            let json = JSON.stringify(readData);
            
            // Write the updated data to the JSON file.
            fs.writeFile(dataFile, json, dataFormat, function(err, data){
                res.send(true);
                console.log("Created new group: " + req.body.newGroupName);
            });
        });
    }
})

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mydb';

// Use connect method to connect to the server
MongoClient.connect(url, {poolSize:10}, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  app.post('/api/add', function(req,res){
    const collection = db.collection('users');
    const assert = require('assert');
    let user = req.body.user;
    let perms = req.body.perms;
    // Insert some documents
    collection.insertOne({username : user, permissions : perms}, 
        function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted " + user + " into the collection");
            res.send(true);
        });
  });
  //app.post('/api/update', function(){
    //require('./routes/update.js')(app,db,callback);
  //})
  app.post('/api/remove', function(req,res){
    // Get the documents collection
    const collection = db.collection('users');
    const assert = require('assert');
    let user = req.body.user;
    // Delete document for 1 user
    collection.deleteOne({username : user}, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Removed the document for "+user);
      res.send(true);
    });    
  });
  app.post('/api/read', function(){
    // Get the documents collection
    const collection = db.collection('users');
    const assert = require('assert');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(JSON.stringify(docs));
      res.send(docs);
    });
  });
})
console.log("Server Socket Initialized");
//Respond to connection request
io.on('connection',(socket)=>{
    console.log('User Connection');
    //Respond to disconnect request
    socket.on('disconnect', function(){
        console.log('User Disconnected');
    });
    //Respond to getting a new message
    socket.on('add-message',(message)=>{
        //Broadcast the message to all others that are connected to this socket
        console.log(message);
        io.emit('message',{type:'message',text:message});
    });

    socket.on('add-image',(image)=>{
        console.log(image);
        io.emit('image',{type:'image',text:image});
    })

    socket.on('add-image',(image)=>{
        io.emit('image',{type:'image', image: image})
    })
});   

module.exports = app;