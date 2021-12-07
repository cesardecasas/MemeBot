const {Client, Intents } = require('discord.js');
const intents = new Intents()
intents.add(Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: intents})
require('dotenv').config()

 const Token = process.env.TOKEN

 console.log(client)

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
 if (msg.content === 'ping') {
 msg.reply('pong');
 }
 });

client.login(Token);