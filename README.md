## Fabelier's Ringbell

You want to organize a meeting, but there are no bell on the door, and you don't want to give your phone number to everyone?

Easy:
* Launch this [nodejs](http://nodejs.org/) and [Socket.io](http://socket.io) application, and give the url http://my.host/ to anyone intetested
* Let a tab of a web browser opened on the http://my.host/monitor
* When a visitor arrives, he'll just has to point his smartphone to the url you gave him, and ring. Your browser will warn you someone is at the door.

---
### Try it
1. Run `npm install` once and for all, the retrieve the neede node packages
1. copy `config.js.template` to  `config.js` and edit it to fit your needs
1. Launch `node index.js`
1. Open a browser to http://my.host/
1. To ear when someones rings, open another one to http://my.host/monitor

###How to avoid pranks
To ensure not every one can ring, you just have to:

1. Edit the config file to enable the password feature and to choose your password
1. Provide the password to your visitors

You could e.g. change the password at every meeting, and put it on a note on your door, to ensure only someone who came at the door can actually ring.

###QR Code
To simplify the lives of your visitor you could provide them with a qr code.
Just put a QR code on your door, and point it to

    http://my.host/qr

If you use a password, then url should be

    http://my.host/qr.password=my_password

### For developers
* If you have [Grunt](http://gruntjs.com/), instead of running `node index.js`, you
should run `grunt serve`. It will reload the node server whenever a file is modified.

* To validate your code, you can run `grunt`. It will check the code using jshint.
