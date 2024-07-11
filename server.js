import express from 'express';
import mongoose from 'mongoose';
import dashboardRouter from './routes/dashboard/dashboard_router.js';
import apiRouter from './apis/dashboard_api_router.js';

const app = express();

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static('public'));
app.use(express.json());

//-------------------------------

app.use('/dashboard', dashboardRouter);
app.use('/api', apiRouter);

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const connectToDb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://itayakni:kick.pulse.cs@cluster0.yl5rjk1.mongodb.net/kickpulse_2024?retryWrites=true&w=majority&appName=Cluster0'
    );
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDb();
});

//mongodb+srv://margolin23:nYbjAMqvAGBtsmdZ@cluster1.3slcbul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
