require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const FileManager = require('./Classes/FileManager');
const Nodemailer = require('./Classes/Nodemailer');

function notify(text) {
    console.log('Sending e-mail.');
    new Nodemailer().sendEmail(text);
}

function isNewChapter(chapter) {
    console.log('Checking if the mangá is new.');
    const lastChapter = FileManager.read();
    return chapter > lastChapter;
}

function crawler(html) {
    console.log('Crawling over the data.');
    const $ = cheerio.load(html);
    const thumbTitles = $('article h1', '#noticias');
    thumbTitles.each((index, elem) => {
        const titleText = elem.children[0].data
        if (!titleText.includes('Mang')) return
        else if (isNewChapter(titleText)) {
            FileManager.write(titleText);
            notify(titleText);
        }
    });
}

async function getHtmlData() {
    console.log('Fetching data from OPex website.');
    const response = await axios.get(process.env.OPEX_LINK);
    crawler(response.data);
}

async function main() {
    console.log('Iniciando...');
    const minutes = 30;
    setInterval(() => {
        getHtmlData();
    }, (60000*minutes));
}
main();