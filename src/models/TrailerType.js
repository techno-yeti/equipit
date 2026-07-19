const mongoose = require("mongoose");

const trailerEquipmentSchema = new mongoose.Schema(
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

const trailerTypeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Trailer label is required"],
      unique: true,
      trim: true,
    },
    equipments: [trailerEquipmentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("TrailerType", trailerTypeSchema);
