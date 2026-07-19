(function () {
  const container = document.getElementById("equipmentRows");
  const addBtn = document.getElementById("addEquipmentBtn");

  if (!container) return;

  container.addEventListener("click", function (e) {
    const btn = e.target.closest(".remove-equipment-btn");
    if (btn) {
      btn.closest(".flex")?.remove();
    }
  });

  if (addBtn) {
    addBtn.addEventListener("click", addEquipmentRow);
  }

  function addEquipmentRow() {
    const options = container.querySelector("select")?.innerHTML || "";
    const row = document.createElement("div");
    row.className = "flex items-center space-x-2";
    row.innerHTML =
      '<select name="equipmentType[]" class="input-field">' +
      options +
      "</select>" +
      '<input type="number" name="quantity[]" class="input-field w-24" placeholder="Qty" min="0">' +
      '<button type="button" class="remove-equipment-btn text-red-500 hover:text-red-700 p-1">&times;</button>';
    container.appendChild(row);
  }
})();
