const ResponseController = require('./responseController');
const responseController = new ResponseController();

// const MessageController = require('./discord/messageController');
// const messageController = new MessageController('bbb');

const fs = require('fs');
const http = require('http');

let secret = null;
if ('development' === process.env.TARGET_ENV) {
  secret = JSON.parse(fs.readFileSync('./secret.json'));
}

const Twitter = require('twitter');

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY || secret.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY || secret.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN || secret.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || secret.TWITTER_ACCESS_TOKEN_SECRET
});


let responseFlag = false;
let args = null;

// web server
http.createServer((request, response) => {
  for(let responseModule of responseController.modules) {
    if(responseFlag === true) break;
    responseModule(request, response, args);
  };
  if(!responseFlag) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end();
  }
})
.listen(process.env.PORT || secret.PORT);


// discord bot server
const {Client, Collection, Intents, WebhookClient} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const webhookClient = new WebhookClient({
  id: process.env.DISCORD_ANNOUNCES_WEBHOOK_ID || secret.DISCORD_ANNOUNCES_WEBHOOK_ID,
  token: process.env.DISCORD_ANNOUNCES_WEBHOOK_TOKEN || secret.DISCORD_ANNOUNCES_WEBHOOK_TOKEN,
  url: `https://discord.com/api/webhooks/${process.env.DISCORD_ANNOUNCES_WEBHOOK_ID || secret.DISCORD_ANNOUNCES_WEBHOOK_ID}/${process.env.DISCORD_ANNOUNCES_WEBHOOK_TOKEN || secret.DISCORD_ANNOUNCES_WEBHOOK_TOKEN}`
});

client.commands = new Collection();
client.commands.set('server', {
  name: 'server',
  description: 'server info.',
  execute(message, args) {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
});

client.commands.set('adpost', {
  execute(message, args) {
    if((process.env.DISCORD_COMMANDER_CHANNEL_ID || secret.DISCORD_COMMANDER_CHANNEL_ID) !== message.channelId) {
      return;
    }
    twitterClient.post('statuses/update', {status: `see what happens. :${message.content.slice('yt adpost'.length)}`}, function(error, tweet, response) {
      if(error) throw error;
      console.log(tweet);  // The favorites.
      console.log(response);  // Raw response object.
      webhookClient.send(`posted successfully. :${message.content.slice('yt adpost'.length)}`);
    });
  }
});

const prefix = process.env.DISCORD_PREFIX || secret.DISCORD_PREFIX;

client.once('ready', () => {
  console.log('bot is ready!');
});
// TODO FIX message is deprecated; to messageCreate
client.on('message', async (message) => {
  // await messageController(message, client, command, prefix); //こんな感じで全部引っ越せるかな
  console.log(`${message.guildId}, ${message.channelId}`);
  if (message.mentions.has(client.user)) {
    message.reply( `My prefix is "${prefix}" and please add a space after the prefix. If you want to know the functions, type "${prefix} info".`);
    return;
  }
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  const command = message.content.slice(prefix.length).trim().split(/ +/).shift();

  if(!client.commands.has(command)) return;
  try {
    client.commands.get(command).execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply('Error. Sorry for your inconvenience.');
  }
  return;
});

client.login(process.env.DISCORD_BOT_TOKEN || secret.DISCORD_BOT_TOKEN);