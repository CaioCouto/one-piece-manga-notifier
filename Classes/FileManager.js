const fs = require('fs');

module.exports = class FileManager {
    static write(text) {
        fs.writeFile('last_chapter.txt', text, { encoding:'utf8' }, (err) => {
            if (err) throw err;
            console.log(`O ${text} foi salvo com sucesso.`);
        });
    }
    
    static read() {
        return fs.readFileSync('last_chapter.txt', { encoding:'utf-8' });
    }
};