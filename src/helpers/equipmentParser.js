function parseEquipmentAllocation(equipmentType, quantity) {
  const items = [];
  if (!equipmentType) return items;

  const types = Array.isArray(equipmentType) ? equipmentType : [equipmentType];
  const qtys = Array.isArray(quantity) ? quantity : [quantity];

  for (let i = 0; i < types.length; i++) {
    const qty = parseInt(qtys[i], 10);
    if (types[i] && qty > 0) {
      items.push({ equipmentType: types[i], quantity: qty });
    }
  }

  return items;
}

module.exports = { parseEquipmentAllocation };
