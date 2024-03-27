export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.send("You Must be logged for view this"); 
      }
  
      const userRole = req.user.rol;
      if (allowedRoles.includes(userRole)) {
        return next();
      } else {
        return res.status(403).send('Access Denied');
      }
    };
  };
  