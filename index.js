require('dotenv').config();
const express =  require('express')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const { Client: discordClient, GatewayIntentBits } = require('discord.js')
const { LocalAuth, Client } = require('whatsapp-web.js')
const os = require('os');

const app = express()
const PORT = process.env.PORT || 3000;

// Check server usage
// Ram Usage
const UsedMemory = os.totalmem() - os.freemem(); // Get used memory 
const UsedMemoryGB = (UsedMemory / (1024 * 1024 * 1024)).toFixed(2); // Convert to GB
const memoryPercentage = ((UsedMemory / os.totalmem()) * 100).toFixed(2); // Calculate memory usage percentage
// CPU Usage
function getCPUUsageAsync() {
    return new Promise(resolve => {
        const startMeasure = process.cpuUsage();
        const startTime = Date.now();

        setTimeout(() => {
            const endMeasure = process.cpuUsage(startMeasure);
            const endTime = Date.now();
            
            const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds
            const totalCPUTime = (endMeasure.user + endMeasure.system) / 1000000; // Convert to seconds
            
            // Calculate percentage (single core)
            let cpuPercentage = (totalCPUTime / elapsedTime) * 100;
            
            // Ensure the percentage doesn't exceed 100%
            cpuPercentage = Math.min(cpuPercentage, 100);
            
            resolve(cpuPercentage.toFixed(2));
        }, 1000);
    });
}


// Whatsapp Setup
const waClient = new Client({  //WA Client
    authStrategy: new LocalAuth({clientId: 'GAG-STOCK'})
})

waClient.on('qr', (qr) => qrcode.generate(qr, { small: true })); // Generate QR Code
waClient.on('authenticated', () => console.log('Client is authenticated')); // If QR Code scanned
waClient.on('ready', () => console.log('Client is ready!')); // If this bot succesfully login to number
waClient.on('message', async message =>{ // Function for checking messages
    const messageBody = message.body.trim().toLowerCase(); // Make it to lowercase
    if (message.from == '120363419338640318@newsletter') { // Check if the message is from a selected group
     console.log(message.from + ' has sent you message: ', messageBody); // Write that message to console
    } 
    if (message.body.toLowerCase() == "bot_info") { // Bot authors commands
        const thumbnail = MessageMedia.fromFilePath('./thumbnail.png')
        await message.reply(thumbnail, { 
            caption:'*Info GAG RT-S Bot Info*\n_Version 1.5 (Vulcano)_\n\n_Changes:_\n- New Command for Admin\n- Changes `bot_authors` to `bot_info` command and update the response\n- From now, bot will be send the rare stock to the Whatsapp Channels not to group again. Group will be shutdown after this bot updates.\n\nCreated by: _@kucingpintar & @owlhouse22_\n\n© Copyright Info GAG. All rights reserved. \nThis bot retrives data from vulcanvalues.com'
        }) 
        console.log("Berhasil mengirimkan jawaban untuk command bot_authors") // Credits Information
    }
    if (message.body.toLowerCase() == "server_usage") { // Server usage command
        (async () => {
            const cpuUsage = await getCPUUsageAsync(); // Call CPU Usage Function
            const ramUsage = `*RAM Usage:* ${UsedMemoryGB} GB / ${memoryPercentage}%`; // Call RAM Usage Function
            console.log(`📊 Server CPU and RAM Usage \n\n${ramUsage} (All memory usage in server. Include from OS) \n*CPU Usage:* ${cpuUsage}% (This bot CPU usage)`) // Server Usage Information
            await message.reply(`📊 Server CPU and RAM Usage \n\n${ramUsage} (All memory usage in server. Include from OS) \n*CPU Usage:* ${cpuUsage}% (This bot CPU usage)`); // Send the server usage to WA Group
        })()
    }

})
waClient.initialize() // Execution code for WA Client

app.listen(PORT, () => console.log(`Vulcano 1.5 || Server is running on port ${PORT} \nPlease wait. This gonna take less/more than 1 minute`)); // Sent this to console if succesfully connected to node.js

// Discord Setup
const dcClient = new discordClient({ // DC Client Config
    intents: [
     GatewayIntentBits.Guilds,
     GatewayIntentBits.GuildMessages,
     GatewayIntentBits.MessageContent,   
    ]
})

const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // Check .env or make new if you are clone this repo
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID_STOCKS;
const WA_GROUP_ID = process.env.WA_GROUP_ID;
const WA_CHANNELS_JID = process.env.WA_CHANNELS_JID;

dcClient.on('ready', () => {
    console.log(`Discord bot is ready`); // Write that to console if the DC Client is ready
});

dcClient.on('messageCreate', async (message) => { // Message Event for the stock
    
    const StockRole = [ // Role ID (Change it)
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

             if (diff <= 0) return 'just now'; 

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
                // Delete Discord Emoji <:emoji:123456789> (to) → "-"
                .replace(/<a?:\w+:\d+>/g, '-')
                // Change Discord Bold (example) **SUNDRIED** to WA Bold (example) *SUNDRIED*
                .replace(/\*\*([^\*]+)\*\*/g, '*$1*')
                .replace(/<t:(\d+):[Rr]>/g, (_, ts) => getRelativeTime(ts))
            };
        function getCurrentTimestamp() { // Function for Current Timestamp
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
            // Format for embed field (Name and value)
            contentTosend += `\n🔹 ${cleanText(field.name)}:\n${cleanText(field.value)}`;
        });
    }

    if (embed.description) {
      contentTosend += `${cleanText(embed.description)}`;
    }
    contentTosend += `\n`; // give space to every embed
    contentTosend += `\n> Timestamp: ${getCurrentTimestamp()}\n`;
    contentTosend += `© Copyright Info GAG \n`;
  });

  const cleanedMessage = contentTosend.replace(/<@&\d+>/g, '').trim(); // Clean the mentions

  // Kirim pesan ke WA
  waClient.sendMessage(process.env.WA_CHANNELS_JID, cleanedMessage);
  console.log('*Berhasil Mengirim Pesan:*\n', cleanedMessage);
});

dcClient.login(DISCORD_TOKEN);

// Additional Information
// If you want change number or log out from whatsapp, you can delete the folder in `./wwebjs_auth` & `./wwebjs_cache` and run the bot again. 
// It will ask you to scan the QR Code again.
// If there is error `Cannot read properties of undefined (reading 'getChat')`, just restart the bot. 
// Because this error is caused by the WA Client not ready yet when there is rare stock.

