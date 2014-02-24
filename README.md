## Fabelier's Ringbell

Here is my first project wih [nodejs](http://nodejs.org/) and [Socket.io](http://socket.io). I tried to comment it heavily, so anyone can learn reading the code.

Socket.io website was a great help. Thanks to the team :)

---
### TODO
* Add a password field to ring.html

### Try it on door.mydomain.tld
1. Run `npm install` once and for all, the retrieve the neede node packages
1. copy `config.js.template` to  `config.js` and edit it to fit your needs
1. Launch `node index.js`
1. Open a browser to http://my.host/
1. To ear when someones rings, open another one to http://my.host/monitor

### For developers
* If you have [Grunt]http://gruntjs.com/), instead of running `node index.js`, you 
should run `grunt serve`. It will reload the node server whenever a file is modified

* To validate your code, you can run `grunt`. It will check the code using jshint
