# React code for PA Portal

Johan van der Heide (johan.van.der.heide@itea4.org)
Benjamin Hoft (hoft@eurescom.eu)

### Install dependencies on host machine

This command installs dependency all dependencies on the host machine
When something is changed in the root of the application (for example different env params, run)

```shell
yarn build
```

### Local environment

Copy `.env.example` to `.env.local` and put local-only values there.

```shell
cp .env.example .env.local
```

The login page now requires `VITE_SERVICE_LIST_TOKEN` so the frontend can authorize the `/api/list/service` request.

For local development you can bypass OAuth entirely by setting `VITE_DEV_AUTH_TOKEN` in `.env.local`. When the Vite dev server is running, the app will use that token for authentication automatically and skip the OAuth login flow.

As the root of the app is not mounted in the container (only /src)
Update all packages in Yarn

```shell
yarn upgrade-interactive [--latest]
```

To publish a new version just push the code to GitHub. The ./github/workflows/docker-image.yml will launch the action
which creates a new container.
On the server a new container can be pulled with ```docker pull [containername]``` so docker pulls a new version of the
container.

### Run a hook after `git pull`

Git does not provide a dedicated `post-pull` hook, so this repository uses:

- `.githooks/post-merge` for a regular `git pull`
- `.githooks/post-rewrite` for `git pull --rebase`

Install the versioned hooks into your local clone with:

```shell
yarn hooks:install
```

The hook entrypoint is `scripts/on-pull.sh`. Put the commands there that should run after pulling from the remote.

The build stage of this container is in 2 steps, initiated by calling the production target in the docker-image.yml file

```yaml
name: Portal PA Portal Docker Image

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.CR_PAT }}

      - name: Build and push frontend code
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64
          target: production
          push: true
          tags: ghcr.io/eureka-clusters/frontend:latest
```

This will create first a node container which builds the code and then a second (final) container is created in which
the code is copied as static code
