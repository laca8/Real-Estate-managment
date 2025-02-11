const Property = require("../models/Property");
const AppError = require("../utils/AppError");
// Get all properties with filters
const getProperties = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.minPrice) filters.price = { $gte: req.query.minPrice };
    if (req.query.maxPrice)
      filters.price = { ...filters.price, $lte: req.query.maxPrice };
    if (req.query.bedrooms) filters.bedrooms = req.query.bedrooms;
    console.log(filters);

    const properties = await Property.find(filters)
      .populate("agent", "name phone")
      .sort("-createdAt");
    return res.status(200).json(properties);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Create new property (protected route)
const createProperty = async (req, res, next) => {
  const property = new Property({
    ...req.body,
    agent: req.params.agentId,
  });

  try {
    const newProperty = await property.save();
    return res.status(201).json(newProperty);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Get property by ID
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "name phone"
    );
    if (!property) {
      return next(new AppError("property not found", 404));
    }
    return res.status(200).json(property);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

// Update property (protected route)
const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property.agent != req.params.agentId) {
      return next(new AppError("not aurhorized...", 404));
    }
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(updatedProperty);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
module.exports = {
  updateProperty,
  getProperties,
  getPropertyById,
  createProperty,
};
