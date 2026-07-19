function getHelp(req, res) {
  res.render("help", { user: req.user || null });
}

module.exports = { getHelp };
