const {Client, Intents, MessageAttachment } = require('discord.js');
const intents = new Intents()
intents.add(Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES);
const client = new Client({ intents: intents})
const RedditImageFetcher = require("reddit-image-fetcher");

require('dotenv').config()

 const Token = process.env.TOKEN



client.on('ready', () => {

 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
 if (msg.content === 'ping') {
 msg.reply('pong');
 }

 if(msg.content.includes('hola') || msg.content.includes('hi')){
     msg.reply(`welcome ${msg.author.username}`)
     
 }

 if(msg.content === '-meme'){
    RedditImageFetcher.fetch({
        type: 'meme'
    }).then(result => {
    
        const file = new MessageAttachment(result[0]?.image);
    
        msg.reply({ files: [file] });
    });
 }

 

 if(msg.content.includes('-custom')){
     let sub = msg.content.split('-custom ')[1]
     console.log(sub)
     RedditImageFetcher.fetch({
        type: 'custom',
        subreddit: [`${sub}`]
    }).then(result => {
    
        const file = new MessageAttachment(result[0]?.image);
        msg.reply({ files: [file] });
    }).catch(err=>{
        console.log(err)
        msg.reply('invalid subreddit name ') 
    })
 }

 if(msg.content === 'start memes'){
     setInterval(()=>{
        RedditImageFetcher.fetch({
            type: 'meme', 
            total:50
        }).then(result => {

            const a = result.sort((a,b)=>b.upvotes-a.upvotes)
        
            const file = new MessageAttachment(a[0]?.image);
        
            msg.reply({ files: [file] });
        });
     },600000)
 }

 if(msg.content === 'stop memes'){
     clearInterval()
 }
 });

client.on('interactionCreate', async interaction =>{

    const { commandName } = interaction

    console.log(commandName)

})







client.login(Token);