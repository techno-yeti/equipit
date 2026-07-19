const Request = require("../models/Request");
const {
  findDispatchRequests,
  findRequestByNumber,
} = require("../services/requestQueries");
const { serverError } = require("../helpers/errorResponse");

function renderDispatch(res, user, requests, error, success) {
  res.render("dispatch/index", { requests, user, error, success });
}

async function getDispatch(req, res) {
  try {
    const requests = await findDispatchRequests(req.user);
    renderDispatch(res, req.user, requests, null, null);
  } catch (err) {
    serverError(res, req.user, "Failed to load dispatch page");
  }
}

async function postScanBarcode(req, res) {
  try {
    const { barcode } = req.body;

    const requests = await findDispatchRequests(req.user);

    if (!barcode || !barcode.trim()) {
      return renderDispatch(
        res,
        req.user,
        requests,
        "Please scan or enter a barcode",
        null,
      );
    }

    const requestNumber = barcode.trim().toUpperCase();

    if (!/^[A-Z0-9]{8}$/.test(requestNumber)) {
      return renderDispatch(
        res,
        req.user,
        requests,
        "Invalid barcode format. Must be 6 alphanumeric characters.",
        null,
      );
    }

    const request = await findRequestByNumber(requestNumber);

    if (!request) {
      return renderDispatch(
        res,
        req.user,
        requests,
        "No request found with this barcode",
        null,
      );
    }

    if (request.status === "dispatched") {
      return renderDispatch(
        res,
        req.user,
        requests,
        "This trailer has already been dispatched",
        null,
      );
    }

    if (request.status === "pending") {
      return renderDispatch(
        res,
        req.user,
        requests,
        "This request has not been fulfilled yet",
        null,
      );
    }

    await Request.findOneAndUpdate({ requestNumber }, { status: "dispatched" });

    const updatedRequests = await findDispatchRequests(req.user);
    renderDispatch(
      res,
      req.user,
      updatedRequests,
      null,
      "Trailer dispatched successfully",
    );
  } catch (err) {
    console.error("Error processing barcode:", err);
    const requests = await findDispatchRequests(req.user);
    renderDispatch(res, req.user, requests, "Failed to process barcode", null);
  }
}

module.exports = { getDispatch, postScanBarcode };
