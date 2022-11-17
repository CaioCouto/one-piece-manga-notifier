const nodemailer = require('nodemailer');

module.exports = class Nodemailer {
    constructor() {
        this.__transporter = nodemailer.createTransport({
            host: process.env.SENDER_HOST,
            port: Number(process.env.SENDER_PORT),
            secure: false,
            auth: {
              user: process.env.SENDER_EMAIL,
              pass: process.env.SENDER_PWD,
            },
        });
    }

    async sendEmail(chapter) {
        try {
            await this.__transporter.sendMail({
                from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
                to: process.env.RECEIVERS_EMAIL,
                subject: `O ${chapter} já está na OPex!`,
                html: `<a href="${process.env.OPEX_LINK}">Clique aqui</a> para ler!`
            });
            console.log('Email successfuly sent.');
        } catch (error) {
            console.log(error);
        }
    }
}