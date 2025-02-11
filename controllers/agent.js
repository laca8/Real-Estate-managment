const Agent = require("../models/Agent");
const User = require("../models/User");

const createAgent = async (req, res, next) => {
  const every = {
    ...req.body,
    userId: req.user._id,
  };
  try {
    const agent = await Agent.create(every);
    return res.status(201).json(agent);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};
const getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById({ _id: req.params.id });
    return res.status(200).json(agent);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

const updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!agent) {
      return next(new AppError("agent not found", 404));
    }

    return res.status(200).json(agent);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndDelete({ _id: req.params.id });
    if (!agent) {
      return next(new AppError("agent not found", 404));
    }

    return res.status(200).json("agent deleted...");
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};
module.exports = {
  createAgent,
  deleteAgent,
  getAgent,
  updateAgent,
};
