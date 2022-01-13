const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const BRITISHDIRECTION = 'american-to-british';
const AMERICANDIRECTION = 'british-to-american';

class Translator {

    constructor() {
        this.britToAmericanSpelling = {};
        this.britToAmericanTitles = {};
        this.initiated = false;
    };

    //has to be called for every Translator instance
    initBritToAmericaSpelling() {
        for (const [key, value] of Object.entries(americanToBritishSpelling)) {
            this.britToAmericanSpelling[value] = key;
        };
    };

    //has to be called for every Translator instance
    initBritToAmericaTitles() {
        for (const [key, value] of Object.entries(americanToBritishTitles)) {
            this.britToAmericanTitles[value] = key;
        };
    };

    //has to be called before translating
    getDirection(payloadLocale) {
        if (payloadLocale === BRITISHDIRECTION) {
            return {
                spelling: americanToBritishSpelling,
                titles: americanToBritishTitles,
                self: americanOnly
            };
        } else if (payloadLocale === AMERICANDIRECTION) {
            return {
                spelling: this.britToAmericanSpelling,
                titles: this.britToAmericanTitles,
                self: britishOnly
            };
        };
    };


    toLowerCaseArray(text) {
        let cleanedUpText = text.match(/^(.*)([!?.]+)$/);

        if (cleanedUpText == null) {
            cleanedUpText = (text + '.').match(/^(.*)([!?.]+)$/);
        }

        return {
            lowercase: cleanedUpText[1].toLowerCase().split(/\s+/),
            originalcase: cleanedUpText[1].split(/\s+/),
            endOfSentence: cleanedUpText[2]
        };
    };


    findPair(lowerCaseArray, direction) {
        let translated = [];

        for (const [index, elem] of Object.entries(lowerCaseArray)) {
            if (direction.spelling[elem]) {
                translated.push(direction.spelling[elem]);
            } else if (direction.titles[elem]) {
                translated.push(direction.titles[elem]);
            } else if (direction.self[elem]) {
                translated.push(direction.self[elem]);
            } else {
                translated.push('');
            };
        }
        return translated;
    };

    recoverLetter(originalArray, translation) {
        if (originalArray.length !== translation.length) {
            return 'Number of translated word array arent the same.'
        } else {

            for (const [index, word] of Object.entries(originalArray)) {
                if (translation[index].length > 0) {
                    if (word[0] === word[0].toUpperCase()) {
                        translation[index] = translation[index].slice(0, 1).toUpperCase() + translation[index].slice(1);
                    } else {
                        translation[index] = translation[index].slice(0, 1).toLowerCase() + translation[index].slice(1);
                    };
                    translation[index] = '<span class="highlight">' + translation[index] + '</span>';
                } else {
                    translation[index] = word;
                }
            };
            return translation;
        };
    };

    timeCorrection(inputText, direction) {

        let spanBracket = ['<span class="highlight">', '</span>'];

        let timeScannedIdx = inputText.match(/\s[\d]{0,2}([:.])[\d]{2}/);
        if (timeScannedIdx == null) {
            return inputText;
        } else {
            
            let clockSymbolIdx = timeScannedIdx.index + timeScannedIdx[0].match(/[:.]/).index;
    
            if (timeScannedIdx.index > -1) {
                let outputTimeText = inputText.slice(0, clockSymbolIdx);
    
                if (inputText[clockSymbolIdx] == ':' && direction === BRITISHDIRECTION) {
                    outputTimeText += '.' + inputText.slice(clockSymbolIdx + 1);
                } else if (inputText[clockSymbolIdx] == '.' && direction === AMERICANDIRECTION) {
                    outputTimeText += ':' + inputText.slice(clockSymbolIdx + 1);
                } else {
                    return inputText;
                };

                let outString = outputTimeText.split('');
                outString.splice(timeScannedIdx.index + 1, 0, ...spanBracket[0].split(''));
                outString.splice(clockSymbolIdx + 2 + spanBracket[0].length + 1, 0, ...spanBracket[1]);

                return outString.join('');
            } else {
                return inputText;
            };
        };
    };

    translate(rawtext, translateDirection) {

        if (rawtext == null || rawtext == '') {
            return 'No text to translate';
        };

        if (!this.initiated) {
            this.initBritToAmericaSpelling();
            this.initBritToAmericaTitles();
            this.initiated = true;
        };

        let lookUpDirection = this.getDirection(translateDirection);
        let originalArray = this.toLowerCaseArray(rawtext);
        let translatedArray = this.findPair(originalArray.lowercase, lookUpDirection);

        let recoveredTranslation = this.recoverLetter(originalArray.originalcase, translatedArray);

        let translated = this.timeCorrection(recoveredTranslation.join(' ') + originalArray.endOfSentence, translateDirection);

        if (translated === rawtext) {
            return 'Everything looks good to me!';
        };

        return translated;
    };
};

let newTranslator = new Translator();
let translated = newTranslator.translate('Mangoes are my favorite fruit.', BRITISHDIRECTION);

console.log(translated);

module.exports = Translator;