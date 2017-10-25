## WON'T BE UPDATED ANYMORE (probably)

## Alpha Release
This is a VERY eary release of the program. It's currently hardcoded to one subreddit, it isn't able to diffrentiate between pictures and text posts, downloads everything as .png and so on.
If you get any Bugs please report them. I plan on adding alot more features, like selecting the pictures you'd like to download and much more. Feel free to contribute to the project.

## Installation
*Download and Install Nodejs (https://nodejs.org/)

*Download or clone this repo

*In the folder where you cloned/unzipped it open a command prompt and type:

```
npm install -g electron (if you haven't installed electron already)
npm install
npm install -g bower
bower install
```
Create a new application on https://www.reddit.com/prefs/apps/ and set the type to "script".
now you have to create a file called `config.json` wich contains the following:
```
{
    "userAgent": "The name you gave your application",
    "clientId": "the client id in the top left corner",
    "clientSecret": "the client secrect",
    "username": "your reddit username",
    "password": "your reddit password"
}
```

and finally to launch it type 
`electron.` 
in the project directory
