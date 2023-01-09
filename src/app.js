import express from "express";
import cors from "cors";

const site = express();
site.use(cors());
site.use(express.json());

const users = [];

const tweets = [];

function addAvatar(tweets) {
  for (let i = 0; i < tweets.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (tweets[i].username === users[j].username) {
        tweets[i].avatar = users[j].avatar;
      }
    }
  }
}

site.post("/sign-up", (req, res) => {
  const user = req.body;
  if (!user.username || !user.avatar || typeof(user.username)!== "string" || typeof(user.avatar)!== "string"  )
    return res.status(400).send("Os campos são obrigatórios!");
  users.push(user);
  res.status(201).send("ok");
});
  
site.post("/tweets", (req, res) => {
  const tweeted = req.body;
  if (!tweeted.tweet || typeof(tweeted.tweet)!== "string" ){
    return res.status(400).send("Os campos são obrigatórios!");
  }
  const user = req.headers.user
  const checkUser = users.find((item) => item.username === user);
  if (!checkUser) return res.status(401).send("UNAUTHORIZED");

  tweeted.username = user
  tweets.push(tweeted);
  res.status(201).send("OK");
});

site.get("/tweets", (req, res) => {
  const { page } = req.query;
  const pageNumber = Number(page);
  if (page) {
    if (pageNumber < 1)
      return res.status(400).send("Informe uma página válida!");

    const currentPage = tweets.slice(
      pageNumber * -10,
      tweets.length - (pageNumber - 1) * 10
    );
    addAvatar(currentPage);

    res.status(200).send(currentPage.reverse());
  } else {
    const last10Tweets = tweets.slice(-10, tweets.length);
    addAvatar(last10Tweets);
    res.send(last10Tweets.reverse());
  }
});

site.get("/tweets/:USERNAME", (req, res) => {
  const name = req.params.USERNAME;
  console.log(name);
  const userTweets = tweets.filter((item) => item.username === name);
  addAvatar(userTweets);
  res.send(userTweets);
});

site.listen(5000);