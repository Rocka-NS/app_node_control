
const express = require('express');
const path  = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/node_control');
const db = mongoose.connection;

/* mongoose.connect('mongodb://mongo:27017/device_template');
const db = mongoose.connection; */

//Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check db Errors
db.on('error', function(err){
    console.log(err);
});

// init app
const app = express();

//Bringg in Model
const Client =require('./models/client');
const { isBuffer } = require('util');


//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//home Route
app.get('/', function(req, res) {
    Client.find({}, function(err, clients){
        if(err){
            console.log(err);
        } else {
            res.render('index',{
                title:'nodecontrol',
                client: clients
            });
        }
    });

});

// edit single OPCUA Server
app.get('/client/edit/:id', function(req,res){
    Client.findById(req.params.id,function(err, clients){
        res.render('edit_client',{
            title:'Hallo',
            client:clients
        });
    });

});

//Update Szbmit Post Route
app.post('/client/edit/:id', function(req, res) {
    let client = {};
    client.endpoint = req.body.endpoint;

    let query = {_id:req.params.id}

    Client.update(query, client, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.delete('/client/:id', function(req,res){
    let query = {_id:req.params.id}

    Client.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Sucess')
    })
})

// Get single OPCUA Server
app.get('/opc_client/:id', function(req,res){
    Client.findById(req.params.id,function(err, clients){
        res.render('client_info',{

            client:clients
        });
    });

});

app.get('/opcua/client', function(req, res) {
    res.render('opcua_client',{
        title:'OPC Client'
    });
});

app.post('/opcua/client', function(req, res) {
    let client = new Client();
    client.endpoint = req.body.endpoint;
    client.nodeId = req.body.nodeId;
    client.dataType = req.body.dataType;
    var isTrueSet = 
    client.value = req.body.value;
    client.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.post('/client/connect/:id', function(req, res) {
    let client = new Client();
    client.endpoint = req.body.endpoint;
    client.nodeId = req.body.nodeId;
    client.value = req.body.value;

    var fooMod = require('.//opcua_client.js')
    client.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

//Start Server
app.listen(3001, function(){
    console.log('Server started on port 3000...')
})