import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({path: path.join(__dirname, '../../.env')});

const db = require('../db');
const app = require('../app').App.bootstrap(db.Db.bootstrap());

require('../server').HttpServer.create(app);
