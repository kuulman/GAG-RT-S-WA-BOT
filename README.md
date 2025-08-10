# GAG-RT-S WA BOT Version 1.5
Whatsapp Bot for Real Time Grow a Garden Stock!

# Requirement:
- [Discord bot token](https://discord.com/developers/applications)
- Discord Server with Vulcan Webhook
- [Chrome](https://www.google.com/intl/id_id/chrome/)
- [Node.js](nodejs.org)
- [whatsapp-web.js](https://www.npmjs.com/package/whatsapp-web.js)
- [puppeteer-core](https://www.npmjs.com/package/puppeteer-core)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- [dotenv (for token file)](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [axios](https://www.npmjs.com/package/axios)
- [pm2 (optional)](https://www.npmjs.com/package/pm2)

# Clone this repo
```
git clone https://github.com/kuulman/GAG-RT-S-WA-BOT
cd GAG-RT-S-WA-BOT
```
# Install Dependency
npm install
```
# Install all packages
```
npm i whatsapp-web.js puppeteer-core qrcode-terminal dotenv express axios
```
# Create .env file and fill with your token (Check youtube for the tutorial)
```
DISCORD_TOKEN=(Fill with your discord bot token)
DISCORD_CHANNEL_ID_STOCKS=(Fill with your discord channel where you webhooked with Vulcan
WA_GROUP_ID=(Fill with your WA Groups ID)
WA_CHANNELS_JID=(Fill with your WA Channel ID)
```
# Make Discord bot & discord server and setting the vulcan webhook (Check youtube for tutorial)
Setting the notification with 
```
/stockalert-gag (What notification do you want here)
```
Setting the role (You need to make it first and copy the ID, check youtube for the tutorial) and paste the id here
```
    const StockRole = [ // Role ID (Change it with your role id)
        '1401502243127164978',
        '1401502371804348556',
        '1401502463307022357',
        '1401537842768908360',
        '1401853182778277899'
    ];
```

Then, change this to your group/channel ID:
```
if (message.from == '120363419338640318@newsletter') { // Check if the message is from a selected group (CHANGE IT WITH YOUR ROLE ID)
     console.log(message.from + ' has sent you message: ', messageBody); // Write that message to console
    }
```

# Run the bot
- Node.js:
```
node index.js
```
- pm2
```
pm 2 start index.js
pm2 monit
```
Then, scan the QR Code with your whatsapp!

# Authors of the bot
- [`kuulman`](https://github.com/kuulman)

