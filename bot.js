const Twit = require("twit");
const twitterCredentials = require("./.credentials/twitter-credentials.json");

const twitter = new Twit({
	consumer_key: twitterCredentials.apiKey,
	consumer_secret: twitterCredentials.apiSecretKey,
	access_token: twitterCredentials.accessToken,
	access_token_secret: twitterCredentials.accessTokenSecret,
	timeout_ms: 60 * 1000,
	strictSSL: true
});

async function bot(status) {
	//status["media_ids"] = await uploadImageToTwitter(status);
	status["post"] = buildTweet(status);

	await writeTweet(status["post"]);

	function buildTweet(status) {
		return {
			status: `${status["status"]}\n${status["share_url"]}`,
			media_ids: status["media_ids"]
		};
	}

	async function uploadImageToTwitter(status) {
		const { data } = await twitter.post("media/upload", {
			media_data: status["media_data"]
		});
		return [data.media_id_string];
	}

	async function writeTweet(tweetParams) {
		await twitter.post("statuses/update", tweetParams);
	}
}

module.exports = bot;
