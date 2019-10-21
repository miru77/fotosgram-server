import express from 'express';
require('./config/config');



export default class Server {

    public app: express.Application;
   

    constructor() {

            this.app = express();
    }
    
    start() {
       // this.app.listen(this.port, callback);
       this.app.listen(process.env.PORT, () => {console.log('server listening')});
    }

}

