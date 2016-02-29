module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "modules": true
        }
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            1,
            4
        ],
        "linebreak-style": [
            1,
            "unix"
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
        "no-debugger": 1,
        "no-dupe-args": 1,
        "no-dupe-keys": 1,
        "no-unreachable": 1
    }
};