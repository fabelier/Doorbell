## Fabelier's Ringbell

You want to organize a meeting, but there are no bell on the door, and you don't want to give your phone number to everyone?

Easy:
* Launch this [nodejs](http://nodejs.org/) and [Socket.io](http://socket.io) application, and give the url http://my.host/ to anyone intetested
* Let a tab of a web browser opened on the http://my.host/monitor
* When a visitor arrives, he'll just has to point his smartphone to the url you gave him, and ring. Your browser will warn you someone is at the door.

---
### TODO
* Feedback for the visitor "someone is on his way to open the door"
* Add a password field to ring.html

### Try it on door.mydomain.tld
1. Run `npm install` once and for all, the retrieve the neede node packages
1. copy `config.js.template` to  `config.js` and edit it to fit your needs
1. Launch `node index.js`
1. Open a browser to http://my.host/
1. To ear when someones rings, open another one to http://my.host/monitor
