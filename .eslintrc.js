module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true
    },
    //"extends": "airbnb",
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 8,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            1,
            4
        ],
        "quotes": [
            1,
            "single"
        ],
        "semi": [
            1,
            "always"
        ],
        "no-alert": 1,
        "no-debugger": 0,
        "no-dupe-args": 1,
        "no-dupe-keys": 1,
        "no-unreachable": 1
    }
};
