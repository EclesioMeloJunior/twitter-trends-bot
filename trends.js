const fs = require("fs");
const tinyUrl = require("tinyurl");
const googleTrends = require("google-trends-api");
const imageDownloader = require("image-downloader");

async function trends(status = {}) {
	const trends = await findTrendsFromCountryNow("BR");
	const topOneTrend = trends.storySummaries.trendingStories[5];

	const { title, url } = await selectTitleAndUrlFromTrend(topOneTrend);

	status["source"] = topOneTrend.image.source;
	status["img_url"] = topOneTrend.image.imgUrl;
	status["share_url"] = await tinyUrl.shorten(url);
	status["media_data"] = await encodeImageToBase64(status);
	status["status"] = title;

	async function encodeImageToBase64({ img_url: image, source: filename }) {
		const filePath = `images/${filename}.png`;
		await downloadAndSaveImage(image, filePath);

		return fs.readFileSync(filePath, { encoding: "base64" });

		async function downloadAndSaveImage(image, path) {
			return imageDownloader.image({
				url: `https:${image}`,
				dest: path
			});
		}
	}

	async function findTrendsFromCountryNow(countryCode, category = "all") {
		return await googleTrends
			.realTimeTrends({
				geo: countryCode,
				category: category
			})
			.then(JSON.parse);
	}

	async function selectTitleAndUrlFromTrend(trend) {
		for (const article of trend.articles) {
			if (article.source == trend.image.source) {
				return { title: article.articleTitle, url: article.url };
			}
		}
	}
}

module.exports = trends;
