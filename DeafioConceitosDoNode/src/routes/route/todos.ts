import { NextFunction, Request, Response, Router } from 'express';
import { userDBInterface, todosInterface } from '../../interfaces/userInterface'
import { readJsonFile, reWriteFile } from "../../utils/JsonProcess";
import path from 'path'

class Todos {
    private _router = Router();

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private pickTodoByUsername = (usernames: string | string[], userDb: userDBInterface[]) => {
        return userDb.map((user, index) => {
            if (Array.isArray(usernames)) {
                for (let index = 0; index < usernames.length; index++) {
                    if (usernames[index] === user.username) {
                        return user.todos;
                    }
                }
            } else {
                if (usernames === user.username) return user.todos
            }

        }).filter(undef => undef !== undefined)
    }

    private filterUsername = (username: string, userDb: userDBInterface[]): userDBInterface[] => {
        return userDb.filter((user, index) => {
            if (username === user.username) {
                return true;
            }
        })
    }

    private pickMax = (todos: todosInterface[]) => {
        let max = Number.MIN_VALUE
        todos.map((todo, index) => {
            if (max < todo.id) max = todo.id;
        })
        return max;
    }

    private updateTodoTitleAndDeadLine = (todos: todosInterface[], id: number, title:string, deadline:string): todosInterface[] =>{
        let newTodo = [...todos]
        todos.map((todo, index) =>{
            if(todo.id === id) {
                newTodo[index] = {
                    ...newTodo[index],
                    deadline: deadline,
                    title: title,
                }
            }
        })
        
        return newTodo;
    }

    private updateTodoDoneToTrue = (todos: todosInterface[], id: number): todosInterface[] =>{
        let newTodo = [...todos]
        todos.map((todo, index) =>{
            if(todo.id === id) {
                newTodo[index] = {
                    ...newTodo[index],
                    done: true
                }
            }
        })
        return newTodo;
    }
    private removeTodoById = (todos: todosInterface[], id: number): todosInterface[] =>{
        return todos.filter((todo, index) =>{
            if(todo.id === id) return false
            else return true
        })
    }

    /**
     * Connect routes to their matching controller endpoints.
     */
    private _configure() {
        this._router.post('/:username', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    title, deadline
                } = req.body;

                const {
                    username
                } = req.params

                console.log("Entrando teste")

                let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');

                let newUserDb = userDb.map((user, index) => {
                    if (user.username === username) {
                        let newTodos = [...user.todos];
                        let newId = this.pickMax(newTodos) + 1;

                        newTodos.push({
                            id: newId,
                            deadline: deadline,
                            title: title,
                            done: false,
                            created_at: new Date().toISOString(),
                        })

                        return {
                            id: user.id,
                            name: user.name,
                            todos: newTodos,
                            username: user.username,
                            done: false
                        }
                    }
                    else return {
                        id: user.id,
                        name: user.name,
                        todos: user.todos,
                        username: user.username,
                    }
                })
                await reWriteFile(path.resolve('./') + '/src/db/userDb.json', newUserDb);

                res.status(202).send(newUserDb);
            } catch (error) {
                console.log(error);
                res.status(400).send('Not found');
            }
        });

        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    username
                } = req.headers;
                let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');
                let ToDo = this.pickTodoByUsername(username, userDb);
                res.status(202).send(ToDo);
            } catch (error) {
                console.log(error);
                res.status(400).send('Not found');
            }
        });

        this._router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    id
                } = req.params;

                const {
                    title,
                    deadline
                } = req.body;

                let {
                    username
                } = req.headers;


                console.log("Check header ")
                console.log(username)
                console.log(username[0])
                let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');
                let newUserDb = [...userDb];

                userDb.forEach((user, index) => {
                    if (username.includes(user.username)) newUserDb[index] = {
                        ...newUserDb[index],
                        todos: this.updateTodoTitleAndDeadLine(newUserDb[index].todos, Number(id), title, deadline)
                    }
                })

                await reWriteFile(path.resolve('./') + '/src/db/userDb.json', newUserDb);

                res.send(username)


            } catch (error) {
                console.log(error);
                console.log('error in put todos')
            }
        })

        this._router.patch('/:id/done', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    id
                } = req.params;

                let {
                    username
                } = req.headers;

                // if (Array.isArray(username)) username = username[0];
                let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');
                let newUserDb = [...userDb];

                userDb.forEach((user, index) => {
                    if (username.includes(user.username)) newUserDb[index] = {
                        ...newUserDb[index],
                        todos: this.updateTodoDoneToTrue(newUserDb[index].todos, Number(id))
                    }
                })

                await reWriteFile(path.resolve('./') + '/src/db/userDb.json', newUserDb);

                res.send(newUserDb)


            } catch (error) {
                console.log(error);
                console.log('error in put todos')
            }
        })

        this._router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const {
                    id
                } = req.params;

                let {
                    username
                } = req.headers;

                // if (Array.isArray(username)) username = username[0];
                let userDb: userDBInterface[] = await readJsonFile(path.resolve('./') + '/src/db/userDb.json');
                let newUserDb = [...userDb];

                userDb.forEach((user, index) => {
                    if (username.includes(user.username)) newUserDb[index] = {
                        ...newUserDb[index],
                        todos: this.removeTodoById(newUserDb[index].todos, Number(id))
                    }
                })

                
                await reWriteFile(path.resolve('./') + '/src/db/userDb.json', newUserDb);
                res.send(newUserDb)


            } catch (error) {
                console.log(error);
                console.log('error in put todos')
            }
        })


    }
}


export = new Todos().router;