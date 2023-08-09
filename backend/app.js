const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const UserRoutes = require('./Routes/UserRoutes');
const ReportRoutes = require('./Routes/ReportRoutes');
const AdminRoutes = require('./Routes/AdminRoutes');
const ErrorHandler = require('./Middlewares/ErrorHandler');
const app = express();


app.use(bodyparser.urlencoded({ extended: true }));


// Configure CORS middleware
app.use(cors({
    origin: ['https://love-spark-frontend.vercel.app', 'http://localhost:3000'],
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