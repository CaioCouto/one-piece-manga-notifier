const fs = require('fs');
const path = require('path');

const basePath = path.dirname(__dirname);

module.exports = class FileManager {

    static write(text) {
        try {
            fs.writeFileSync(
                path.join(basePath, 'last_chapter.json'), 
                text, 
                { encoding:'utf8' }
            );
            console.log(text, 'foi salvo com sucesso.');
        } catch (error) {
            console.log(error);
        }
    }
    
    static read() {
        return fs.readFileSync(
            path.join(basePath, 'last_chapter.json'), 
            { encoding:'utf-8' }
        );
    }
};