const translations = require('./translations.json');
const languages = require('./languages.json');

var translationMap = new Map();

for (var translation in translations) {
	translationMap.set(translations[translation], translation);
}

const translateSetup = (mysql, language) => {

	return (str, cb) => {
		const strId = translationMap.get(str);

		const languageCode = languages[language];

		const query = `SELECT string FROM Translations WHERE string_id=${strId} AND language_code='${languageCode}'`;
		mysql.query(query, (err, rows) => {
			if (err) {
				// TODO: log error
				return cb(str);
			}

			return cb(rows[0]['string']);
		});
	};

};

module.exports = translateSetup;