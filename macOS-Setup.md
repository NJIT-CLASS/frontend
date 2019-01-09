# Getting Setup (MacOS version) 

  If you've never used github before [set your ssh key](#github-setup)

1.  Inside your Terminal, make a directory for the project. Example: `mkdir njclassresearch`.
2.  Run `cd njclassresearch`
3.  Clone the repo using git: `git clone https://github.com/NJIT-CLASS/frontend.git`.
4.  Clone the backend repo using git: `git clone https://github.com/NJIT-CLASS/backend.git`.
5.  To set up a local MySQL database:

6.  Run `brew doctor` and fix any errors
7.  Once fixed (or if there are no errors), you should see the message `Your system is ready to brew.`
8.  Run `brew update`
9.  You should see “Already up-to-date."`
10.  Run `brew install mysql`
11.  Run `mysql.server start`
12.  You should see the success message: “Starting MySQL. SUCCESS!“

13.  Now, clone the repo using git: `git clone https://github.com/NJIT-CLASS/configuration.git`
14.  Open up the entire project directory in your IDE of choice (I am using Visual Studio Code as my IDE).
15.  To run the latest [sql import script](https://github.com/NJIT-CLASS/configuration/blob/master/EmptySystem.sql)
16. Inside your Terminal at your "njclassresearch" project directory, run `mysql -u root -p` and enter your password. 
  
  (Note: if you have not yet set your password, try this instruction here: `mysql_secure_installation` in your 'njclassresearch' project directory)
  Remember this, it will be your mysql password.
  
  Answering the following questions:
  I chose to answer 'n' + 'Return' to all questions except for the question "Reloading the privilege tables will ensure that all changes made so far will take effect immediately.
Reload privilege tables now? (Press y|Y for Yes, any other key for No) :" for which I typed 'y' and 'Return'. 

This was the last question. You should now see: "Success. All done!"

17. Run `CREATE DATABASE njclassresearch;` (“ njclassresearch” will be your database name)
Exit out of mysql inside your Terminal (Ctrl + Z).

18. Following this format (https://stackoverflow.com/questions/17666249/how-to-import-an-sql-file-using-the-command-line-in-mysql):
`mysql -u root -p njclassresearch < ./configuration/EmptySystem.sql` and enter your mysql password. 

19. Now to download and install  [redis](http://redis.io/). Inside your 'njclassresearch' directory, run `brew install redis`.
Following this article for starting Redis on macOS (https://medium.com/@djamaldg/install-use-redis-on-macos-sierra-432ab426640e), run the following commands:
20. Run `ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents`
21. Run `launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist`

22. Now to import latest language strings into server using  [language-import.js](https://github.com/NJIT-CLASS/Configuration/blob/master/language-import.js)  to import them to your local redis instance
In your Terminal, from the project directory "njclassresearch", run `cd configuration/` to go into the configuration folder
23. Then run `npm i`

(Note: 
If you see "-bash: redis-cli: command not found", try running `brew update`, then running `brew uninstall redis` and then re-installing again by running `brew install redis`.)

24. After installing, run `redis-cli`. You should see "127.0.0.1:6379>" which has localhost and the port number 6379. 
25. Now run `KEYS *`, and you should see a long list of all of the 'langs' from the language-import.js file.

26. Now onto the next step: "Set the environment variables  `dbHost`,  `dbUser`,  `dbPass`,  `database`, and  `serverPort`  or set them in the  `backend_settings.js`  to match your MySQL database hostname (probably localhost), database user, database user password, database name, and the port your want the backend server to serve on."
Inside your IDE (Visual Studio Code, in my case), open backend folder, then the backend_settings.js file. Change the specific variables that you've changed. 
(In my case, I changed the database name to "njclassresearch" so I've changed the line "exports.DATABASE  =  process.env.database  ||  'class/pla';" to "exports.DATABASE  =  process.env.database  ||  'njclassresearch';"
as well as changing the line "exports.DB_PASS  =  process.env.dbPass  ||  '1234';" to "exports.DB_PASS  =  process.env.dbPass  ||  'root';" (as we have set our mysql password to be "root")
and save the file. 

Close the terminal and terminate all processes.

27. In the next step, "run `npm install gulp` in the frontend directory", there is a slight error here. MacOS users must install all of the dev dependencies in the frontend, such as gulp-sass
Run the following commands in the frontend directory inside your Terminal:

`npm i gulp -g` (installs gulp globally)
`npm i gulp ` in frontend directory
`npm i`
`npm install --only=dev` and then move onto the next step. 


28. Run  `gulp generate:fallback-settings` to generate your fallback settings (just answer the questions)

To answer the given questions, open up njclassresearch/configuration/exampleFallbackSettings.js. We will be using all of the same answers except for the Redis Port number and API_URL. The Redis Port # can be found by opening up a new Terminal and running `redis-cli`; then you'll see "127.0.0.1:6379>" (the last 4 digits are your port number).

? **redis secret (the secret string for cookies stored in Redis):** Rx#z(ANYRyp9NjfLp62gsgVbF
? **redis host (hostname or location of Redis):** localhost
? **redis port:** 6379
? **redis auth (password for Redis server):** dZGVorD42Up/HWDU2n>RsfcZN
? **server port (local port that frontend server will run on):** 4001
? **API URL (url for backend server):** 'http://localhost:4000' (make sure to include the quotes around this)


29. Set the API_URL settings in  `/server/utils/react_constants.js`

Simply write `exports.API_URL = 'http://localhost:4000';` at the bottom of that file in the frontend directory. 

30. Run `npm install` which will install all the third-party packages the project depends on in both the frontend and backend directories.

Open the file /njclassresearch/backend/package.json and 
delete the line `"argon2": "^0.16.1"` under "dependencies" and save the file. 

Also run the following commands inside the Terminal, backend directory: 
`npm i --only=dev`
`npm i`
`brew install gcc` (because there are issues with argon2 and macos)
You may need to reinstall it if it mentions that. If not, move on. 
`sudo npm i -g node-gyp` and enter your laptop password.
`which clang`, which you will use in the next line. For me, running this command gave me "/usr/bin/clang", which I plugged into the next command I ran (after "CXX="):
`CXX=/usr/bin/clang npm install argon2@0.16.1`
Then, finally run `npm start` in the backend. 

31. Run  `npm start`  in the frontend directory to start the server. 

32. Create a folder called “logs” in backend directory.

33. Start a mysql instance by running `mysql.server start` in project directory inside your Terminal.

34. Enter the following: ALTER USER ‘root’@‘localhost’ IDENTIFIED WITH mysql_native_password BY ‘root’;
It should run without any errors.
Then restart backend server by running `npm start`.
35. Finally, when the environment is running, you should see “Server running at http://localhost:4001” in frontend directory and “/Email: Creating Transport
/Email: Transport Created
All right ! I am alive at Port .4000
Server is ready to take our messages
Database synchronised.” in the backend directory. 
