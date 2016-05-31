echo Starting server
set dbUser=alan
set dbPass=101660
set dbHost=localhost
set database=class
set serverPort=3000
redis-server
start runFront.bat
cd backend
npm start

