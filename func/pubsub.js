const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = function(event, context, callback) {
  const storeID = "2622294";
  const corsProxy = "https://crossorigin.me/";
  const baseUrl = `http://weeklyad.publix.com/Publix/BrowseByListing/BySearch/?StoreID=${storeID}&SearchText=whole+sub`;
  const url = baseUrl; // `${corsProxy}${baseUrl}`;

  nextBlankday = dayOfWeek => {
    const now = new Date();
    const result = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + (7 + dayOfWeek - now.getDay()) % 7
    );
    if (result < now) result.setDate(result.getDate() + 7);
    return result;
  };

  // const handleErrors = response => {
  //   if (!response.ok) throw Error(response.statusText);
  //   return response;
  // };

  // const scrapeData = html => {
  //   const sub = Array.from(
  //     html.documentElement.querySelectorAll("span.desktopBBDTabletTitle")
  //   ).filter(title => title.innerHTML.toLowerCase().includes("sub"))[0];
  //   const name = sub.innerText.trim();
  //   const price = sub.parentNode.nextElementSibling.innerText.trim();
  //   const nextThursday = new Date(`nextBlankday`(4)).getTime();
  //   const pubsub = { name: name, price: price, expires: nextThursday };
  //   return pubsub;
  // };

  const getPubsub = async url => {
    axios.get(url).then(
      response => {
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          const sub = $("span.desktopBBDTabletTitle").filter((i, el) =>
            $(this)
              .text()
              .toLowerCase()
              .includes("sub")
          )[0];
          const name = sub.text().trim();
          const price = sub
            .parent()
            .next()
            .text()
            .trim();
          const nextThursday = new Date(`nextBlankday`(4)).getTime();
          const pubsub = { name: name, price: price, expires: nextThursday };
          return pubsub;
        }
      },
      error => console.log(err)
    );
  };

  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: getPubsub(url)
  });
};
