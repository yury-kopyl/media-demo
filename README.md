# Media-demo
[![Media-demo screen](https://raw.githubusercontent.com/yury-kopyl/rep-files/master/media-demo/screen1.png)](https://media-demo.herokuapp.com)

[![Media-demo screen](https://raw.githubusercontent.com/yury-kopyl/rep-files/master/media-demo/screen2.png)](https://media-demo.herokuapp.com)
  
[Demo](https://media-demo.herokuapp.com) *(change user password disabled)*

## Demo users:  
email: admin@media.dev  
password: admin

email: user@media.dev  
password: user

## Installation
This is a demo project available through the [git](https://github.com/).  
Before installing, [download and install Git](https://git-scm.com/downloads), [download and install Node.js](https://nodejs.org/en/download/).  
Installation is done using the [`git clone` command](https://git-scm.com/docs/git-clone):  
`$ git clone git@github.com:yury-kopyl/media-demo.git`  
then using the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):  
`$ npm install`

## Quick start
Clone repository:  
`git clone git@github.com:yury-kopyl/media-demo.git && cd media-demo`

Install app:  
`$ npm install`, add `--production` flag for install only production modules

Edit config:  
Edit ***server/.env*** file (example in ***server/.env.sample*** file)

Migrate db:  
`$ npm run server:seed:dev` dev mode / `$ npm run server:seed:prod` prod mode

If needed uninstall dev modules and remove src files and directories (windows only):  
`$ npm run deploy:win`

Start project:  
`$ npm run start`, or can start [pm2](http://pm2.keymetrics.io/) `$ pm2:start`