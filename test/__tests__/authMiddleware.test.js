const jwt = require("jsonwebtoken");

describe("extractUser", () => {
  let extractUser;
  let mockReq, mockRes, mockNext;
  const JWT_SECRET = "test-jwt-secret";

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  beforeEach(() => {
    jest.resetModules();
    extractUser = require("../../src/middleware/auth").extractUser;

    mockReq = { cookies: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  test("sets req.user to null when no token exists", async () => {
    await extractUser(mockReq, mockRes, mockNext);
    expect(mockReq.user).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  test("sets req.user to null when token is invalid", async () => {
    mockReq.cookies.token = "invalid-token";
    await extractUser(mockReq, mockRes, mockNext);
    expect(mockReq.user).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  test("calls next on error", async () => {
    mockReq.cookies = null;
    await extractUser(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("requireAuth", () => {
  let requireAuth;
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.resetModules();
    requireAuth = require("../../src/middleware/auth").requireAuth;

    mockReq = { user: null, xhr: false, path: "/dashboard" };
    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  test("redirects to login when user is not authenticated", () => {
    requireAuth(mockReq, mockRes, mockNext);
    expect(mockRes.redirect).toHaveBeenCalledWith("/login");
    expect(mockNext).not.toHaveBeenCalled();
  });

  test("returns 401 JSON for XHR requests without auth", () => {
    mockReq.xhr = true;
    requireAuth(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication required",
    });
  });

  test("returns 401 JSON for API requests without auth", () => {
    mockReq.path = "/api/v1/something";
    requireAuth(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication required",
    });
  });

  test("calls next when user is authenticated", () => {
    mockReq.user = { _id: "user1", role: "admin" };
    requireAuth(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});

describe("requireRole", () => {
  let requireRole;
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.resetModules();
    requireRole = require("../../src/middleware/auth").requireRole;

    mockReq = {
      user: { _id: "user1", role: "admin", name: "Admin" },
      xhr: false,
      path: "/dashboard",
    };
    mockRes = {
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      render: jest.fn(),
    };
    mockNext = jest.fn();
  });

  test("calls next when user has required role", () => {
    const middleware = requireRole("admin");
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("calls next when user has one of multiple required roles", () => {
    mockReq.user.role = "manager";
    const middleware = requireRole("admin", "manager");
    middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test("renders 403 when user lacks required role", () => {
    mockReq.user.role = "user";
    const middleware = requireRole("admin");
    middleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.render).toHaveBeenCalledWith("error", {
      message: "You do not have permission to access this page",
      error: null,
      user: mockReq.user,
    });
  });

  test("redirects unauthenticated users to login", () => {
    mockReq.user = null;
    const middleware = requireRole("admin");
    middleware(mockReq, mockRes, mockNext);
    expect(mockRes.redirect).toHaveBeenCalledWith("/login");
  });

  test("returns 403 JSON for XHR requests when lacking role", () => {
    mockReq.xhr = true;
    mockReq.user.role = "user";
    const middleware = requireRole("admin");
    middleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Insufficient permissions",
    });
  });
});
