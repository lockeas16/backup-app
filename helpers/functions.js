/**
 * @function isAuth
 * Checks if the user is authenticated, otherwise redirects to login
 * @param  {express HTTP Request} req
 * @param  {express HTTP Response} res
 * @param  {function} next
 */
exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

/**
 * @function isAuth
 * Checks if the user is authenticated, otherwise redirects to login
 * @param  {express HTTP Request} req
 * @param  {express HTTP Response} res
 * @param  {function} next
 */
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN") {
    return next();
  } else {
    req.logout();
    res.render("admin/auth-form", {
      login: true,
      err: "You're not admin"
    });
  }
};