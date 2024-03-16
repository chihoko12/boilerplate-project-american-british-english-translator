const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  constructor() {
    this.americanDict = { ...americanOnly, ...americanToBritishSpelling };
    this.britishDict = { ...britishOnly, ...this.invertDict(americanToBritishSpelling) };
    this.titleDict = { ...americanToBritishTitles };
  }

  invertDict(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[obj[key]] = key;
      return acc;
    }, {});
  }

  translate(text, locale, highlight = false) {
    let dict, titlesDict;
    if (locale === 'american-to-british') {
      dict = this.americanDict;
      titlesDict = this.titleDict;
    } else if (locale === 'british-to-american') {
      dict = this.britishDict;
      titlesDict = this.invertDict(this.titleDict);
    } else {
      { error: 'Invalid value for locale field' };
    }

    const wrapHighlight = (translatedText) => highlight ? `<span class="highlight">${translatedText}</span>` : translatedText;

    Object.keys(titlesDict).forEach(title => {
      //const regex = new RegExp(`\\b${title}(\\.)?\\b`, 'gi');
      const regex = new RegExp(`(^|\\s)${title}(\\.)?(\\s|$)`, 'gi');

      text = text.replace(regex, (match, start, titleText, period, end) => {
        console.log(`match, start, titleText, p, end: ${match} ${start} ${titleText} ${period} ${end}`);
        let replacement = titlesDict[title];
        let capitalizedReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        let periodToAdd = locale === 'british-to-american' && period ? '.' : '';
        return  `${start}${wrapHighlight(capitalizedReplacement)}${periodToAdd}${end}`;
      });
    });

    text = text.replace(/\b\d{1,2}[:.]\d{2}\b/g, (match) => {
      if (locale == 'american-to-british') {
        return wrapHighlight(match.replace(':', '.'));
      } else if (locale == 'british-to-american') {
        return wrapHighlight(match.replace('.',':'));
      } else {
        return match;
      };
    });

    // translate words and phrases
    Object.keys(dict).forEach(wordOrPhrase => {
      const regex = new RegExp(`\\b${wordOrPhrase}\\b`, 'gi');
      text = text.replace(regex, (match) => {
//        console.log(dict[wordOrPhrase]);
        return wrapHighlight(dict[wordOrPhrase]);
      });
    });
    return text;
  }
}

module.exports = Translator;
