const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

let britishToAmericanSpelling;
let britishToAmericanTitles;

const BRITISHDIRECTION = 'american-to-british';
const AMERICANDIRECTION = 'british-to-american';

class Translator {
    
    constructor() {
        this.britToAmericaSpelling = {};
        this.britToAmericaTitles = {};
    };

    //has to be called for every Translator instance
    initBritToAmericaSpelling() {
        for (const [key, value] of Object.entries(americanToBritishSpelling)) {
            this.britToAmericaSpelling[value] = key;
        };
    };

    //has to be called for every Translator instance
    initBritToAmericaTitles() {
        for (const [key, value] of Object.entries(americanToBritishTitles)) {
            this.britToAmericaTitles[value] = key;
        };
    };

    //has to be called before translating
    getDirection(payloadLocale) {
        if (payloadLocale === BRITISHDIRECTION) {
            return {
                spelling: americanToBritishSpelling,
                titles: americanToBritishTitles,
                self: britishOnly
            };
        } else if (payloadLocale === AMERICANDIRECTION) {
            return {
                spelling: this.britToAmericaSpelling,
                titles: this.britishToAmericanTitles,
                self: americanOnly
            };
        };
    };


    toLowerCaseArray(text) {
        let cleanedUpText = text.match(/^(.*)[!?.]+$/)[1];

        return {
            lowercase: cleanedUpText.toLowerCase().split(/\s+/),
            originalcase : cleanedUpText.split(/\s+/)
        };
    };


    findPair(lowerCaseArray, direction) {
        let translated = [];

        for (const [index, elem] of Object.entries(lowerCaseArray)) {
            if (direction.spelling[elem]) {
                translated.push(elem);
            } else if (direction.titles[elem]) {
                translated.push(elem);
            } else if (direction.self[elem]) {
                translated.push(elem);
            } else {
                translated.push('');
            };
        }
        return translated;
    };

    receoverLetter(originalArray, translation) {
        if (originalArray.length !== translation.length) {
            return 'Number of translated word array arent the same.'
        } else {
            for (const [index, word] of originalArray) {
                if (word[0] === translation[index][0].toUpperCase()) {
                    translation[index] = translation[index].slice(0).toUpperCase() + translation[index].slice(1).toUpperCase()
                }
            }
        }
    }
};

module.exports = Translator;