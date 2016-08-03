echo Starting server
set dbUser=alan
set dbPass=pass
set dbHost=localhost
set database=pla
set serverPort=3000
redis-server
cd backend
npm start
