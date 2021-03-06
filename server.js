
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ObjectID = require('mongodb').ObjectID;
var path = require('path');
var cors = require('cors');
var GameState = require('./config/Model')
var connectDB = require('./config/db');
connectDB();

var app = express();

var mongoose = require('mongoose');
var cardUtils = require('./utils/cardUtils_new')();
var initGameState = require('./utils/initGameState');
var saveGameState = require('./utils/saveGameState');


var {fetchUsersData, createProvideRequest, getDataByArea, fetchReisteredHelpingHand,
   registerHelpingHand, confirmProvideRequest, fetchUserStatus, confirmNeedRequest, 
   registerDonar, createNeedRequest, fetchNeeds, fetchReisteredDonars} = cardUtils;

saveGameState()


var PORT = process.env.PORT || 8090;


app.set('view engine', 'pug');
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


app.use(express.static(path.join(__dirname, './client/dist')));
// if(process.env.NODE_ENV === 'production') {
//    app.get('/*', function (req, res) {
//    	res.sendFile(path.join(__dirname, './client/dist', 'index.html'));
//   });
//    // app.use(express.static('./client/dist'));
// }


app.post('/api/createProvideRequest', async function(req, res) {
   const newProviderData = await createProvideRequest(req.body);
   res.status(200).send({message: 'Good Work!! We have registered your help. Awaiting confirmation from helping hand.'})
})

app.post('/api/createNeedRequest', async function(req, res) {
   const newProviderData = await createNeedRequest(req.body);
   res.status(200).send({message: 'Good Work!! We have registered your need. Awaiting confirmation from donar.'})
})



app.post('/api/registerHelpingHand', async function(req, res) {
   const registeredHelper = await registerHelpingHand(req.body);
   res.status(200).send({message: 'You are now registered helping hand in this area'})
})

app.post('/api/registerDonar', async function(req, res) {
   const registeredHelper = await registerDonar(req.body);
   res.status(200).send({message: 'You are now registered donar in this area'})
})


app.get('/api/fetchProviders', async function (req, res) {
   const areaData = await getDataByArea(req.query); 
   if(!areaData || areaData.area === null) {
      res.status(200).send({message: 'No Provider found at this place'});
   } else {
      const allProviders = await fetchUsersData(areaData);
      res.status(200).send(allProviders);
   }
});


app.get('/api/fetchNeeds', async function (req, res) {
   const areaData = await getDataByArea(req.query); 
   if(!areaData || areaData.area === null) {
      res.status(200).send({message: 'No Need Request around this place'});
   } else {
      const allNeeds = await fetchNeeds(areaData);
      res.status(200).send(allNeeds);
   }
});


app.get('/api/fetchHelpingHand', async function (req, res) {
   const areaData = await getDataByArea(req.query); 
   if(!areaData || areaData.area === null) {
      res.status(200).send({message: 'No Registered Helping hand serve this area'});
   } else {
      const helpingHands = await fetchReisteredHelpingHand(areaData);
      res.status(200).send(helpingHands);
   }
});

app.get('/api/fetchDonars', async function (req, res) {
   const areaData = await getDataByArea(req.query); 
   if(!areaData || areaData.area === null) {
      res.status(200).send({message: 'No Registered Donars serve this area'});
   } else {
      const allRegisteredDonars = await fetchReisteredDonars(areaData);
      res.status(200).send(allRegisteredDonars);
   }
});


 
app.post('/api/confirmProvideRequest', async function(req, res) {
   const newProviderData = await confirmProvideRequest(req.body);
   res.status(200).send(newProviderData)
})

app.post('/api/confirmNeedRequest', async function(req, res) {
   const resp = await confirmNeedRequest(req.body);
   res.status(200).send(resp)
})


app.get('/api/fetchUserStatus', async function(req, res) {
   let usersData = await fetchUserStatus(req.query);
   if(!usersData) {
      res.status(200).send({message: 'You have no pending request'});
   } else {
      if(!Array.isArray(usersData)) {
         usersData = [usersData];
      }
      res.status(200).send(usersData);
   }
})


app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, './client/dist', 'index.html'));
});


app.use((req, res, next) => {
    console.log("MiddleWare Called");
    next();
})


app.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:`, PORT);
})