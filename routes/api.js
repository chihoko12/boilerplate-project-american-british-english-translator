'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      // check for missing fields
      if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing'});
      }

      // check for empty text
      if (text === '') {
        return res.json({ error: 'No text to translate' });
      }

      if (! (locale === 'american-to-british' || locale === 'british-to-american') ) {
        return res.json({ error: 'Invalid value for locale field' });
      }

      try {
        // perform the translation
        const translation = translator.translate(text, locale, true);

        // check if translation was needed
        if (translation === text) {
          return res.json({ text, translation: 'Everything looks good to me!'});
        } else {
          return res.json({ text, translation});
        }

      } catch (e) {
          console.error(e);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
};
