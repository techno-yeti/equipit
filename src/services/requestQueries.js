const Request = require("../models/Request");

const requestPopulate = [
  { path: "equipments.equipmentType" },
  { path: "template", select: "name" },
  { path: "depotSite", select: "name" },
  { path: "createdBy", select: "name" },
  { path: "fulfilledBy", select: "name" },
];

const dispatchPopulate = [
  { path: "equipments.equipmentType" },
  { path: "depotSite", select: "name" },
];

async function findAllRequests(filters = {}) {
  const query = {};
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    query.requestNumber = new RegExp(
      "^" + filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
  }
  return Request.find(query)
    .populate(requestPopulate)
    .sort({ createdAt: -1 })
    .lean();
}

async function findRequestById(id) {
  return Request.findById(id).populate(requestPopulate).lean();
}

async function findRequestByNumber(requestNumber) {
  return Request.findOne({ requestNumber }).lean();
}

async function findDispatchRequests(user) {
  const filter = {};
  if (user.role === "security") {
    filter.status = { $in: ["fulfilled", "dispatched"] };
    if (user.depotSite) {
      filter.depotSite = user.depotSite;
    }
  }
  return Request.find(filter)
    .populate(dispatchPopulate)
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  requestPopulate,
  findAllRequests,
  findRequestById,
  findRequestByNumber,
  findDispatchRequests,
};
