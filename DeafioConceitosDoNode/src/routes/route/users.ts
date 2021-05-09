import { NextFunction, Request, Response, Router } from 'express';
import { reWriteFile, readJsonFile } from "../../utils/JsonProcess";
import path from 'path'
import { userDBInterface } from '../../interfaces/userInterface'

class Users {
  private _router = Router();

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */

  private pickMax = (userDb: userDBInterface[]) => {
    let max = Number.MIN_VALUE
    userDb.map((user, index) =>{
      if(max < user.id) max = user.id;
    })
    return max;
  }

  private _configure() {
    this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          name, username
        } = req.body;
        let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');
        let newId = this.pickMax(userDb) + 1;
        userDb.push({
          id: newId,
          name: name,
          username: username,
          todos: [],
        });
        await reWriteFile(path.resolve('./') + '/src/db/userDb.json', userDb);
        res.status(202).send({ userDb });
      } catch (error) {
        console.log(error);
        res.status(400).send('Error on User Route');
      }
    });

  }
}


export = new Users().router;