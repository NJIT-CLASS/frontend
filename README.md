# CLASS Frontend

## Getting Setup

If you've never used github before [set your ssh key](#github-setup)

0. Install the necessary software: [MySQL Server](https://dev.mysql.com/downloads/mysql/), [Node.js](https://nodejs.org/en/), and [Redis](https://redis.io/download) 
1. Clone the repo using git: `git clone https://github.com/NJIT-CLASS/frontend.git`.
2. Clone the backend repo using git: `git clone https://github.com/NJIT-CLASS/backend.git`.
3. Set up a local MySQL database and run the latest [sql import script](https://github.com/NJIT-CLASS/configuration/blob/master/EmptySystem.sql)
    - (Optional) Import latest language strings into server using  [language-import.js](https://github.com/NJIT-CLASS/Configuration/blob/master/language-import.js) to import them to your local redis instance
4. Set the environment variables `dbHost`, `dbUser`, `dbPass`, `database`, and `serverPort` or set them in the `backend_settings.js` to match your MySQL database hostname (probably localhost), database user, database user password, database name, and the port your want the backend server to serve on.
5. Run `npm install gulp` in the frontend directory
6. Run `gulp generate:fallback-settings` to generate your fallback settings (just answer the questions)
7. Set the API_URL settings in `/server/utils/react_constants.js`
8. Run `npm install` which will install all the third-party packages the project depends on in both the frontend and backend directories.
    - Windows users may need to [follow this guide](https://github.com/nodejs/node-gyp) to get argon2 to work in the backend.
9. Run `npm start` in the frontend directory to start the server and start developing.
10. Run `npm start` in the backend directory.

## Technologies and Tools

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): full-stack language
- [Node.js](https://nodejs.org/en/): server runtime
- [Express.js](http://expressjs.com/en/4x/api.html): web server framework
- [React.js](https://facebook.github.io/react/index.html): frontend framework
- [Handlebars.js](http://handlebarsjs.com/expressions.html): templating engine
- [SCSS](http://sass-lang.com/guide): CSS preprocessor
- [FontAwesome](http://fontawesome.io/): Icon pack
- [Redis](http://redis.io/): Redis database server

## Github Setup

1. Create an SSH key. Run `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. [Add the new SSH key to Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-mac)

## Git Quickstart

Here are the git commands that you can use to get by for now (if you don't know how to use it)

When you want to send your code to GitHub. Then these three commands will get you by for now.
- `git add -A` will stage all the files you changed so that you can commit them (next command).
- `git commit -m 'summary of what you changed'` will save the changes.
- `git pull origin master` will get the latest changes from GitHub (Do this AFTER you commit).
- `git push origin master` will send your changes to GitHub.
