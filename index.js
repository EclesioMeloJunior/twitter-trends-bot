const trends = require("./trends");
const bot = require("./bot");

async function start() {
	const status = {};

	await trends(status);
	await bot(status);
}

start();
