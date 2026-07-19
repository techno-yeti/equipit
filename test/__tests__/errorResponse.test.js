describe("serverError", () => {
  let serverError;
  let mockReq, mockRes;

  beforeEach(() => {
    jest.resetModules();
    serverError = require("../../src/helpers/errorResponse").serverError;

    mockReq = { user: { _id: "user1", name: "Test", role: "admin" } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
    };
  });

  test("renders 500 error page with given message", () => {
    console.error = jest.fn();
    serverError(mockRes, mockReq.user, "Something went wrong");

    expect(console.error).toHaveBeenCalledWith("Something went wrong");
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.render).toHaveBeenCalledWith("error", {
      message: "Something went wrong",
      error: null,
      user: mockReq.user,
    });
  });

  test("handles null user", () => {
    serverError(mockRes, null, "Error");

    expect(mockRes.render).toHaveBeenCalledWith("error", {
      message: "Error",
      error: null,
      user: null,
    });
  });
});

describe("notFound", () => {
  let notFound;
  let mockReq, mockRes;

  beforeEach(() => {
    jest.resetModules();
    notFound = require("../../src/helpers/errorResponse").notFound;

    mockReq = { user: { _id: "user1", name: "Test", role: "admin" } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
    };
  });

  test("renders 404 error page with given message", () => {
    notFound(mockRes, mockReq.user, "Resource not found");

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.render).toHaveBeenCalledWith("error", {
      message: "Resource not found",
      error: null,
      user: mockReq.user,
    });
  });

  test("handles null user", () => {
    notFound(mockRes, null, "Not found");

    expect(mockRes.render).toHaveBeenCalledWith("error", {
      message: "Not found",
      error: null,
      user: null,
    });
  });
});
