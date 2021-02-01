import usersDao from "../daos/users.dao";
import { ICRUD } from "../../common/interfaces/crud.interface";
import { IUserDto } from "../dto/users.model";

class UsersService implements ICRUD {
  private static instance: UsersService;

  static getInstance() {
    if (!UsersService.instance) UsersService.instance = new UsersService();

    return UsersService.instance;
  }

  async create(resource: IUserDto) {
    return await usersDao.addUser(resource);
  }

  async deleteById(resourceId: string) {
    return await usersDao.removeUserById(resourceId);
  }

  async list(limit: number, page: number) {
    return await usersDao.getUsers();
  }

  async patchById(resource: IUserDto) {
    return await usersDao.patchUserById(resource);
  }

  async readById(resourceId: string) {
    return await usersDao.getUserById(resourceId);
  }

  async updateById(resource: IUserDto) {
    return await usersDao.putUserById(resource);
  }

  async getUserByEmail(email: string) {
    return usersDao.getUserByEmail(email);
  }
}

export default UsersService.getInstance();
