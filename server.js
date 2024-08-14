import express from 'express';
import mongoose, { connect } from 'mongoose';
import session from 'express-session';
import dashboardRouter from './routes/dashboard_router.js';
import apiRouter from './apis/dashboard/dashboard_api_router.js';
import frontEndRouter from './routes/frontend/frontend_router.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: 'kp2024',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

//-------------------------------

app.use('/dashboard', dashboardRouter);
app.use('/api', apiRouter);
app.use('/', frontEndRouter);
app.use((req, res, next) => res.status(404).redirect('/404'));


app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const MAX_ATTEMPTS = 3;
const connectToDb = async (attempts = 3) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    attempts = 0;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    if (attempts < MAX_ATTEMPTS) {
      console.log(`Retrying connection attempt ${retries}/${MAX_RETRIES}...`);
      setTimeout(connectToDb, 5000); // Retry after 5 seconds
    } else {
      console.error('Failed to connect to MongoDB after maximum retries. Exiting...');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected! Trying to reconnect...');
  connectToDb();
});


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDb();
});
