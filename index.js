require('dotenv').config();
const twit = require('./twit');
const fs = require('fs');
const path= require('path');
const paramPath = path.join(__dirname,'params.json');

function writeParams(data){
    console.log('writing the params file...',data);
    return fs.writeFileSync(paramPath,JSON.stringify(data));
}

function readParams(){
    console.log('reading the params file...');
    const data = fs.readFileSync(paramPath);
    return JSON.parse(data.toString());
}

function getTweets(since_id){
    return new Promise((resolve,reject) => {
        let params = {
            q: "#HBDThalaAjith",
            count:10,
        };
        if(since_id){
            params.since_id = since_id;
        }
        console.log("We are getting the tweets...", params);
        twit.get('search/tweets',params, (err,data) =>{
            if(err){
            return reject(err);
            }
            return resolve(data);
        })
    });
}

function postRetweet(id){
    return new Promise((resolve,reject) => {
        let params = {
            id,
        };
        twit.post('statuses/retweet/:id',params,(err,data) => {
            if(err){
                return reject(err);
                }
                return resolve(data);
        })
    })
}


async function main(){
    try {
        const params = readParams();
        const data = await getTweets(params.since_id);
        const tweets = data.statuses;
        console.log('We got tweets ',tweets.length);
        for await (let tweet of tweets){
            try {
                await postRetweet(tweet.id_str);
                console.log('successful retweet' + tweet.id_str);                
            } catch (e) {
                console.error('unsuccessfull retweet'+ tweet.id_str + " error: " + e);
            }
            params.since_id = tweet.id_str;
        }
        writeParams(params);
    } catch (e) {
        console.error(e);
    }
}

console.log(`starting the twitter bot...`);

setInterval(main, 10000);