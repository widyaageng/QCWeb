'use strict';

const Translator = require('../components/translator.js');
const requiredFields = ['text', 'locale'];
const BRITISHDIRECTION = 'american-to-british';
const AMERICANDIRECTION = 'british-to-american';

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      let payload = req.body;

      console.log(payload);
      
      let fieldsSatisfied = requiredFields.every(item => Object.keys(payload).includes(item));
      let validLocale = [BRITISHDIRECTION, AMERICANDIRECTION].includes(payload.locale);
      let translated = validLocale ? translator.translate(payload.text, payload.locale) : '';


      console.log("Valid locale ", validLocale);
      if (!fieldsSatisfied) {
        res.json({
          error: 'Required field(s) missing'
        });
      } else if (!validLocale) {
        res.json({
          error: 'Invalid value for locale field'
        });
      } else if (translated === 'No text to translate') {
        res.json({
          error: 'No text to translate'
        });
      } else {
        res.json({
          text: payload.text,
          translation: translated
        });
      };
    });
};
