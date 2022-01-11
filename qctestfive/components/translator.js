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

        return cleanedUpText.toLowerCase().split(/\s+/);
    };


    findPair(lowerCaseArray, direction) {
        for (let word of lowerCaseArray) {

        }
    };

};

module.exports = Translator;