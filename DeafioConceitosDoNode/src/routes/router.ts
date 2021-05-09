import { Router, Request, Response, NextFunction } from 'express';
import UsersRoute from './route/users';
import TodosRoute from './route/todos';

class MasterRouter {
  private _router = Router();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching routers.
   */
  private _configure() {
    this._router.use('/user', UsersRoute);
    this._router.use('/todos', TodosRoute);
  }
}

export = new MasterRouter().router;