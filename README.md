#CLASS Frontend

##Getting Setup

If you've never used github before [set your ssh key](#github-setup)

1. Clone the repo using git: `git clone git@github.com:NJIT-CLASS/frontend.git`.
2. `cd` into the cloned directory.
4. Clone the backend repo using git: `git clone https://github.com/NJIT-CLASS/backend.git`.
5. Set up a local MySQL database and run the latest [sql import script](https://github.com/NJIT-CLASS/Configuration/blob/master/class_2016-05-03.sql)
6. Download and install [redis](http://redis.io)
7. Import latest language strings into server using [language-export.js](https://github.com/NJIT-CLASS/Configuration/blob/master/language-export.js) to export the strings from the Redis instance on AFS and [language-import.js](https://github.com/NJIT-CLASS/Configuration/blob/master/language-import.js) to import them to your local redis instance
8. Set the environment variables `dbHost`, `dbUser`, `dbPass`, `database`, and `serverPort` to match your MySQL database hostname (probably localhost), database user, database user password, database name, and the port your want the backend server to serve on.
9. Copy the [fallback settings](https://github.com/NJIT-CLASS/Configuration/blob/master/exampleFallbackSettings.js) into fallback_settings.js in the root directory of the frontend project and customize the values to match the values for your setup (your redis hostname, authentication key, redis port, the port the frontend server will serve on, the URL of the backend server you are using, and your redis secret (just a random value).
5. Set the environment variables `
5. Run `npm start` in the backend directory.
5. Run `npm install` which will install all the third-party packages the project depends on.
6. Run `npm start` to start the server and start developing.

##Technologies and Tools

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/docs/v5.6.0/api/)
- [Express.js](http://expressjs.com/en/4x/api.html): web server framework
- [React.js](https://facebook.github.io/react/index.html): frontend framework
- [Handlebars.js](http://handlebarsjs.com/expressions.html): templating engine
- [SCSS](http://sass-lang.com/guide): CSS preprocessor
- [Redis](http://redis.io/): Redis

##Github Setup

1. Create an SSH key. Run `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. [Add the new SSH key to Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-mac)

##Git Quickstart

Here are the git commands that you can use to get by for now (if you don't know how to use it)

When you want to send your code to Github. Then these three commands will get you by for now.
- `git add -A` will stage all the files you changed so that you can commit them (next command).
- `git commit -m 'summary of what you changed'` will save the changes.
- `git push origin master` will send your changes to Github.
