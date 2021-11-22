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
docker compose -f docker-compose.dev.yml up app --force-recreate --build
```

As the root of the app is not mounted in the container (only /src)


Update all packages in Yarn

```shell
docker compose -f docker-compose.dev.yml run web yarn upgrade-interactive [--latest]
```

To publish a new version just push the code to Github. The ./github/workflows/docker-image.yml will launch the action which creates a new container.
On the server a new container can be pulled with ```docker pull [containername]``` so docker pulls a new version of the container.

The build stage of this container is in 2 steps, initiated by calling the production target in the docker-image.yml file

```yaml
name: Build and push frontend code
    uses: docker/build-push-action@v2
    with:
    context: .
    platforms: linux/amd64
    target: production
    push: true
    tags: ghcr.io/eureka-clusters/frontend:latest
```

This will create first a node container which builds the code and then a second (final) container is created in which the code is copied as static code