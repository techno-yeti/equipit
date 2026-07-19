function serverError(res, user, message) {
  console.error(message);
  res.status(500).render("error", {
    message,
    error: null,
    user: user || null,
  });
}

function notFound(res, user, message) {
  res.status(404).render("error", {
    message,
    error: null,
    user: user || null,
  });
}

module.exports = { serverError, notFound };
