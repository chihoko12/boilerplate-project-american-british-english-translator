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

      try {
        // perform the translation
        const translation = translator.translate(text, locale);

        // check if translation was needed
        if (translation === text) {
          return res.json({ text, translation: 'Everything looks good to me!'});
        } else {
          return res.json({ text, translation});
        }
      } catch (e) {
        // handle invalid locale or other errors
        if (e.message === 'Invalid locale') {
          return res.json({ error: 'Invalid value for locale field' });
        } else {
          // generic error handling
          console.error(e);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    });
};
