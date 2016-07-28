#CLASS Backend

##Getting Setup

If you've never used github before [set your ssh key](#github-setup)

1. Clone the repo using git: `git clone git@github.com:NJIT-CLASS/backend.git`
2. CD into the cloned directory.
3. Run `npm install` which will install all the third-party packages the project depends on.
4. Run `npm start` to start the server and start developing.

##Technologies and Tools

- [Node.js](https://nodejs.org/docs/v5.6.0/api/): Server
- [Express.js](http://expressjs.com/en/4x/api.html): Web Server Framework
- [MySQL](https://www.mysql.com): Database
- [Body Parser](https://github.com/expressjs/body-parser): Parses JSON
- [MD5](https://en.wikipedia.org/wiki/MD5): Message Digest Algorithm for Security
- [Sequelize](http://docs.sequelizejs.com/en/latest/) : ORM library to access data base and manipulate data easily.

##Github Setup

1. Create an SSH key. Run `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. [Add the new SSH key to Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-mac)

##Git Quickstart

Here are the git commands that you can use to get by for now (if you don't know how to use it).

When you want to send your code to Github. Then these three commands will get you by for now.
- `git add -A` will stage all the files you changed so that you can commit them (next command).
- `git commit -m 'summary of what you changed'` will save the changes.
- `git push origin master` will send your changes to Github.
