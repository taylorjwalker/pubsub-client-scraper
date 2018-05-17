const displayResults = pubsub => {
  if (pubsub.name) {
    if (pubsub.price) {
      document.getElementById("name").textContent = pubsub.name;
      document.getElementById("price").textContent = "$" + pubsub.price;
    } else {
      document.getElementById("error").textContent =
        "Bummer! There's no sub on sale, but here's a coupon ¯\\_(ツ)_/¯";
      document.getElementById("name").textContent = pubsub.name;
    }
  } else {
    document.getElementById("error").textContent =
      "Hmm... can't seem to find anything. Sorry about that!";
  }
};

const getPubsub = async () => {
  try {
    const response = await fetch("/.netlify/functions/pubsub");
    const resObj = await response.json();
    console.log(resObj);
    return resObj.body;
  } catch (err) {
    console.log("Error!");
  }
};

if (
  localStorage.getItem("pubsub") &&
  JSON.parse(localStorage.getItem("pubsub")).expires >= Date.now()
) {
  const pubsub = JSON.parse(localStorage.getItem("pubsub"));
  displayResults(pubsub);
} else {
  getPubsub().then(pubsub => {
    console.log(pubsub);
    displayResults(pubsub);
    localStorage.setItem("pubsub", JSON.stringify(pubsub));
  });
}
