const dotenv = require('dotenv');
dotenv.config();



const express = require('express');
const app = express();
const PORT = 3002;
//DB Connection
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Fruit model
const Fruit = require("./models/fruits");


//middleware

app.use(express.urlencoded({ extended: true }));
const morgan = require('morgan');
app.use(morgan('dev'));




//routes
app.get('/', (req, res) => {
  // res.render('home.ejs');
  res.send("The server is working!")
});

app.get('/fruits', async (req, res) => {
  const fruits = await Fruit.find();
  res.render('fruits/index.ejs', { fruits });
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

app.get('/fruits/:fruitId', async (req, res) => {

  const fruitId = req.params.fruitId;
  const fruit = await Fruit.findById(fruitId);
  res.render('fruits/show.ejs', { fruit })
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  console.log(req.body);
  if (req.body.isReadyToEat === 'on') {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }

  await Fruit.create(req.body);
  res.redirect("/fruits/new");
});







app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
