require('dotenv').config();
const express =  require('express')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const { Client: discordClient, GatewayIntentBits } = require('discord.js')
const { LocalAuth, Client } = require('whatsapp-web.js')

const app = express()
const PORT = process.env.PORT || 3000;

// Whatsapp Setup
const waClient = new Client({ //WA Client
    authStrategy: new LocalAuth({clientId: 'GAG-STOCK'})
})

waClient.on('qr', (qr) => qrcode.generate(qr, { small: true }));
waClient.on('authenticated', () => console.log('Client is authenticated'));
waClient.on('ready', () => console.log('Client is ready!'));
waClient.on('message', async message =>{ // Function for checking messages
    const messageBody = message.body.trim().toLowerCase(); // Make it to lowercase
    if (message.from == '120363402935518269@g.us') { // Check if the message is from a user
     console.log(message.from + ' has sent you message: ', messageBody); // Write that message to console
    } 
    if (message.body.toLowerCase() == "bot_authors") { // Bot authors
        await message.reply(`*Credits of Info GAG's Bot* \n\nScripter: @kucingpintar \nMessage Builder: @owlhouse22 \n\n© Copyright Info GAG. All rights reserved. \nThis bot retrives data from vulcanvalues.com`) 
        console.log("Berhasil mengirimkan jawaban untuk command bot_authors")
    }
})
waClient.initialize()

app.listen(PORT, () => console.log(`Server is running on port ${PORT}\n Please wait. This gonna take less/more than 1 minute`));

// Discord Setup
const dcClient = new discordClient({
    intents: [
     GatewayIntentBits.Guilds,
     GatewayIntentBits.GuildMessages,
     GatewayIntentBits.MessageContent,   
    ]
})

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID_STOCKS;
const WA_GROUP_ID = process.env.WA_GROUP_ID;

dcClient.on('ready', () => {
    console.log(`Discord bot is ready`);
});

dcClient.on('messageCreate', async (message) => {
    
    const StockRole = [
        '1401502243127164978',
        '1401502371804348556',
        '1401502463307022357',
        '1401537842768908360',
        '1401853182778277899'
    ];

    const isMentioned = StockRole.some(roleId => message.mentions.roles.has(roleId));
    if (!isMentioned) return;

    let contentTosend = '';


    const mentionedNames = message.mentions.roles
        .filter(role => StockRole.includes(role.id))
        .map(role => role.name)
        .join(', ');

    if (message.content) {
        contentTosend += `${message.content}\n`;
        
    }

    message.embeds.forEach((embed, index) => {
        const cleanText = (text) => { // Clear Text
            function getRelativeTime(unixTimestamp) { // Relative Time Function
             const targetTime = new Date(parseInt(unixTimestamp) * 1000);
             const now = new Date();
             const diff = targetTime - now;

             if (diff <= 0) return 'just now'; // Sudah lewat

             const seconds = Math.floor(diff / 1000);
             const minutes = Math.floor(seconds / 60);
             const hours = Math.floor(minutes / 60);
             const days = Math.floor(hours / 24);

             if (days > 0) return `in ${days} day(s)`;
             if (hours > 0) return `in ${hours} hour(s)`;
             if (minutes > 0) return `in ${minutes} minute(s)`;
             return `in ${seconds} second(s)`;
        }
            
            if (!text) return '';

                return text
                // Hapus emoji Discord <:emoji:123456789> → ganti dengan "-"
                .replace(/<a?:\w+:\d+>/g, '-')
                // Ubah Discord bold **SUNDRIED** jadi *SUNDRIED* (WA style)
                .replace(/\*\*([^\*]+)\*\*/g, '*$1*')
                .replace(/<t:(\d+):[Rr]>/g, (_, ts) => getRelativeTime(ts))
            };
        function getCurrentTimestamp() { // Function for Timestamp
            const now = new Date();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const day = now.getDate();
            const month = monthNames[now.getMonth()];
            const year = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
        }


        
        if (embed.fields?.length) {
         embed.fields.forEach(field => {
            // Format setiap field dengan nama dan value
            contentTosend += `\n🔹 ${cleanText(field.name)}:\n${cleanText(field.value)}`;
        });
    }

    if (embed.description) {
      contentTosend += `${cleanText(embed.description)}`;
    }
    contentTosend += `\n`; // Spasi antar embed
    contentTosend += `\n> Timestamp: ${getCurrentTimestamp()}\n`;
    contentTosend += `© Copyright Info GAG \n`;
  });

  const cleanedMessage = contentTosend.replace(/<@&\d+>/g, '').trim(); // Pembersih mentions

  // Kirim pesan ke WA
  waClient.sendMessage(process.env.WA_GROUP_ID, cleanedMessage);
  console.log('*Berhasil Mengirim Pesan:*\n', cleanedMessage);
});

dcClient.login(DISCORD_TOKEN);

