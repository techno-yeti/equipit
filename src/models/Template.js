const mongoose = require('mongoose');

const templateEquipmentSchema = new mongoose.Schema(
  {
    equipmentType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EquipmentType',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    supplier: {
      type: String,
      trim: true,
      default: '',
    },
    equipments: [templateEquipmentSchema],
  },
  { timestamps: true }
);

templateSchema.index({ name: 1, supplier: 1 });

module.exports = mongoose.model('Template', templateSchema);
