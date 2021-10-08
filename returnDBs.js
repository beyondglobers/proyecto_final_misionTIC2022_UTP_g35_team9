// https://www.bezkoder.com/node-js-csv-mongodb-collection/

const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");
const path = require("path");
// let url = "mongodb://username:password@localhost:27017/";
const url = "mongodb://localhost:27017/";


// how to define multiple functions in the same export
// https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module

// how to return the items from a mongodb connection 
// https://stackoverflow.com/questions/35246713/node-js-mongo-find-and-return-data

module.exports = {
	FindOne: function (id) {
		return mongodb.connect('mongodb://localhost:27017').then(function (client) {


			var db = client.db('stockUpdate');
			var collection = db.collection('stock');

			return collection.findOne({ my_id: id }); // here the presence of .toArray() was problematic, caused error
		}).then(function (items) {
			// console.log(items);
			// client.close();
			return items;
		});
	},

	FindinAll: function (coll) {
		return mongodb.connect('mongodb://localhost:27017').then(function (client) {

			console.log(coll);
			var db = client.db('stockUpdate');
			var collection = db.collection(coll);

			// db.collection('stock').find({}).toArray(function (err, collInfos) {

			// if (err) throw err;

			// collInfos.forEach(function (coll, err) {

			// console.log(coll);

			// })


			// });

			return collection.find({}).toArray(); // but here .toArray() was needed to produce a correct result
		}).then(function (items) {
			// console.log(items);
			// client.close();
			return items;
		});
	},


	FindCollections: function () {
		return mongodb.connect('mongodb://localhost:27017').then(function (client) {

			var db = client.db('stockUpdate');
			var listCollections = db.listCollections().toArray();


			return listCollections;
		}).then(function (items) {
			return items;
		});
	},


	Updatebyid: function (item) {

		mongodb.connect('mongodb://localhost:27017').then(function (client) {

			var db = client.db('stockUpdate');

			db.collection('stock').updateOne({ my_id: item.id }, { $inc: { "amount": Number(item.amount) } }, function (err, result) {
				// assert.equal(null, err);
				console.log('Item updated');
				// client.close();
			});

		});

	},

	Deletebyid: function (id) {

		mongodb.connect('mongodb://localhost:27017').then(function (client) {

			var db = client.db('stockUpdate');

			db.collection('stock').deleteOne({ my_id: id }, function (err, result) {
				// assert.equal(null, err);
				console.log('Item deleted');
				// client.close();
			});

		});

	},

	// InsertAllbyid: function (item) {

	// 	return mongodb.connect('mongodb://localhost:27017').then(function (client) {

	// 		var db = client.db('stockUpdate');

	// 		var data = { amount: item.amount, category: item.category, desactualizar: item.desactualizar, name: item.name, photo_id: item.photo_id }

	// 		client.db("stockUpdate").collection('stock').updateMany(

	// 			{ "my_id": item.id },
	// 			{
	// 				$set: data,
	// 				$currentDate: { lastModified: true },
	// 			},
	// 			{ upsert: true });

	// 		console.log('product inserted');
	// 		// alert('Producto agregado');

	// 	});

	// },

	InsertAllbyid: async function (item) {

		mongodb.connect('mongodb://localhost:27017').then(function (client) {

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
			// alert('Producto agregado');
			// return ;

		});

	}

};
