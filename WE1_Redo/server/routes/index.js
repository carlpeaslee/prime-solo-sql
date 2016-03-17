var express = require("express");
var router = express.Router();
var path = require("path");
var pg = require('pg');

var connectionString;


if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/we1_redo';
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS employees (' +
    'id SERIAL PRIMARY KEY,' +
    'first_name varchar(80) NOT NULL,' +
    'last_name varchar(80) NOT NULL,' +
    'employeeID varchar(80) NOT NULL,' +
    'job_title varchar(80) NOT NULL,' +
    'salary varchar(80) NOT NULL,' +
    'active boolean NOT NULL);'
    );

  query.on('end', function(){
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    //TODO exit(1)
    done();
    });
  }
});

router.post('/person', function(req, res) {
  console.log('body: ', req.body);
  var name = req.body.firstName;
  var lastname = req.body.lastName;
  var employeeID = req.body.employeeID;
  var jobTitle = req.body.jobTitle;
  var salary = req.body.salary;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var query = client.query('INSERT INTO employees (first_name, last_name, employeeID, job_title, salary) VALUES ($1, $2, $3, $4, $5)',
      [name, lastname, employeeID, jobTitle, salary]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send("did it");
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
   }
  });
});


router.get('/person', function(req, res) {
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('SELECT * FROM employees');
      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
   }
  });
});


router.get("/*", function(req,res){
    var file = req.params[0] || "/views/index.html";
    res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;
