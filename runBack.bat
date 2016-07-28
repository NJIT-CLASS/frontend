echo Starting server
set dbUser=alan
set dbPass=101660
set dbHost=localhost
set database=pla
set serverPort=3000
redis-server
cd backend
npm start
