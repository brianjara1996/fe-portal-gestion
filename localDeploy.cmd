docker build . -t mf1
docker rm mf1 -f
docker run -d --name mf1 -p 3001:8080 mf1