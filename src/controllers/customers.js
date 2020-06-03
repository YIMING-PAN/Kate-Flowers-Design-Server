const mongoose = require("mongoose");
const Customer = require("../models/customer");
const Tradie = require("../models/tradie");
const Task = require("../models/task");
const { formatResponse } = require("../utils/helper");

async function addCustomer(req, res) {
  const {
    name,
    gender,
    language,
    address,
    mobile,
    avatar,
    introduction
  } = req.body;

  const customer = new Customer({
    name,
    gender,
    language,
    address,
    mobile,
    avatar,
    introduction
  });

  await customer.save();
  return formatResponse(res, 201, null, customer);
}

async function getCustomer(req, res) {
  const { id } = req.params;
  const customer = await Customer.findById(id)
    .populate("tradies", "name")
    .exec();
  if (!customer) {
    return formatResponse(res, 404, "Customer not found", null);
  }
  return formatResponse(res, 200, null, customer);
}

async function getAllCustomers(req, res) {
  const customers = await Customer.find().exec();
  return res.json(customers);
}

async function updateCustomer(req, res) {
  const { id } = req.params;
  const {
    name,
    gender,
    email,
    language,
    address,
    mobile,
    avatar,
    introduction
  } = req.body;

  // join.validate({}, template) ==> to validate update info
  // or just use findById => update => save();
  const newCustomer = await Customer.findByIdAndUpdate(
    id,
    {
      name,
      gender,
      email,
      language,
      address,
      mobile,
      avatar,
      introduction
    },
    { new: true }
  );
  if (!newCustomer) {
    return formatResponse(res, 404, "Customer not found", null);
  }
  return formatResponse(res, 201, null, newCustomer);
}

async function deleteCustomer(req, res) {
  // get id
  const { id } = req.params;
  // get document
  const deletedCustomer = await Customer.findById(id);
  if (!deletedCustomer) {
    return formatResponse(res, 404, "Customer not found", null);
  }
  // delete ref - tradie
  await Tradie.updateMany(
    { _id: { $in: deletedCustomer.tradies } },
    { $pull: { customers: deletedCustomer._id } }
  );
  // delete all tasks belongs to deletedCustomer
  deletedCustomer.tasks.forEach(
    async task => await Task.findByIdAndDelete(task)
  );

  // delete target customer
  await Customer.findByIdAndDelete(id);

  return formatResponse(res, 200, "Delete successfully", deletedCustomer);
}

/**
 * assign tradie to an existing task
 */
async function assignTradie(req, res) {
  // get id
  const { id: customerId, taskId, tradieId } = req.params;

  // get document
  const customer = await Customer.findById(customerId);
  const task = await Task.findById(taskId);
  const tradie = await Tradie.findById(tradieId);

  // check existed
  if (!customer) {
    return formatResponse(res, 404, "Customer not found", null);
  }
  if (!tradie) {
    return formatResponse(res, 404, "Tradie not found", null);
  }
  if (!task) {
    return formatResponse(res, 404, "Task not found", null);
  }

  const customerIdInTask = task.customer._id.toString();

  if (customerIdInTask !== customerId) {
    return formatResponse(
      res,
      400,
      "You have no right to assign this task.",
      null
    );
  }

  if (task.tradie) {
    return formatResponse(res, 400, "Tradie is already assigned.", null);
  }

  const tradiesArrOldLength = customer.tradies.length;
  const customersArrOldLength = tradie.customers.length;
  const tasksArrOldLength = tradie.tasks.length;
  // add tradie to task
  task.tradie = tradie._id;
  // add tradie to customer - no redundancy
  customer.tradies.addToSet(tradie._id);
  // add customer to tradie - no redundancy
  tradie.customers.addToSet(customer._id);
  // add task to tradie - no redundancy
  tradie.tasks.addToSet(task._id);

  // adding validity
  if (
    tradiesArrOldLength === customer.tradies.length ||
    customersArrOldLength === tradie.customers.length ||
    task.tradie !== tradie._id ||
    tradie.tasks.length === tasksArrOldLength
  ) {
    return formatResponse(res, 400, "Assign failed, please try again.", null);
  }

  // update the task status from [open] to [assigned]
  task.status = "assigned";

  // return success
  await customer.save();
  await tradie.save();
  await task.save();
  return formatResponse(res, 201, "Assign successfully!", customer);
}

async function deleteTradie(req, res) {
  // get id
  const { id, tradieId } = req.params;

  // get document
  const customer = await Customer.findById(id);
  const tradie = await Tradie.findById(tradieId);

  // check existed
  if (!customer) {
    return formatResponse(res, 404, "Customer not found", null);
  }
  if (!tradie) {
    return formatResponse(res, 404, "Tradie not found", null);
  }

  // delete tradie
  const tradiesArrOldLength = customer.tradies.length;
  const customersArrOldLength = tradie.customers.length;

  customer.tradies.pull(tradie._id);
  tradie.customers.pull(customer._id);

  // check array length
  if (
    tradiesArrOldLength === customer.tradies.length ||
    customersArrOldLength === tradie.customers.length
  ) {
    return formatResponse(
      res,
      400,
      "Delete unsuccessfully, please try again.",
      null
    );
  }

  await tradie.save();
  await customer.save();
  return formatResponse(res, 201, "Delete Successfully!", customer);
}

module.exports = {
  addCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  assignTradie,
  deleteTradie
};
