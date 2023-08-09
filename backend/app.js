const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const UserRoutes = require('./Routes/UserRoutes');
const ReportRoutes = require('./Routes/ReportRoutes');
const AdminRoutes = require('./Routes/AdminRoutes');
const ErrorHandler = require('./Middlewares/ErrorHandler');
const app = express();



app.use(bodyparser.urlencoded({extended:true}));
const allowedOrigins = [
    'http://localhost:3000', // Add other origins as needed
    'https://love-spark-frontend.vercel.app', // Remove the trailing slash from the URL
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
  }));
    
    app.use(express.json());
    app.use(cookieParser());
app.use('/api/Users/',UserRoutes);
app.use('/api/Reports/',ReportRoutes);
app.use('/api/Admin/',AdminRoutes);
app.use(ErrorHandler);

app.get('/',(req,res)=>{
    res.json('Wroking, Hello From loveSpark');
    });
    
module.exports = app;