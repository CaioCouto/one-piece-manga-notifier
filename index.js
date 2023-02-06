require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const FileManager = require('./Classes/FileManager');
const Nodemailer = require('./Classes/Nodemailer');
const stringToDateTime = require('./utils/stringToDateTime');

async function notify(text) {
    console.log('>>>> Sending e-mail.');
    await new Nodemailer().sendEmail(text);
}

function isNewChapter(chapterDate) {
    console.log('>>>> Checking if the mangá is new.');
    let lastChapter = FileManager.read();
    lastChapter = JSON.parse(lastChapter);
    return chapterDate > new Date(lastChapter.date);
}

function crawler(html) {
    console.log('>>>> Crawling over the data.');
    const $ = cheerio.load(html);
    const thumbTitles = $('article h1', '#noticias').toArray();
    const thumbDates = $('article time', '#noticias').toArray();
    for (let i = 0; i < thumbTitles.length; i++) {
        const titleText = thumbTitles[i].children[0].data;
        const dateText = stringToDateTime(thumbDates[i].children[0].data);
        if (!titleText.includes('Mang')) continue;
        console.log(`>>>> Found: ${titleText}.`);
        if (!isNewChapter(dateText)) { return console.log('>>>> Não é mais recente'); }
        FileManager.write(JSON.stringify({
            number: titleText,
            date: dateText
        }));
        notify(titleText);
    }
}

async function getHtmlData() {
    console.log('>>>> Fetching data from OPex website.');
    const response = await axios.get(process.env.OPEX_LINK);
    crawler(response.data);
}

const oneMinute_ms = 60000;
const minutes = process.env.EXECUTION_PERIOD_MINUTES;
console.log('>>>> Starting...');
setInterval(() => {
    const todayWeekday = new Date().getDay();
    return todayWeekday < 4 ? console.log('Not yet...') : getHtmlData(); 
}, (oneMinute_ms*minutes));