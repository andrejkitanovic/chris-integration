import requireDir from 'require-dir';
import { Express } from 'express';

const dir = requireDir(__dirname);

export default function (app: Express) {
	Object.keys(dir).forEach((camelCaseName) => {
		const name = camelCaseName
			.split(/(?=[A-Z])/)
			.join('-')
			.toLowerCase();

		if (name !== 'views') {
			app.use(`/api/${name}`, dir[camelCaseName].default);
		} else {
			app.use('', dir[camelCaseName].default);
		}
	});
}
