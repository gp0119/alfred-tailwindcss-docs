"use strict";
import alfy from "alfy";

const version = process.argv[process.argv.length - 1] || "v3";

const config = {
	url: "https://knpxzi5b0m-dsn.algolia.net/1/indexes/*/queries",
	appId: "KNPXZI5B0M",
	apiKey: "5fc87cef58bb80203d2207578309fab6",
};

const query = `query=${alfy.input}&facetFilters=version:${version}&hitsPerPage=10`;

alfy
	.fetch(config.url, {
		method: "POST",
		headers: {
			"x-algolia-application-id": config.appId,
			"x-algolia-api-key": config.apiKey,
		},
		body: JSON.stringify({
			requests: [
				{
					indexName: "tailwindcss",
					params: query,
				},
			],
		}),
	})
	.then((data) => {
		const { hits } = data.results[0];
		const items = hits.map((item) => {
			const { hierarchy } = item;
			const result = {
				title: item.anchor,
				subtitle: item.anchor,
				arg: item.url,
				quicklookurl: item.url,
			};

			if (hierarchy) {
				const filterHierarchy = Object.keys(hierarchy)
					.filter((objKey) => Boolean(hierarchy[objKey]))
					.sort();

				result.title = hierarchy[filterHierarchy[filterHierarchy.length - 1]];
				result.subtitle = filterHierarchy
					.map((level) => hierarchy[level])
					.join(" > ");
			}

			return result;
		});

		alfy.output(items);
	});
