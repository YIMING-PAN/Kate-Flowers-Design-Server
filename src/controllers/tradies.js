const Tradie = require("../models/tradie");
const Customer = require("../models/customer");
const { formatResponse } = require("../utils/helper");

async function addTradie(req, res) {
  const {
    name,
    gender,
    language,
    address,
    avatar,
    mobile,
    introduction
  } = req.body;
  const tradie = new Tradie({
    name,
    gender,
    language,
    address,
    avatar,
    mobile,
    introduction
  });
  // return res.json({ name, gender, email }); // 读不出body？？
  await tradie.save();
  return formatResponse(res, 201, null, tradie);
}

async function getTradie(req, res) {
  const { id } = req.params;
  const tradie = await Tradie.findById(id).populate("customers");
  if (!tradie) {
    return formatResponse(res, 404, "Tradie not found", null);
  }
  return formatResponse(res, 200, null, tradie);
}

async function getAllTradies(req, res) {
  // pageSize: num of document in a page
  // page: current page num
  const { page, pageSize } = req.params;
  let query = Tradie.find();

  if (pageSize && page) {
    query = query.skip(page).limit(pageSize);
  }

  const tradies = await query.exec();
  return formatResponse(res, 200, null, tradies);
}

async function updateTradie(req, res) {
  const { id } = req.params;
  const {
    name,
    gender,
    email,
    language,
    address,
    avatar,
    introduction,
    title,
    professionalYears,
    skills,
    vocation,
    reviews
  } = req.body;
  const tradie = await Tradie.findByIdAndUpdate(
    id,
    {
      name,
      gender,
      email,
      language,
      address,
      avatar,
      introduction,
      title,
      professionalYears,
      skills,
      vocation,
      reviews
    },
    { new: true }
  );
  if (!tradie) {
    return formatResponse(res, 404, "Tradie not found", null);
  }
  return formatResponse(res, 200, "Successfully updated", tradie);
}

async function deleteTradie(req, res) {
  const { id } = req.params;
  const deletedTradie = await Tradie.findByIdAndDelete(id);
  if (!deletedTradie) {
    return res.status(404).send("Tradie ID not found");
  }

  // delete ref
  await Customer.updateMany(
    { _id: { $in: deletedTradie.customers } },
    { $pull: { tradies: deletedTradie._id } }
  );

  return formatResponse(res, 200, "Successfully deleted", deletedTradie);
}

module.exports = {
  addTradie,
  getTradie,
  getAllTradies,
  updateTradie,
  deleteTradie
};
