import dotenv from 'dotenv'
import { Server } from './server'

// load the environment variables from the .env file
dotenv.config({
  path: '../.env'
});

// initialize server app
const server = new Server();

server.app.use(server.cors);
server.app.use(server.bodyParser);
server.app.use(server.toJson);
server.app.use('/', server.router);

// make server listen on some port
((port = process.env.APP_PORT || 3000) => {
  server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();