const asyncerrorhandler = require('../Middlewares/AsyncError');
const Report = require('../Models/ReportModel');




//Recieve Reports/Get Reports
exports.GetReports = asyncerrorhandler(async(req,res,next)=>{
    const Reports = await Report.find({}).populate({
        path: 'ReceivedFrom',
        select: 'FirstName email', // Select the fields you want to populate for ReceivedFrom
      })
      .populate({
        path: 'ReportedUser',
        select: 'FirstName ProfileUrl', // Select the fields you want to populate for ReportedUser
      })
      .exec();

      res.status(200).json({Reports});
});