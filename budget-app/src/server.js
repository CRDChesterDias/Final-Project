const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const compression = require('compression')
var cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
app.use(cors({origin: 'http://localhost:4200'}));
const port = process.env.port || 3000;
const path = require('path');
// compress all responses
app.use(compression());
app.get('env')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});
const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

var connection = mysql.createConnection({
    host: '3.94.223.11',
    user: 'test1',
    password: 'password',
    database: 'budget'
});

app.get('/', async (req, res)=>{
    connection.query('select * from user', function(error, results, fields){
        if (error) throw error;
        res.json(results)
    })
});

//update into actual_budget_table
app.post('/api/update_actual_budget', jwtMW, async (req, res)=>{

  connection.query('update actual_budget set budget=? where ID=? and month=? and title=?;',[req.query.budget,req.query.user_id,req.query.month,req.query.title], function(error, results, fields){
      if (error) {
        res.status(500).json({error:'Failure'});
      }
      else{
      res.status(200).json({status: 'Success'});
    }
  })
});

//Check if Budget is allocated or not
app.post('/api/check_allocation', jwtMW, async (req, res)=>{
  connection.query('select * from allocated_budget where ID=? and month=? and title=?',[req.query.user_id,req.query.month,req.query.title], function(error, results, fields){
      if (error)
        res.status(500).json({error:'Failure'});
      else
      {
        if (results.length>0){
          res.status(200).json({status: true})
        }
        else{
          res.status(200).json({status: false})
        }
      }
  })
});


//insert into actual_budget_table
app.post('/api/insert_actual_budget', jwtMW, async (req, res)=>{
  connection.query('insert into actual_budget(ID,month,title,color,budget) values (?,?,?,?,0);',[req.query.user_id,req.query.month,req.query.title,req.query.color], function(error, results, fields){
      if (error) throw error;
      res.status(200).json(results);
  })
});
//insert into allocated budget_table
app.post('/api/insert_allocated_budget', jwtMW, async (req, res)=>{
  connection.query('insert into allocated_budget(ID,month,title,color,budget) values (?,?,?,?,?);',[req.query.user_id,req.query.month,req.query.title,req.query.color,req.query.budget], function(error, results, fields){
      if (error) throw error;
      res.status(200).json(results);
  })
});

//get actual Budget details
app.post('/api/get_actual_budget', jwtMW, async (req, resultant)=>{
  connection.query('select * FROM actual_budget where ID=? and month=?;',[req.query.user_id,req.query.month], function(error, results, fields){
      if (error)
        resultant.status(500).send({error: "Invalid Request"});
      else{
        resultant.status(200).json(results);
      }
  })
});

//get allocated Budget details
app.post('/api/get_allocated_budget', jwtMW, async (req, resultant)=>{
  connection.query('select * FROM allocated_budget where ID=? and month=?;',[req.query.user_id,req.query.month], function(error, results, fields){
      if (error)
        resultant.status(500).send({error: "Invalid Request"});
      else{
        resultant.status(200).json(results);
      }
  })
});

//Login is completed with missing JWT CHECKING
app.post('/api/login2', async (req, resultant)=>{
  console.log(req.query.userid)
  connection.query('select * FROM user where trim(user_id)=?;', [req.query.userid], function(error, results, fields){
      if (error) {
          console.log("USERNAME OR PASSWORD DOES NOT EXIST");
          resultant.status(500).send({error: "Incorrect combination"});
        }
      else{
        console.log(results)
        if(results.length> 0){
          const id = results[0]
          console.log("WORKED!!!!"+results[0].id)
            let token = jwt.sign({ id: results[0].user_id, username: req.query.username }, secretKey, { expiresIn: '1m'});
            resultant.status(200).json({id: results[0].user_id,
              success: true,
              err: null,
              token
          });

        }
        else{
          console.log("NO USER FOUNDsdfsf");
          resultant.status(500).send({success: false,
            token: null,
            err: 'Username or password is incorrect'});
        }
      }
  });
});


//Login is completed with missing JWT CHECKING
app.post('/api/login', async (req, resultant)=>{
  connection.query('select * FROM user where trim(user_name)=?;', [req.query.username,], function(error, results, fields){
      if (error) {
          console.log("USERNAME OR PASSWORD DOES NOT EXIST");
          resultant.status(500).send({error: "Incorrect combination"});
        }
      else{
        console.log(results)
        if(results.length> 0){
          const id = results[0]
          bcrypt.compare(req.query.password, results[0].password, function(err, res) {
          if(res) {
            console.log("WORKED!!!!"+results[0].id)
            let token = jwt.sign({ id: results[0].user_id, username: req.query.username }, secretKey, { expiresIn: '40s'});
            resultant.status(200).json({id: results[0].user_id,
              success: true,
              err: null,
              token
          });
          } else {
            console.log("Not worked");
            resultant.status(500).send({success: false,
              token: null,
              err: 'Username or password is incorrect'});
          }
          });
        }
        else{
          console.log("NO USER FOUNDsdfsf");
          resultant.status(500).send({success: false,
            token: null,
            err: 'Username or password is incorrect'});
        }
      }
  });
});

//Signup API Completed
app.post('/api/signup', async (req, res)=>{
    const date = new Date().toJSON().slice(0,10);
    const pwd = await bcrypt.hash(req.query.password,8);
    connection.query('INSERT INTO user (first_name, last_name, user_name, password, signed_on) values ( ?, ?, ?, ?, ?)',[req.query.firstname, req.query.lastname, req.query.username, pwd, date] , function(error, results, fields){
      if (error){
        return res.status(500).send({ status: "Failure" });
      }
      else{
        res.json(results);
      }
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
  jwt.verify(jwtMW.token, secretKey, function(err, decoded) {
      if (err) {
          console.log("aeoijfoiaejfojeaj");

              }
      });
  res.json({
      success: true,
      myContent: 'This is the Route to Settings.'
  });
});


app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
    connection.connect();
});
