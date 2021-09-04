const express = require('express');
const app = express();
const port = process.env.PORT || 6969;
const bodyParser = require('body-parser');
const handler = require('./commandHandler');
const scraper = require('./offerScraper');
const database = require('./database');
require('./globals');
if (app.get('env') == 'development') { require('dotenv').config(); } // load environmental variables, local testing

app.use(bodyParser.json());

app.post('/' + process.env.BOT_KEY, async (req, res) => {
    let message = req.body.message;
    if (message.text == '/start') {
        handler.subscribe(message);
    } else if (message.text == '/stop') {
        handler.unsubscribe(message);
    } else if (commands.find(command => command.command == message.text) != undefined) {
        handler.toggleInterest(message);
    } else if (message.text == '/info') {
        handler.sendInfo(message);
    } else if (message.text == '/help') {
        handler.sendHelp(message);
    } else if (message.text == '/alle') {
        handler.addAllInterests(message);
    } else if (message.text == '/keine') {
        handler.removeAllinterests(message);
    }

    res.send(req.body);
});

app.listen(port, () => {
    console.log(`Dolomitenstadt Kleinanzeigen service listening at http://localhost:${port}`);
    async function scheduler() {
        await scraper.scrape();
        database.clearOldOffers();
        handler.checkSendOffer();
    }
    scheduler();
    setInterval(scheduler, 1000 * 60 * refreshTimeMinutes);
})