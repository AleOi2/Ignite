
/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
const express = require('express');
const MasterRouter = require('./routes/router')
const cors = require('cors')
const bodyParser = require('body-parser')

// const options = {
//     origin: "*" 
// };

export class Server {
    public app = express();
    public router = MasterRouter;
    public cors = cors();
    public bodyParser = bodyParser.urlencoded({ extended: false });
    public toJson = bodyParser.json();
}
