const advancedResults = model => async (req, res, next) => {
  const results = await model.find().populate({
    path: "user",
    select: "name"
  });

  res.advancedResults = { success: true, count: results.length, data: results };

  next();
};
module.exports = advancedResults;
