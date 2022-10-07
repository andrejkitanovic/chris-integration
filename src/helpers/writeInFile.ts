import fs from 'fs';
import dayjs from 'dayjs';
import { Request } from 'express';

export const writeInFile = async ({ path, context, req }: { path: string; context?: any; req: Request }) => {
	try {
		const { method, baseUrl, path: reqPath } = req;

		if (!context) return;
		let parsedContext = '****************\n';
		parsedContext += `[${method}] ${baseUrl} ${reqPath}\n`;
		parsedContext += `[${dayjs().format('HH:mm:ss DD/MM/YYYY')}]\n`;
		parsedContext += JSON.stringify(context) + '\n';
		parsedContext += '****************\n';

		fs.appendFile(path, parsedContext, (err) => {
			if (err) {
				console.error(err);
				return;
			}
		});
	} catch (err) {
		console.log(err);
	}
};
