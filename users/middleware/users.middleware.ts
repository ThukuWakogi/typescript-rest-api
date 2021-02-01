import { Request, Response, NextFunction } from "express";
import { requestWhitelist } from "express-winston";
import { IUserDto } from "../dto/users.model";
import usersService from "../services/users.services";
import { ParamsDictionary } from "express-serve-static-core";

class UsersMiddleware {
  private static instance: UsersMiddleware;

  static getInstance() {
    if (!UsersMiddleware.instance)
      UsersMiddleware.instance = new UsersMiddleware();

    return UsersMiddleware.instance;
  }

  async validateRequiredUserBodyFields(
    req: Request<any, any, IUserDto>,
    res: Response,
    next: NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) next();
    else
      res
        .status(400)
        .send({ error: "Missing required fields: email and/or password" });
  }

  async validateSameEmailDoesntExist(
    req: Request<any, any, IUserDto>,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email);

    if (user) res.status(400).send({ error: "User email already exists" });
    else next();
  }

  async validateSameEmailBelongToSameUser(
    req: Request<{ userId: string }, any, IUserDto>,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email);

    if (user && user.id === req.params.userId) next();
    else res.status(400).send({ error: "Invalid email" });
  }

  async validatePatchEmail(
    req: Request<any, any, IUserDto>,
    res: Response,
    next: NextFunction
  ) {
    if (req.body.email)
      UsersMiddleware.getInstance().validateSameEmailBelongToSameUser(
        req,
        res,
        next
      );
    else next();
  }

  async validateUserExists(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const user = await usersService.readById(req.params.userId);

    if (user) next();
    else res.status(404).send({ error: `User ${req.params.userId} not found` });
  }

  async extractUserId(
    req: Request<ParamsDictionary | { userId: string }, any, IUserDto>,
    res: Response,
    next: NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }
}

export default UsersMiddleware.getInstance();
