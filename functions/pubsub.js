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

  const handleErrors = response => {
    if (!response.ok) throw Error(response.statusText);
    return response;
  };

  const scrapeData = html => {
    const sub = Array.from(
      html.documentElement.querySelectorAll("span.desktopBBDTabletTitle")
    ).filter(title => title.innerHTML.toLowerCase().includes("sub"))[0];
    const name = sub.innerText.trim();
    const price = sub.parentNode.nextElementSibling.innerText.trim();
    const nextThursday = new Date(`nextBlankday`(4)).getTime();
    const pubsub = { name: name, price: price, expires: nextThursday };
    return pubsub;
  };

  const getPubsub = async url => {
    try {
      const response = handleErrors(await fetch(url));
      const text = await response.text();
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(text, "text/html");
      return scrapeData(htmlDocument);
    } catch (err) {
      console.error("Oh nooooo!");
      console.error(err);
    }
  };

  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: getPubsub(url)
  });
};
