const mongoose = require("mongoose");

const depotSiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Depot site name is required"],
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isFirstSite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DepotSite", depotSiteSchema);
