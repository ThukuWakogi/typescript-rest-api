import { Request, Response } from "express";
import usersService from "../services/users.services";
import argon2 from "argon2";
import debug from "debug";
import { IUserDto } from "../dto/users.model";

const log = debug("app:users-controller");

class UsersController {
  private static instance: UsersController;

  static getInstance() {
    if (!UsersController.instance)
      UsersController.instance = new UsersController();

    return UsersController.instance;
  }

  async listUsers(req: Request, res: Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: Request<{ id: string }>, res: Response) {
    const user = await usersService.readById(req.params.id);
    res.status(200).send(user);
  }

  async createUser(req: Request<any, any, IUserDto>, res: Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: Request<any, any, IUserDto>, res: Response) {
    if (req.body.password)
      req.body.password = await argon2.hash(req.body.password);

    log(await usersService.patchById(req.body));
    res.status(204).send("");
  }

  async put(
    req: Request<{ userId: string }, any, Omit<IUserDto, "id">>,
    res: Response
  ) {
    req.body.password = await argon2.hash(req.body.password);
    log(await usersService.updateById({ id: req.params.userId, ...req.body }));
    res.status(204).send("");
  }

  async removeUser(req: Request<{ userId: string }>, res: Response) {
    log(await usersService.deleteById(req.params.userId));
    res.status(204);
  }
}

export default UsersController.getInstance();
