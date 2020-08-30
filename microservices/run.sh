docker-compose down
docker-compose build
docker-compose up --scale app=3 --force-recreate