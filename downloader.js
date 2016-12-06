const Snoowrap = require('snoowrap');
const config = require('./config.json');
const request = require('request');
const fs = require('fs-extra');
const async = require('async');
const imageDir = 'downloadedImages';
const path = require('path');


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
    reddit.getSubreddit('Awwnime').getHot().map(post => post.url)
        .then(m => {
            for (var i = 0; m.length > i; i++) {
                queue.push({ url: m[i], title: i + 1 });
            }
        });
}


const queue = async.queue((m, callback) => {
    console.log(`Downloading ${m.title} with ${m.url}`);
    let image = request(m.url).pipe(fs.createWriteStream(`./downloadedImages/${m.title}.png`));
    image.on('finish', () => {
        console.log(`Finished Downloading ${m.title}`);
        callback();
        document.getElementById('imageDownloadInfo').innerHTML = `Downloading Image ${m.title} from 25`;
        document.getElementById('loadingCircle').style.display = 'block';
        if (m.title === 25) {
            document.getElementById('imageDownloadInfo').innerHTML = 'Finished Downloading!';
            document.getElementById('loadingCircle').style.display = 'none';
        }
    });
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