const Discord = require('discord.js');
const client = new Discord.Client();

const firebase = require('firebase');

firebase.initializeApp({
  databaseURL: 'https://norrland-rp-centre.firebaseio.com/'
});

var database = firebase.database();
var eventsRef = database.ref('events');

let targetChannel;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
  client.guilds.forEach(function (value) {
    targetChannel = value.channels.get(process.env.DISCORD_CLIENT_ID);
  });
});

var initalSetup = false;

eventsRef.on('child_added', function (snapshot) {
  if (!initalSetup) return;
  let value = snapshot.val();
  targetChannel.send(`${value.createdBy} just created a new event called ${value.title}! Go check it out https://rpcentre.bancey.xyz/#/events`);
  console.log(value);
});

// These are event listeners that would allow use to notify of comments and event deletions.
/* eventsRef.on('child_removed', function (snapshot) {
  if (!initalSetup) return;
  let value = snapshot.val();
  targetChannel.send('Something removed!');
  console.log(value);
});
eventsRef.on('child_changed', function (snapshot) {
  if (!initalSetup) return;
  let value = snapshot.val();
  targetChannel.send('Something updated!');
  console.log(value);
}); */

eventsRef.once('value', function () {
  initalSetup = true;
});

client.login(process.env.DISCORD_TOKEN);
