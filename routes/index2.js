var express = require('express');
var router = express.Router();


// export db

var mongo = require('mongodb').MongoClient;

////////////// upload

var formidable = require('formidable');
var path = require("path");
const saveDB = require('../cvstomongo');
const returnDBs = require('../returnDBs');
// const {returnOne} =  require('../returnDBs');

//////////// unzip

const fs = require('fs');
const extract = require('extract-zip')


//////////// category

const Task = require('../models/task');

//////////// popups

// var popupS = require('popups');
// const {alert} = require('node-popup');
// const dialog = require('node-native-dialog');
// https://www.npmjs.com/package/alert
const alert = require('alert');


////////////

var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({ extended: false });

var url = 'mongodb://localhost:27017';

// const getDropdown = require('../getDropdown');


// const { Connection } = require('../getDropdown');
// Connection.connectToMongo();


// // Routes

router.get('/', async (req, res) => {

  console.log("/");

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);
  // collName = myObjStrParsed.select_name;

  console.log(myObjStrParsed);


  const tasks = await Task.find();
  // res.render('index', { title: 'Home Page'})
  console.log(tasks);
  res.render('category', { tasks: tasks, category: 'Top ventas' });

});

router.get('/uploadForm', (req, res) => {

  console.log("/uploadForm");

  // res.render('index', { title: 'Home Page'})
  // res.render('upload', { title: 'this title' });
  res.render('upload', { category: 'Stock Manager' });

});// form.parse


router.get('/carrito', async (req, res) => {

  console.log("/");

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);
  // collName = myObjStrParsed.select_name;

  console.log(myObjStrParsed);


  const tasks = await Task.find();
  // res.render('index', { title: 'Home Page'})
  console.log(tasks);
  res.render('carrito', { category: 'Carrito' });

});


router.get('/category', async (req, res) => {

  console.log('/category');


  var category = req.query.id;
  console.log(category);
  // console.log(typeof category);

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
  console.log(id);
  // console.log(typeof category);


  // mongo.connect(url, function (err, client) {

  //   if (err) throw err;

  //   var db = client.db('stockUpdate');

  //   db.collection('stock').findOne({ my_id: id }, function (err, collInfos) {

  //     if (err) throw err;

  //     var data = { my_id: collInfos.my_id, name: collInfos.name, amount: collInfos.amount };


  //     console.log(collInfos);
  //     console.log(data);

  //     client.close();
  //     res.render('update', { category: 'Stock Manager', data: data });


  //   });

  // });


  ///////////////////
  // var data = returnOne(id);
  // console.log(data);
  ////////////////////

  // returnDBs.FindOne(id).then(function(items) {
  //   console.info('FindOne: The promise was fulfilled with items!', items);
  // }, function(err) {
  //   console.error('FindOne: The promise was rejected', err, err.stack);
  // });


  returnDBs.FindOne(id).then(function (items) {
    console.info('FindOne: The promise was fulfilled with items!', items);

    var collInfos = items;

    var data = { my_id: collInfos.my_id, name: collInfos.name, amount: collInfos.amount };

    res.render('update', { category: 'Stock Manager', data: data });

  });


  // returnDBs.FindCollections().then(function(items) {
  //   console.info('FindCollections: The promise was fulfilled with items!', items);
  // });

});


router.post('/update', function (req, res, next) {

  var item = {
    id: req.body.id,
    name: req.body.name,
    amount: Number(req.body.amount)
  };

  console.log(item);

  returnDBs.Updatebyid(item);

  // alert('Producto actualizado')

  // alert('Hello World!');

 



  // console.log(req.body.content);
  // console.log(JSON.stringify(req.body));


  // mongo.connect(url, function (err, client) {

  //   if (err) throw err;

  //   var db = client.db('stockUpdate');

  //   assert.equal(null, err);
  //   db.collection('stock').updateOne({ my_id: item.id }, { $inc: { "amount": Number(item.amount) } }, function (err, result) {
  //     assert.equal(null, err);
  //     console.log('Item updated');
  //     client.close();
  //   });
  // });




});



router.get('/delete', async (req, res) => {

  console.log('/delete');

  var id = req.query.id;
  console.log(id);

  // mongo.connect(url, function (err, client) {

  //   if (err) throw err;

  //   var db = client.db('stockUpdate');

  //   db.collection('stock').deleteOne({ my_id: id }, function (err, result) {

  //     if (err) throw err;

  //     console.log('Item deleted');
  //     client.close();
  //   });
  // });

  returnDBs.Deletebyid(id);

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

  console.log(item);


  // var id = req.query.id;
  // console.log(id);
  // console.log(typeof category);

  var a = returnDBs.InsertAllbyid(item);
  // alert('Producto agregado');

  // res.render('update', { category: 'Stock Manager', data: data });



});


