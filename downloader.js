const Snoowrap = require('snoowrap');
const config = require('./config.json');
const request = require('request');
const fs = require('fs-extra');
const async = require('async');
const imageDir = 'downloadedImages';
const path = require('path');
var subreddit;
var blockDownload = true;
var validSubreddit = false;

function onReady() {
    fs.ensureDir(imageDir, (err) => {
        if (err) return console.log(err);
    });
}

function start() {
    const reddit = new Snoowrap({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password
    });
    if (!subreddit) {
        blockDownload = true;
        document.getElementById('warnText').style.display = 'block';
        document.getElementById('warnText').innerHTML = `You have to specify a subreddit`;
        return;
    }
    if (validSubreddit !== true) return;
    blockDownload = false;
    document.getElementById('imageDownloadInfo').innerHTML = `Fetching Subreddit information...`;
    document.getElementById('loadingCircle').style.display = 'block';
    reddit.getSubreddit(subreddit).getHot().map(post => post.url)
        .then(m => {
            for (var i = 0; m.length > i; i++) {
                queue.push({ url: m[i], title: i, arrLength: m.length });
            }
        });
}

function checkURL(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}


let s = 0;
let f = 0;

const queue = async.queue((m, callback) => {
    let imageCheck = checkURL(m.url);
    let fileExtension = m.url.split('.').pop().split(/\#|\?/)[0];
    if (imageCheck === true && blockDownload === false) {
        document.getElementById('imageDownloadInfo').innerHTML = `Downloading Images...`;
        console.log(`Downloading ${m.title} with ${m.url}`);
        let image = request(m.url).pipe(fs.createWriteStream(`./downloadedImages/${m.title}.${fileExtension}`));
        image.on('finish', () => {
            console.log(`Finished Downloading ${m.title}`);
            callback();
            s++;
            if (m.title + 1 === m.arrLength) {
                document.getElementById('imageDownloadInfo').innerHTML = `Finished Downloading! ${s} images downloaded`;
                document.getElementById('loadingCircle').style.display = 'none';
            }
        });
    } else {
        console.log(`${m.url} is not a valid file url`);
        f++;
        if (m.title + 1 === m.arrLength) {
            document.getElementById('imageDownloadInfo').innerHTML = `Finished Downloading! ${s} images downloaded`;
            document.getElementById('loadingCircle').style.display = 'none';
        }
        callback();
    }

});

function removeImages() {
    fs.readdir(imageDir, (err, res) => {
        if (err) console.log(err);
        res.forEach(function(element) {
            fs.unlink(path.join(`${__dirname}/${imageDir}/${element}`), (err) => {
                if (err) return console.log(err);
            });
        }, this);
    });
}

function setSubreddit() {
    document.getElementById('warnText').style.display = 'none';
    const reddit = new Snoowrap({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password
    });
    subreddit = document.getElementById('inputSubreddit').value;
    reddit.getSubreddit(subreddit).getHot().map(post => post.title)
        .then(m => {
            if (m.length === 0) {
                blockDownload = true;
                validSubreddit = false;
                document.getElementById('warnText').style.display = 'block';
                document.getElementById('warnText').innerHTML = `Couldn't find the Subreddit ${subreddit}`;
                return;
            }
            validSubreddit = true;
        })
        .catch(console.error);
}