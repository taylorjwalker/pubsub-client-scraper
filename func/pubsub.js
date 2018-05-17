const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = function(event, context, callback) {
  const respond = ({ status, body }) => {
    callback(null, {
      statusCode: status,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ body })
    });
  };

  const storeID = "2622294";
  const url = `http://weeklyad.publix.com/Publix/BrowseByListing/BySearch/?StoreID=${storeID}&SearchText=whole+sub`;

  const nextBlankday = dayOfWeek => {
    const now = new Date();
    const result = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 + dayOfWeek - now.getDay()) % 7
    );
    if (result < now) result.setDate(result.getDate() + 7);
    return result;
  };

  axios
    .get(url)
    .then(response => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        const sub = $("span.desktopBBDTabletTitle:contains('Whole Sub')");
        const name = sub.text().trim();
        const price = sub
          .parent()
          .next()
          .text()
          .trim();
        const nextThursday = new Date(nextBlankday(4)).getTime();
        const pubsub = { name: name, price: price, expires: nextThursday };
        return pubsub;
      }
    })
    .then(pubsub => {
      respond({ status: 200, body: pubsub });
    })
    .catch(err => {
      respond({ status: 422, body: "Couldn't get the data" });
    });
};
