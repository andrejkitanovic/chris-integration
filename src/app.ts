import dotenv from 'dotenv';
import moduleAlias from 'module-alias';

dotenv.config();
moduleAlias.addAliases({
	helpers: __dirname + '/helpers',
	routes: __dirname + '/routes',
	models: __dirname + '/models',
	controllers: __dirname + '/controllers',
	middlewares: __dirname + '/middlewares',
	validators: __dirname + '/validators',
	utils: __dirname + '/utils',
});

import express from 'express';
import cors from 'cors';

import headersMiddleware from 'middlewares/headers';
import errorMiddleware from 'middlewares/error';
import connection from 'helpers/connection';
import path from 'path';

import routing from 'routes';

const app = express();
app.set('views', [path.join(__dirname, '/views')]);
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// storage(app);
app.use(headersMiddleware);
app.use('/logs/requests', express.static('logs/request.log'));
app.use('/logs/errors', express.static('logs/error.log'));
routing(app);
app.use(errorMiddleware);

connection(app);

import {trelloCreateComment} from 'utils/trello'

(async function(){
	try{

		await trelloCreateComment("631a136dfff08601a469c9b9", "[https://drive.google.com/file/d/1jBmc4Nim95fxwqYda1DR_AjaABLJxjSV/view?usp=drive_web] Energiberäkning - Daniel Zazi - 19,75 kWp (Huawei).pdf")
	}catch(err){
		console.log(err)
	}
}())
