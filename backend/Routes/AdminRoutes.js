const router = require('express').Router();
const {authenticate} = require('../Middlewares/Auth');
const {LoginAdmin,RegisterAdmin,AdminDetails,logout,AdminExists,UpdateAdminDetails} = require('../Controllers/AdminController');


router.route('/Login').post(LoginAdmin);
router.route('/Register').post(RegisterAdmin);
router.route('/Logout').get(logout);
router.route('/AdminExists').get(AdminExists);
router.route('/UpdateInfo').put(authenticate,UpdateAdminDetails);
router.route('/Info').get(AdminDetails);


module.exports = router;