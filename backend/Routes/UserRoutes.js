const router = require('express').Router();
const {GetAllUsers,DeleteUser,UserCount,MonthlyUser,GeoUserCount,CompareGender,CompareRoles} = require('../Controllers/UserController.js');
//const passport = require('passport');


router.route('/All').get(GetAllUsers);
router.route('/Count').get(UserCount);
router.route('/UserGrowth').get(MonthlyUser);
router.route('/LocationCount').get(GeoUserCount);
router.route('/GenderDistribution').get(CompareGender);
router.route('/CompareRoles').get(CompareRoles);
router.route('/Delete/:id').delete(DeleteUser);

module.exports = router;