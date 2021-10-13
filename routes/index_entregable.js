var express = require('express');
var router = express.Router();


// export db

var mongo = require('mongodb').MongoClient;

////////////// upload

var formidable = require('formidable');
var path = require("path");
const saveDB = require('../cvstomongo');


//////////// unzip

const fs = require('fs');
const extract = require('extract-zip')


//////////// category

const Task = require('../models/task');

//////////// popups

const alert = require('alert');


////////////

var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({ extended: false });

// var url = 'mongodb://localhost:27017';

const urlMongoAtlas = "mongodb+srv://acpm1:12345@cluster0.bmqt1.mongodb.net/stockUpdate?retryWrites=true&w=majority";
var url = urlMongoAtlas;

// // Routes

router.get('/', async (req, res) => {

  console.log("/");
  

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);

  const tasks = await Task.find();

  res.render('category', { tasks: tasks, category: 'Top ventas' });

});

router.get('/uploadForm', (req, res) => {

  console.log("/uploadForm");


  res.render('upload', { category: 'Stock Manager' });

});// form.parse


router.get('/carrito', async (req, res) => {

  console.log("/");

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);

  const tasks = await Task.find();

  res.render('carrito', { category: 'Carrito' });

});


router.get('/category', async (req, res) => {

  console.log('/category');


  var category = req.query.id;

  var tasks;
  var category_name;

  switch (category) {
    case 'top':
      tasks = await Task.find();
      category_name = "Top ventas";
      break;
    case 'linterna':
      category_name = "Linterna"
      tasks = await Task.find({ "category": category });
      break;
    case 'hogar':
      category_name = "Hogar"
      tasks = await Task.find({ "category": category });
      break;
    case 'audio':
      category_name = "Audio"
      tasks = await Task.find({ "category": category });
      break;
    case 'belleza':
      category_name = "Belleza"
      tasks = await Task.find({ "category": category });
      break;

    default:

  }

  res.render('category', { tasks: tasks, category: category_name });

});



router.get('/edit', async (req, res) => {

  console.log('/edit');

  var id = req.query.id;

  mongo.connect(url, function (err, client) {

    if (err) throw err;

    var db = client.db('stockUpdate');

    db.collection('stock').findOne({ my_id: id }, function (err, collInfos) {

      if (err) throw err;

      var data = { my_id: collInfos.my_id, name: collInfos.name, amount: collInfos.amount };

      client.close();
      res.render('update', { category: 'Stock Manager', data: data });


    });

  });


});


router.post('/update', function (req, res, next) {

  var item = {
    id: req.body.id,
    name: req.body.name,
    amount: Number(req.body.amount)
  };


  mongo.connect(url, function (err, client) {

    if (err) throw err;

    var db = client.db('stockUpdate');

    assert.equal(null, err);

    db.collection('stock').updateOne({ my_id: item.id }, { $inc: { "amount": Number(item.amount) } }, function (err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      client.close();
    });

  });


});



router.get('/delete', async (req, res) => {

  console.log('/delete by id');

  var id = req.query.id;

  mongo.connect(url, function (err, client) {

    if (err) throw err;

    var db = client.db('stockUpdate');

    db.collection('stock').deleteOne({ my_id: id }, function (err, result) {

      if (err) throw err;

      console.log('Item deleted');
      client.close();
    });
  });


});


router.get('/addTab', async (req, res) => {

  console.log('/addTab');

  res.render('add', { category: 'Stock Manager' });

});


router.post('/add', async (req, res) => {

  // algo falla acá
  console.log('/add');

  var item = {
    id: req.body.id,
    name: req.body.name,
    amount: Number(req.body.amount),
    category: req.body.category,
    desactualizar: req.body.desactualizar,
    photo_id: req.body.photo_id

  };


  mongo.connect(url).then(function (client) {

    var db = client.db('stockUpdate');

    var data = { amount: item.amount, category: item.category, desactualizar: item.desactualizar, name: item.name, photo_id: item.photo_id }

    client.db("stockUpdate").collection('stock').updateMany(

      { "my_id": item.id },
      {
        $set: data,
        $currentDate: { lastModified: true },
      },
      { upsert: true });

    console.log('product inserted');


  });


});


