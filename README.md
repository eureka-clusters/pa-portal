# React code for PA Portal

Johan van der Heide (johan.van.der.heide@itea4.org)
Benjamin Hoft (hoft@eurescom.eu)

## Development environment with Docker

### Install dependencies on host machine 
THis command installs dependency all dependencies on the host machine

```bash
docker compose -f docker-compose.dev.yml run web yarn install
```

When something is changed in the root of the application (for example different env params, run)

```shell
docker compose -f docker-compose.dev.yml up --force-recreate --build
```

As the root of the app is not mounted in the container (only /src)