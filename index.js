require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const FileManager = require('./Classes/FileManager');
const Nodemailer = require('./Classes/Nodemailer');

async function notify(text) {
    new Nodemailer().sendEmail(text);
}

function isNewChapter(chapter) {
    const lastChapter = FileManager.read();
    return chapter > 'Mangá 1065';
}

function crawler(html) {
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
    const response = await axios.get('https://onepieceex.net/categoria/onepiece/');
    crawler(response.data);
}

while (true) {
    getHtmlData();
}