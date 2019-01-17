var express = require('express');
var http = require('http');
var mysql = require('mysql');
var bodyParser = require('body-parser');

app = express();
// parse all form data into a json object
app.use(bodyParser.urlencoded({ extended: true}));

var dateFormat = require('dateformat');
var now = new Date();

// This is view engine Template parsing we are using ejs types

app.set('view engine','ejs');

// Import all related javascript and css files to inject in our app
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

const con = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "nodecrud"
	});

// Global title and base url
const siteTitle = "Simple Application";
const baseURL = "http://localhost:3000";

app.get('/', function(req, res) {

	// get the event list
	con.query("SELECT * FROM events", function(err,result){
		res.render('./pages/index',{
			siteTitle :siteTitle,
			pageTitle : "Event List",
			items : result
		});
	});
});

// 
app.get('/event/add', function(req, res) {

		res.render('./pages/add-event.ejs',{
			siteTitle :siteTitle,
			pageTitle : "Add New Event",
			items : ''
		});
});

app.post('/event/add', function(req, res) {

var sql = "INSERT INTO events (name, description,location) VALUES ('"+req.body.name+"', '"+req.body.description+"','"+req.body.location+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
  			res.redirect(baseURL);
	});	
});

app.get('/event/edit/:id', function(req, res) {
	con.query("SELECT * FROM events where id='"+req.params.id+"'", function(err,result){
			console.log(result);
		res.render('./pages/edit-event',{
			siteTitle :siteTitle,
			pageTitle : "Event List"+result[0].name,
			item : result
		});
	});


});
app.post('/event/edit/', function(req, res) {
	console.log("Name=",req.body.name);
	con.query("UPDATE events SET name='"+req.body.name+"', description='"+req.body.description+"',location='"+req.body.location+"' WHERE id='"+req.body.id+"'", function(err,result){
			console.log(result);
			if(result.affectedRows){
				res.redirect(baseURL);
			}
			
		});
	});
			
				


app.get('/event/delete/:id', function(req, res) {

	// get the event list
	con.query("DELETE FROM events WHERE id='"+req.params.id+"'", function(err,result){
				if(result.affectedRows){
					res.redirect(baseURL);
				}
			});
});




// connect to server
var server = app.listen(3000, function(){
		console.log("server started on 3000....");
}) 