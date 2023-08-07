const router = require('express').Router();
const {GetReports} = require('../Controllers/ReportController');



router.route('/GetReports').get(GetReports);


module.exports = router;