router.post('/addFormidable', function (req, res, next) {

  // var item = {
  //   id: req.body.id,
  //   name: req.body.name,
  //   amount: Number(req.body.amount)
  // };

  // console.log(item);

  // returnDBs.Updatebyid(item);


  console.log("/addFormidable");

  var form = new formidable.IncomingForm({ multiples: true });
  // const form = formidable({ multiples: true, uploadDir: __dirname });

  // form.parse(req);

  form.on('fileBegin', function (name, file) {

    file.path = path.resolve(__dirname, '..') + "/public/images/" + file.name;
    // file.path = path.resolve(__dirname, '..') + "/uploads/" + file.name;

  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name);
  });


  form.parse(req, function (err, fields, files) {

    if (err != null) {
      console.log(err)
      return res.status(400).json({ message: err.message });
    }


    // console.log(fields);
    // console.log(files.file1.name);

    var item = {
      id: fields.id,
      name: fields.name,
      amount: Number(fields.amount),
      category: fields.category,
      desactualizar: fields.desactualizar,
      photo_id: files.file1.name

    };

    console.log(item);


    returnDBs.InsertAllbyid(item);


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

      console.log(resultArray);
      console.log(resultArray.length);

      if (resultArray.lengt != 0) {
        const index = resultArray.indexOf('stock');
        resultArray.splice(index, 1);
        resultArray.sort();
        resultArray.unshift('stock');

        console.log(resultArray);
      }

      var mysort = { 'my_id': 1 };

      db.collection('stock').find().sort(mysort).toArray(function (err, docs) {

        if (err) throw err;

        // var returnVals = JSON.parse(JSON.stringify({ Data1: resultArray, Data2: docs }));    
        // res.render('user-table', { allData: returnVals });
        // res.render('table', { category: 'Stock Manager', Data1: resultArray, Data2: docs });

        res.render('table', { category: 'Stock Manager', Data1: resultArray, Data2: docs, isStock: true });

        client.close();

      });


      // );

    });

  });




  // res.render('table', { Data1: [], Data2: [], title:"this title"});	

  // res.render('about', { title: 'About Page', layout: './layouts/sidebar' })
  // res.render('about', { title: 'About Page', layout: './layouts/full-width' })

})



router.post("/upload", (req, res) => {

  console.log("Received request /upload");

  var form = new formidable.IncomingForm({ multiples: true });
  // const form = formidable({ multiples: true, uploadDir: __dirname });

  // form.parse(req);

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

    // const myname = files.file1.name;

    console.log(files.file1)

    // const returned = files.file1;	

    files.file1.forEach(function (coll, err) {
      console.log(coll.name)

      if (coll.name.includes("csv")) {
        console.log("es el csv");
        saveDB(coll.name);
      }

      if (coll.name.includes("zip")) {
        console.log("es el zip");

        var zip_path = path.resolve(__dirname, '..') + "/uploads/" + coll.name;
        // var unzip_path = path.resolve(__dirname, '..') + "/uploads/images";
        var unzip_path = path.resolve(__dirname, '..') + "/public/images";

        console.log(zip_path, unzip_path);

        // fs.createReadStream(zip_path).pipe(unzip.Extract({ path: unzip_path }))

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

        // alert('Stock actualizado');

      }

    });

  });

});


router.post("/environments", function (req, res) {
  //get data from form and add to db
  // var name = req.body.name1;
  console.log('req received');

  const myObjStr = JSON.stringify(req.body);
  var myObjStrParsed = JSON.parse(myObjStr);
  collName = myObjStrParsed.select_name;

  console.log(collName);
  // res.send(JSON.stringify(req.body));

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

        // console.log(resultArray);
      }

      var isStock;

      if (collName == 'stock') {
        isStock = true;
      }


      var mysort = { 'my_id': 1 };

      db.collection(collName).find().sort(mysort).toArray(function (err, docs) {

        if (err) throw err;

        // var returnVals = JSON.parse(JSON.stringify({ Data1: resultArray, Data2: docs }));    
        // res.render('user-table', { allData: returnVals });

        // res.render('table', { Data1: resultArray, Data2: docs, title: "this title" });
        res.render('table', { category: 'Stock Manager', Data1: resultArray, Data2: docs, isStock: isStock });

        client.close();

      });


      // );

    });

  });


});



module.exports = router;



