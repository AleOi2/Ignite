export interface userDBInterface {
  id: number,
  name: string,
  username: string,
  todos: todosInterface[]
}

export interface todosInterface {
  id: number,
  title: string,
  done?: boolean,
  deadline: string,
  created_at: string, 
}