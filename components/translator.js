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

  translate(text, locale) {
    let dict, titlesDict;
    if (locale === 'american-to-british') {
      dict = this.americanDict;
      titlesDict = this.titleDict;
    } else if (locale === 'british-to-american') {
      dict = this.britishDict;
      titlesDict = this.invertDict(this.titleDict);
    } else {
      "Invalid locale";
    }

    Object.keys(titlesDict).forEach(title => {
      // Adjusted regex to correctly capture an optional period after the title
      const regex = new RegExp(`\\b${title}(\\.)?\\b`, 'gi');

      // Using a replacement function to handle the optional period
      text = text.replace(regex, (match, p1) => {
        console.log(`match, p1: ${match} ${p1}`);
        let capitalizedTitle = titlesDict[title].charAt(0).toUpperCase() + titlesDict[title].slice(1);
        return  capitalizedTitle + (p1 ? '.' : '');
      });
    });

    // handle titles and times separately
    text = text.replace(/\b\d{1,2}[:.]\d{2}\b/g, (match) => {
      if (locale == 'american-to-british') {
        return match.replace(':', '.');
      } else if (locale == 'british-to-american') {
        return match.replace('.',':');
      } else {
        return match;
      };
    });

    // translate words and phrases
    Object.keys(dict).forEach(wordOrPhrase => {
      const regex = new RegExp(`\\b${wordOrPhrase}\\b`, 'gi');
      text = text.replace(regex, dict[wordOrPhrase]);
    });
    return text;
  }

  // capitalizeTitle(obj) {
  //   let capitalizedTitles = {};
  //   Object.entries(obj).forEach(([key, value]) => {
  //     let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
  //     let capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
  //     capitalizedTitles[capitalizedKey] = capitalizedValue;
  //   });
  //   return capitalizedTitles;
  // }


}

module.exports = Translator;
