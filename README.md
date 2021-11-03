# React code for PA Portal

Johan van der Heide (johan.van.der.heide@itea4.org)
Benjamin Hoft (hoft@eurescom.eu)

## Development environment with Docker
docker build -f Dockerfile.dev -t pa-portal:dev .

docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true pa-portal:dev