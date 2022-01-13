const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');

const BRITISHDIRECTION = 'american-to-british';
const AMERICANDIRECTION = 'british-to-american';
/**
 * 
[ ] Translate Mangoes are my favorite fruit. to British English
[ ] Translate I ate yogurt for breakfast. to British English
[ ] Translate We had a party at my friend's condo. to British English
[ ] Translate Can you toss this in the trashcan for me? to British English
[ ] Translate The parking lot was full. to British English
[ ] Translate Like a high tech Rube Goldberg machine. to British English
[ ] Translate To play hooky means to skip class or work. to British English
[ ] Translate No Mr. Bond, I expect you to die. to British English
[ ] Translate Dr. Grosh will see you now. to British English
[ ] Translate Lunch is at 12:15 today. to British English
[ ] Translate We watched the footie match for a while. to American English
[ ] Translate Paracetamol takes up to an hour to work. to American English
[ ] Translate First, caramelise the onions. to American English
[ ] Translate I spent the bank holiday at the funfair. to American English
[ ] Translate I had a bicky then went to the chippy. to American English
[ ] Translate I've just got bits and bobs in my bum bag. to American English
[ ] Translate The car boot sale at Boxted Airfield was called off. to American English
[ ] Translate Have you met Mrs Kalyani? to American English
[ ] Translate Prof Joyner of King's College, London. to American English
[ ] Translate Tea time is usually around 4 or 4.30. to American English
[ ] Highlight translation in Mangoes are my favorite fruit.
[ ] Highlight translation in I ate yogurt for breakfast.
[ ] Highlight translation in We watched the footie match for a while.
[ ] Highlight translation in Paracetamol takes up to an hour to work.

**/

suite('Unit Tests', () => {

    let newTranslator = new Translator();

    test('#1', function() {
        const payload = {
            text: 'Mangoes are my favorite fruit.',
            locale: BRITISHDIRECTION,
            translated: 'Mangoes are my <span class="highlight">favourite</span> fruit.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#2', function() {
        const payload = {
            text: 'I ate yogurt for breakfast.',
            locale: BRITISHDIRECTION,
            translated: 'I ate <span class="highlight">yoghurt</span> for breakfast.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#3', function() {
        const payload = {
            text: "We had a party at my friend's condo.",
            locale: BRITISHDIRECTION,
            translated: 'We had a party at my friend\'s <span class="highlight">flat</span>.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#4', function() {
        const payload = {
            text: 'Can you toss this in the trashcan for me?',
            locale: BRITISHDIRECTION,
            translated: 'Can you toss this in the <span class="highlight">bin</span> for me?'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#5', function() {
        const payload = {
            text: 'The parking lot was full.',
            locale: BRITISHDIRECTION,
            translated: 'Everything looks good to me!'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#6', function() {
        const payload = {
            text: 'Like a high tech Rube Goldberg machine.',
            locale: BRITISHDIRECTION,
            translated: 'Everything looks good to me!'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#7', function() {
        const payload = {
            text: 'To play hooky means to skip class or work.',
            locale: BRITISHDIRECTION,
            translated: 'Everything looks good to me!'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#8', function() {
        const payload = {
            text: 'No Mr. Bond, I expect you to die.',
            locale: BRITISHDIRECTION,
            translated: 'No <span class="highlight">Mr</span> Bond, I expect you to die.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#9', function() {
        const payload = {
            text: 'Dr. Grosh will see you now.',
            locale: BRITISHDIRECTION,
            translated: '<span class="highlight">Dr</span> Grosh will see you now.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#10', function() {
        const payload = {
            text: 'Lunch is at 12:15 today.',
            locale: BRITISHDIRECTION,
            translated: 'Lunch is at <span class="highlight">12.15</span> today.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#11', function() {
        const payload = {
            text: 'We watched the footie match for a while.',
            locale: AMERICANDIRECTION,
            translated: 'We watched the <span class="highlight">soccer</span> match for a while.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#12', function() {
        const payload = {
            text: 'Paracetamol takes up to an hour to work.',
            locale: AMERICANDIRECTION,
            translated: '<span class="highlight">Tylenol</span> takes up to an hour to work.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#13', function() {
        const payload = {
            text: 'First, caramelise the onions.',
            locale: AMERICANDIRECTION,
            translated: 'First, <span class="highlight">caramelize</span> the onions.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#14', function() {
        const payload = {
            text: 'I spent the bank holiday at the funfair.',
            locale: AMERICANDIRECTION,
            translated: 'I spent the bank holiday at the <span class="highlight">carnival</span>.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#15', function() {
        const payload = {
            text: 'I had a bicky then went to the chippy.',
            locale: AMERICANDIRECTION,
            translated: 'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#16', function() {
        const payload = {
            text: "I've just got bits and bobs in my bum bag.",
            locale: AMERICANDIRECTION,
            translated: 'Everything looks good to me!'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#17', function() {
        const payload = {
            text: 'The car boot sale at Boxted Airfield was called off.',
            locale: AMERICANDIRECTION,
            translated: 'Everything looks good to me!'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#18', function() {
        const payload = {
            text: 'Have you met Mrs Kalyani?',
            locale: AMERICANDIRECTION,
            translated: 'Have you met <span class="highlight">Mrs.</span> Kalyani?'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#19', function() {
        const payload = {
            text: "Prof Joyner of King's College, London.",
            locale: AMERICANDIRECTION,
            translated: `<span class="highlight">Prof.</span> Joyner of King's College, London.`
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#20', function() {
        const payload = {
            text: 'Tea time is usually around 4 or 4.30.',
            locale: AMERICANDIRECTION,
            translated: 'Tea time is usually around 4 or <span class="highlight">4:30</span>.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    ////////////////////////////////
    test('#21', function() {
        const payload = {
            text: 'Mangoes are my favorite fruit.',
            locale: BRITISHDIRECTION,
            translated: 'Mangoes are my <span class="highlight">favourite</span> fruit.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#22', function() {
        const payload = {
            text: 'I ate yogurt for breakfast.',
            locale: BRITISHDIRECTION,
            translated: 'I ate <span class="highlight">yoghurt</span> for breakfast.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#23', function() {
        const payload = {
            text: 'We watched the footie match for a while.',
            locale: AMERICANDIRECTION,
            translated: 'We watched the <span class="highlight">soccer</span> match for a while.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });

    test('#24', function() {
        const payload = {
            text: 'Paracetamol takes up to an hour to work.',
            locale: AMERICANDIRECTION,
            translated: '<span class="highlight">Tylenol</span> takes up to an hour to work.'
        };

        assert.equal(newTranslator.translate(payload.text, payload.locale), payload.translated);
    });
});
