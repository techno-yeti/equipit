const mongoose = require("mongoose");

const requestEquipmentSchema = new mongoose.Schema(
  {
    equipmentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EquipmentType",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const requestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      required: [true, "Request number is required"],
      unique: true,
      trim: true,
      match: [
        /^[A-Za-z0-9]{8}$/,
        "Request number must be exactly 8 alphanumeric characters",
      ],
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
      default: null,
    },
    supplier: {
      type: String,
      trim: true,
      default: "",
    },
    equipments: [requestEquipmentSchema],
    status: {
      type: String,
      enum: ["pending", "fulfilled", "dispatched"],
      default: "pending",
    },
    pdfPath: {
      type: String,
      default: null,
    },
    depotSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepotSite",
      default: null,
    },
    plannedDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    boxNumber: {
      type: String,
      trim: true,
      default: "",
    },
    bayNumber: {
      type: String,
      trim: true,
      default: "",
    },
    fulfillmentDate: {
      type: Date,
      default: null,
    },
    dispatchNote: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

requestSchema.index({ status: 1 });

module.exports = mongoose.model("Request", requestSchema);