router.post('/addFormidable', function (req, res, next) {


  console.log("/addFormidable");

  var form = new formidable.IncomingForm({ multiples: true });

  form.on('fileBegin', function (name, file) {

    file.path = path.resolve(__dirname, '..') + "/public/images/" + file.name;

  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
  });


  form.parse(req, function (err, fields, files) {

    if (err != null) {
      console.log(err)
      return res.status(400).json({ message: err.message });
    }


    var item = {
      id: fields.id,
      name: fields.name,
      amount: Number(fields.amount),
      category: fields.category,
      desactualizar: fields.desactualizar,
      photo_id: files.file1.name

    };


    mongo.connect(url).then(function (client) {

      var db = client.db('stockUpdate');

      var data = { amount: item.amount, category: item.category, desactualizar: item.desactualizar, name: item.name, photo_id: item.photo_id }

      client.db("stockUpdate").collection('stock').updateMany(

        { "my_id": item.id },
        {
          $set: data,
          $currentDate: { lastModified: true },
        },
        { upsert: true });

      console.log('product inserted');


    });



  });

});



router.get('/stock', (req, res) => {

  console.log("/stock");

  var resultArray = [];

  mongo.connect(url, function (err, client) {

    if (err) throw err;

    var db = client.db('stockUpdate');


    db.listCollections().toArray(function (err, collInfos) {


      collInfos.forEach(function (coll, err) {

        resultArray.push(coll.name);

      })


      if (resultArray.lengt != 0) {
        const index = resultArray.indexOf('stock');
        resultArray.splice(index, 1);
        resultArray.sort();
        resultArray.unshift('stock');

      }

      var mysort = { 'my_id': 1 };

      db.collection('stock').find().sort(mysort).toArray(function (err, docs) {

        if (err) throw err;

        res.render('table', { category: 'Stock Manager', Data1: resultArray, Data2: docs, isStock: true });

        client.close();

      });


      // );

    });

  });


})



router.post("/upload", (req, res) => {

  console.log("Received request /upload");

  var form = new formidable.IncomingForm({ multiples: true });


  form.on('fileBegin', function (name, file) {

    file.path = path.resolve(__dirname, '..') + "/uploads/" + file.name;

  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
  });


  form.parse(req, function (err, fields, files) {

    if (err != null) {
      console.log(err)
      return res.status(400).json({ message: err.message });
    }



    files.file1.forEach(function (coll, err) {


      if (coll.name.includes("csv")) {
        console.log("es el csv");
        saveDB(coll.name);
      }

      if (coll.name.includes("zip")) {
        console.log("es el zip");

        var zip_path = path.resolve(__dirname, '..') + "/uploads/" + coll.name;
        var unzip_path = path.resolve(__dirname, '..') + "/public/images";


        fs.access(zip_path, fs.F_OK, (err) => {

          if (err) {
            console.error(err)
            return;
          }

          extract(zip_path, { dir: unzip_path }, (err) => {
            if (err) console.error('extraction failed.');
            res.render('upload', { category: 'Stock' });
          });

        })

      }

    });

  });

});


router.post("/environments", function (req, res) {

  console.log('req received');

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);
  collName = myObjStrParsed.select_name;

 
  var resultArray = [];

  mongo.connect(url, function (err, client) {

    if (err) throw err;

    var db = client.db('stockUpdate');

    db.listCollections().toArray(function (err, collInfos) {


      collInfos.forEach(function (coll, err) {

        resultArray.push(coll.name);

      })

      if (resultArray.lengt != 0) {
        const index = resultArray.indexOf('stock');
        resultArray.splice(index, 1);
        resultArray.sort();
        resultArray.unshift('stock');

      }

      var isStock;

      if (collName == 'stock') {
        isStock = true;
      }


      var mysort = { 'my_id': 1 };

      db.collection(collName).find().sort(mysort).toArray(function (err, docs) {

        if (err) throw err;

        res.render('table', { category: 'Stock Manager', Data1: resultArray, Data2: docs, isStock: isStock });

        client.close();

      });


    });

  });


});



module.exports = router;



