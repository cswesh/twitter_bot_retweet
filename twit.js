const twit = require('twit');
const T = new twit({
    consumer_key: process.env.Twitter_API_Key,
    consumer_secret: process.env.Twitter_API_Secret,
    access_token:process.env.Twitter_Access_Token,
    access_token_secret:process.env.Twitter_Access_Token_Secret
});

module.exports = T;