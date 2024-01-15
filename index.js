const express = require("express");
const cors = require("cors");
const mongoose = require ("mongoose");
const authRoutes = require('./routes/authRoutes')
const cookieParser = require("cookie-parser");
const app = express();
const Joi = require('joi');
const axios = require('axios');

const QueryModel = require('./model/Query')
const SubjectModel = require('./model/Subject')
const CareerModel = require('./model/Career');
const ContactModel = require('./model/Contact');
const TrainingModel = require('./model/Training');

app.listen(4000,()=>{
    console.log("Server Started on Port 4000");
});

mongoose
  .connect("mongodb+srv://pranavkumar97954:pranavkumar97954@cluster0.ajcr8na.mongodb.net/test1?retryWrites=true&w=majority", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(
   cors({
    origin: ["http://localhost:5173"],
    method:["GET","POST"],
    credentials:true,
   })
);
app.use(cookieParser());
app.use(express.json());

app.use("/",authRoutes);

//Query
app.get('/get-queries', async (req, res) => {
  try {
    const queries = await QueryModel.find().exec();
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this endpoint to post a new query
app.post('/post-query', async (req, res) => {
  const { query } = req.body;

  try {
    const newQuery = new QueryModel({ text: query });
    const savedQuery = await newQuery.save();
    res.json(savedQuery);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/post-reply/:queryId', async (req, res) => {
  const { queryId } = req.params;
  const { reply } = req.body;

  try {
    const query = await QueryModel.findById(queryId);

    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    // Create a new reply
    const newReply = { text: reply };
    query.replies = [...(query.replies || []), newReply];

    // Save the updated query with the new reply
    await query.save();

    res.json(newReply);
  } catch (error) {
    console.error('Error posting reply:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Ready to use
app.post('/subjectfm', async (req, res) => {
  try {
    const { fname, lname, email, subject, contact } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email().required(),
      subject: Joi.string().required(),
      contact: Joi.string().required(),
    });

    const validationResult = schema.validate({ fname, lname, email, subject, contact });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const contactform = await SubjectModel.create({ fname, lname, email, subject, contact });

    console.log('we will contact you shortly', contactform);
    res.json({ message: 'Subject registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/career', async (req, res) => {
  try {
    const { name, email, jobrole, location, contact } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      jobrole: Joi.string().required(),
      location: Joi.string().required(),
      contact: Joi.string().required(),
    });

    const validationResult = schema.validate({ name, email, jobrole, location, contact });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const career = await CareerModel.create({ name, email, jobrole, location, contact });

    console.log('Registration Successful. We will contact you shortly', career);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cttfm', async (req, res) => {
  try {
    const { fname, lname, email, location, contact, requirement } = req.body;

    // Input validation using Joi
    const schema = Joi.object({
      fname: Joi.string().required(),
      lname: Joi.string().required(),
      email: Joi.string().email().required(),
      location: Joi.string().required(),
      contact: Joi.string().required(),
      requirement: Joi.string().required(),
    });

    const validationResult = schema.validate({ fname, lname, email, location, contact, requirement });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    const contactform = await ContactModel.create({ fname, lname, email, location, contact, requirement });

    console.log('Registration Successful. We will contact you shortly', contactform);
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/trainingfm', (req, res) => {
  const { fname, lname, email, project, duration, contact } = req.body; // Access data from request body

  TrainingModel.create({ fname, lname, email, project, duration, contact })
    .then((trainingForm) => {
      console.log('We will contact you shortly', trainingForm);
      res.json({ message: 'Training registration successful' });
    })
    .catch((err) => {
      console.error('Error creating training registration:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.get('/adminview', async (req, res) => {
  try {
    const subjects = await SubjectModel.find().exec();
    const careerss = await CareerModel.find().exec();
    const requirementt = await ContactModel.find().exec();
    const trainingg = await TrainingModel.find().exec();

    res.json({ subjects, careerss, requirementt,trainingg });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});