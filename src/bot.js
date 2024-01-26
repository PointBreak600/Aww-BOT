require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const client = new Client({
    intents: [
	IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

let fetch;
const awwChannelId = ''; // The Discord channel ID where posts will be sent
const fetchInterval = 60000; // Fetch interval in milliseconds (60000 ms = 1 minute)

client.on('ready', async (c) => {
    console.log(`${c.user.tag} is online`);
    
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }

    setInterval(async () => {
        const url = 'https://www.reddit.com/r/aww/new.json?limit=10';
        try {
            const response = await fetch(url);
            const json = await response.json();
            const post = json.data.children[Math.floor(Math.random() * json.data.children.length)].data;
            const channel = await client.channels.fetch(awwChannelId);
            if (channel) {
                channel.send({ content: post.title, files: [post.url] });
            } else {
                console.log('Channel not found');
            }
	} catch (error) {
            console.error(error);
        }
    }, fetchInterval);
});

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;

    if (msg.content.toLowerCase() === 'ping') {
        msg.reply('pong');
    } else if (msg.content.toLowerCase() === '!aww') {
        if (!fetch) {
            fetch = (await import('node-fetch')).default;
        }
	const url = 'https://www.reddit.com/r/aww/new.json?limit=10';
        try {
            const response = await fetch(url);
            const json = await response.json();
            const post = json.data.children[Math.floor(Math.random() * json.data.children.length)].data;
            msg.channel.send({ content: post.title, files: [post.url] });
        } catch (error) {
            console.error(error);
            msg.reply('Failed to fetch post from r/aww.');
        }
    }
});

client.login(process.env.BOT_TOKEN);
