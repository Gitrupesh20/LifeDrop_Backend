const varifyRole = (...allowedRole) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...allowedRole];
    console.log(req.roles);
    console.log(rolesArray);
    const roles = req.roles;

    const result = roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);

    next();
  };
};
