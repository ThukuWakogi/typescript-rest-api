import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application, Request, Response, NextFunction } from "express";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";

type RequestWithIdParam = Request<{ userId: number }>;

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes() {
    this.app
      .route("/users")
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validateRequiredUserBodyFields,
        UsersMiddleware.validateSameEmailDoesntExist,
        UsersController.createUser
      );
    this.app.param(`userId`, UsersMiddleware.extractUserId);
    this.app
      .route("/users/:userId")
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);
    this.app.put("/users/:userId", [
      UsersMiddleware.validateRequiredUserBodyFields,
      UsersMiddleware.validateSameEmailBelongToSameUser,
      UsersController.put,
    ]);
    this.app.patch("/users/:usersId", [
      UsersMiddleware.validatePatchEmail,
      UsersController.patch,
    ]);

    return this.app;
  }
}
