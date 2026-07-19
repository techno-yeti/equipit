const mongoose = require('mongoose');
const config = require('./config/env');
const EquipmentType = require('./models/EquipmentType');

const seedEquipmentTypes = async () => {
  const types = [
    { name: 'Roll Cage', description: 'Standard wire roll cage for general goods' },
    { name: 'Full Tray', description: 'Full-size tray for bulk items' },
    { name: 'Half Tray', description: 'Half-size tray for smaller loads' },
    { name: 'Black Base', description: 'Black plastic base unit' },
    { name: 'Green Base', description: 'Green plastic base unit' },
  ];

  for (const type of types) {
    const existing = await EquipmentType.findOne({ name: type.name });
    if (!existing) {
      await EquipmentType.create(type);
      console.log(`  Created equipment type: ${type.name}`);
    } else {
      console.log(`  Equipment type already exists: ${type.name}`);
    }
  }
};

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
    console.log('Seeding equipment types...');
    await seedEquipmentTypes();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
