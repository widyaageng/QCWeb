const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');
const BRITISHDIRECTION = 'american-to-british';
const AMERICANDIRECTION = 'british-to-american';
chai.use(chaiHttp);

// let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    // let newTranslator = new Translator();

    test('Text and field provided', function (done) {
        const payload = {
            text: 'Mangoes are my favorite fruit.',
            translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.deepEqual(res.body, {text: payload.text, translation: payload.translation});
                done();
            });
    });

    test('Time translation', function (done) {
        const payload = {
            text: 'Lunch is at 12:15 today.',
            translation: 'Lunch is at <span class="highlight">12.15</span> today.',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.deepEqual(res.body, {text: payload.text, translation: payload.translation});
                done();
            });
    });

    test('Title translation', function (done) {
        const payload = {
            text: 'Dr. Grosh will see you now.',
            translation: '<span class="highlight">Dr</span> Grosh will see you now.',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.deepEqual(res.body, {text: payload.text, translation: payload.translation});
                done();
            });
    });

    test('Wrapped', function (done) {
        const payload = {
            text: 'Mangoes are my favorite fruit.',
            translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.deepEqual(res.body, {text: payload.text, translation: payload.translation});
                done();
            });
    });

    test('Missing required fields', function (done) {
        const payload = {
            translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Text is empty string', function (done) {
        const payload = {
            text: '',
            translation: 'No text to translate',
            locale: 'american-to-british'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.translation);
                done();
            });
    });

    test('Locale doesnt match to any available translation', function (done) {
        const payload = {
            text: "Ceci n'est pas une pipe",
            translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.',
            locale: 'french-to-american'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });

    test('Requires no translation', function (done) {
        const payload = {
            text: 'SaintPeter and nhcarrigan give their regards!',
            translation: 'Everything looks good to me!',
            locale: 'british-to-american'
        };

        chai
            .request(server)
            .post('/api/translate')
            .send({ text: payload.text, locale: payload.locale })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'text');
                assert.property(res.body, 'translation');
                assert.deepEqual(res.body, {text: payload.text, translation: payload.translation});
                done();
            });
    });
});
