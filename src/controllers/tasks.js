const Task = require("../models/task");
const User = require("../models/user");
const Customer = require("../models/customer");
const Tradie = require("../models/tradie");

const {
  formatResponse,
  countAllwithSearch,
  getAll
} = require("../utils/helper");
const { convertQuery } = require("../utils/helper");

async function addTask(req, res) {
  // get id and task info
  const { customerId } = req.params;
  const { title, details, location, dueDate, budget } = req.body;

  // create a new task
  const newTask = new Task({ title, location, dueDate, budget, details });

  // two-way binding with customer: 1-N
  const existingCustomer = await Customer.findById(customerId);
  if (!existingCustomer) {
    return formatResponse(res, 404, "User not found", null);
  }
  // add customer to task.customer: 1
  newTask.customer = existingCustomer._id;

  // add task to customer.tasks: N
  const oldCount = existingCustomer.tasks.length;
  existingCustomer.tasks.addToSet(newTask._id);
  if (oldCount === existingCustomer.tasks.length) {
    return formatResponse(res, 400, "Post failed, please try again.", null);
  }

  await existingCustomer.save();
  await newTask.save();
  return formatResponse(
    res,
    200,
    "Congrats! Task has posted successfully.",
    newTask
  );
}

async function getTask(req, res) {
  const { id } = req.params;
  const task = await Task.findById(id)
    .populate("customer", "name username")
    .populate("tradie", "name username")
    .populate("offers.tradie", "name avatar")
    .exec();
  if (!task) {
    return formatResponse(res, 404, "Task not found", null);
  }
  return formatResponse(res, 200, null, task);
}

async function getAllTasks(req, res) {
  // q: search key
  const { q } = req.query;
  const total = await countAllwithSearch(Task, q);

  // deal with pagination, sort, search
  const { pagination, priceRange, search, sort } = convertQuery(
    req.query,
    total
  );

  const tasks = await getAll(Task, pagination, priceRange, search, sort);

  return formatResponse(res, 200, null, { tasks, pagination });
}

async function addOffer(req, res) {
  const { id, tradieId } = req.params;
  const { price, comment } = req.body;

  // validate tradie exist
  const existingTradie = await Tradie.findById(tradieId);
  if (!existingTradie) {
    return formatResponse(res, 404, "Tradie not found", null);
  }

  const newOffer = { tradie: tradieId, price, comment };

  const existingTask = await Task.findById(id);

  // validate task exist
  if (!existingTask) {
    return formatResponse(res, 404, "Task not found", null);
  }

  const oldCount = existingTask.offers.length;

  existingTask.offers.push(newOffer);
  await existingTask.save();

  // check if offers array changed
  if (oldCount === existingTask.offers.length) {
    return formatResponse(
      res,
      400,
      "Offer haven't been added for some reasons, please try again",
      null
    );
  }

  const newOfferInDB = existingTask.offers[existingTask.offers.length - 1];

  return formatResponse(res, 200, null, newOfferInDB);
}

module.exports = { addTask, getAllTasks, getTask, addOffer };
