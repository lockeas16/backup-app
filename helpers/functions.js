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
 * @function isAdmin
 * Checks if the user is an admin, otherwise it logouts the user
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

/**
 * @function checkRoles
 * Checks the user role
 * @param  {string} role
 * @param  {string} urlRedirect
 * @param  {express HTTP Request} req
 * @param  {express HTTP Response} res
 * @param  {function} next
 */
exports.checkRoles = (role, urlRedirect) => {
  return function(req, res, next) {
    if (req.user.role === role) {
      return next();
    } else {
      res.redirect(urlRedirect);
    }
  };
};

/**
 * @function storeUrl
 * Store in session the current Url
 * @param  {express HTTP Request} req
 * @param  {express HTTP Response} res
 * @param  {function} next
 */
exports.storeUrl = (req, res, next) => {
  req.session.previousUrl = req.originalUrl;
  return next();
};