const asyncerrorhandler = require('../Middlewares/AsyncError');
const User = require('../Models/UserModel');

//Get All Users or FilteredUsers Based on Query
exports.GetAllUsers = asyncerrorhandler(async (req, res, next) => {
  const { Premium, NonPremium, ProfileComplete, ProfileIncomplete } = req.query;
  const SearchQuery = req.query.Search;

  // Build the filter object based on the selected filters
  const filter = {};
  if (Premium) filter.role = 'Premium';
  if (NonPremium) filter.role = 'user';
  if (ProfileComplete) filter.ProfileStatus = 'Complete';
  if (ProfileIncomplete) filter.ProfileStatus = 'Incomplete';

  // Build the search query based on the SearchQuery
  const searchQuery = {
    $or: [
      { FirstName: { $regex: new RegExp(SearchQuery, 'i') } },
      { email: { $regex: new RegExp(`^.*${SearchQuery}@.*$`, 'i') } },
    ],
  };


    let users;

    // Check if any filters or SearchQuery are selected
    if (Object.values(filter).some(Boolean) && SearchQuery) {
      // If both filter and SearchQuery are selected, apply both conditions
      users = await User.find({ ...filter, $and: [searchQuery] });
    } else if (Object.values(filter).some(Boolean) || SearchQuery) {
      // If either filter or SearchQuery is selected, apply the respective condition
      users = await User.find({ ...filter, ...searchQuery });
    } else {
      // If no filters or SearchQuery are selected, return all users
      users = await User.find();
    }

    res.status(200).json({ users });
  } 
);

//Delete/Block/Ban A user
exports.DeleteUser = asyncerrorhandler(async(req,res,next)=>{
    const ID = req.params.id;
    await User.findByIdAndDelete(ID);
    res.status(200).json({Message:'user Deleted'});
});


//User Count
exports.UserCount = asyncerrorhandler(async(req,res,next)=>{
  const TotalUsers = (await User.find({})).length;
  const PremiumUsers = (await User.find({role:'Premium'})).length;
  const NonPremiumUsers = TotalUsers - PremiumUsers;
  res.status(200).json({Total:TotalUsers,Premium:PremiumUsers,NonPremium:NonPremiumUsers});
});



//Users By Month

exports.MonthlyUser = asyncerrorhandler(async(req,res,next)=>{
// Function to aggregate user data by month
function aggregateDataByMonth(users) {
  const userGrowthData = [];
  const groupedData = {};
  // Group users by year and month
  users.forEach((user) => {
    const yearMonth = user.createdAt.toISOString().substr(0, 7); // YYYY-MM format

    if (groupedData[yearMonth]) {
      groupedData[yearMonth]++;
    } else {
      groupedData[yearMonth] = 1;
    }
  });
  // Convert the grouped data into an array of objects
  for (const date in groupedData) {
    userGrowthData.push({ date, users: groupedData[date] });
  }
  return userGrowthData;
}

 // Perform a database query to get user data with timestamps
 const users = await User.find({}, 'createdAt');
 // Aggregate the user data by month
 const userGrowthData = aggregateDataByMonth(users);
 // Return the user growth data as the API response
 res.status(200).json({ growthData: userGrowthData});
});


//Location Based User
exports.GeoUserCount = asyncerrorhandler(async(req,res,next)=>{
  const locationData = await User.aggregate([
    {
      $group: {
        _id: '$Location.city', // Group by city
        count: { $sum: 1 }, // Count the users in each city
      },
    },
  ]);

  const formattedData = locationData.map((entry) => ({
    location: entry._id,
    count: entry.count,
  }));

  res.status(200).json({ locationData: formattedData });
});


//Comparing Gender for Chart(Line-Chart)
exports.CompareGender = asyncerrorhandler(async(req,res,next)=>{
  const genderData = await User.aggregate([
    {
      $group: {
        _id: { gender: '$Gender', date: { $dateToString: { format: '%Y-%m', date: '$createdAt' } } },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.date',
        categories: {
          $push: {
            categoryName: '$_id.gender',
            count: '$count',
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({ genderData });
});


//Bar Chart Premium vs NonPremium Users
exports.CompareRoles = asyncerrorhandler(async(req,res,next)=>{
  const premiumCount = await User.countDocuments({ role: 'Premium' });
    const nonPremiumCount = await User.countDocuments({ role: 'user' });

    const data = {
      premium: premiumCount,
      nonPremium: nonPremiumCount,
    };

    res.status(200).json(data);
});