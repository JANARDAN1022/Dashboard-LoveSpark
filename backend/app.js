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
app.use(cors({  
    origin: 'http://localhost:3000',
    methods:"GET, POST, PUT, DELETE",
    credentials: true,
    }
     ));
    
    app.use(express.json());
    app.use(cookieParser());
app.use('/api/Users/',UserRoutes);
app.use('/api/Reports/',ReportRoutes);
app.use('/api/Admin/',AdminRoutes);
app.use(ErrorHandler);
module.exports = app;