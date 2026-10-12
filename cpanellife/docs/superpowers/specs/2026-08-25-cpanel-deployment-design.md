# cPanel Frontend Deployment Design

## Goal

Add Docker, Jenkins, and Kubernetes deployment files to the cPanel frontend by following the established `micwebsite-gitea` deployment pattern while preserving this application's `/cp` base path.

## Scope

Create:

- `.dockerignore`
- `Dockerfile`
- `nginx.conf`
- `Jenkinsfile`
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/ingress.yaml`

No application source files, dependencies, or existing build settings will change.

## Deployment Values

- Registry: `10.30.18.30:3033`
- Image: `10.30.18.30:3033/mic/cpanel`
- Kubernetes namespace: `mic-dev`
- Deployment, container, service, ingress, and app label: `cpanel`
- Ingress host: `cpanel.dev.mic.internal`
- TLS secret: `cpanel-tls`
- Cluster issuer: `mic-dev-ca`
- Registry pull secret: `gitea-registry`
- `VITE_API_URL`: `https://api.dev.mic.internal/api`
- `VITE_CONFIG_URL`: `https://api.dev.mic.internal`

## Build and Image Design

Jenkins will install dependencies with `npm ci` and run the existing `npm run build` command. The Vite environment variables will be available during that build because Vite embeds them into the browser bundle at build time.

The Docker image will follow the reference repository's runtime-only design: Jenkins produces `dist`, and `nginx:alpine` serves that output. The container will run as the Nginx user on port 8080 with writable temporary paths under `/tmp`, allowing Kubernetes to use a read-only root filesystem.

The Docker context will include only `dist` and `nginx.conf`. Source code, dependencies, repository metadata, local environment files, and deployment files will be excluded.

## HTTP and Routing Design

The cPanel Vite build uses `base: "/cp"`, and its React routes also begin with `/cp`. Nginx therefore must not use the reference website configuration unchanged.

Nginx will:

- Return `200` from `/healthz` for Kubernetes probes.
- Redirect `/` and `/cp` to the canonical `/cp/` path.
- Serve `/cp/assets/...` from the generated `dist/assets` directory.
- Serve other static files requested below `/cp`.
- Fall back to `index.html` for client-side routes such as `/cp/signin` and `/cp/file-manager`.
- Apply long-lived immutable caching to hashed assets and disable caching for `index.html`.
- Emit the same security headers and logs as the reference setup.

## Jenkins Pipeline

The pipeline will mirror the reference stages:

1. Clean checkout.
2. Generate an immutable image tag from the Jenkins build number and short Git commit.
3. Verify Node, npm, `package.json`, and `package-lock.json`.
4. Run `npm ci`.
5. Build the frontend with the confirmed Vite environment values.
6. Verify `dist/index.html` exists and reject bundles containing localhost development URLs.
7. On `main` or `master` only, log in with Jenkins credential `Gitea_Jenkins_Hub`.
8. Build and push immutable and `latest` image tags.
9. Apply the three Kubernetes manifests and set the deployment image to the immutable tag.
10. Wait for rollout completion.
11. Always log out of the registry and clean the workspace.

Non-deployment branches will still install and build, but will not access registry credentials, push images, or modify Kubernetes.

## Kubernetes Design

The Deployment will use two replicas and a rolling update with zero unavailable pods. It will include:

- Registry pull secret.
- Host topology spreading.
- Readiness and liveness probes against `/healthz`.
- Small CPU and memory requests and limits matching the reference frontend.
- A non-root security context with all Linux capabilities dropped.
- A read-only root filesystem and an empty `/tmp` volume.

The ClusterIP Service will expose port 80 and target the container's named port on 8080.

The Ingress will terminate TLS for `cpanel.dev.mic.internal`, redirect HTTP to HTTPS, and route `/` to the cPanel service. Nginx will redirect the host root to the application's canonical `/cp/` path.

## Validation

Validation will include:

- `npm run build` with the deployment Vite environment values.
- Inspection of generated asset URLs to confirm the `/cp` base.
- Docker image build.
- Container smoke tests for `/healthz`, `/`, `/cp`, `/cp/`, `/cp/signin`, and one generated `/cp/assets/...` URL when Docker is available.
- `kubectl apply --dry-run=client` for all manifests when `kubectl` is available.
- A final Git diff review to ensure only the requested deployment files and approved design documentation changed.

No live image push or Kubernetes deployment will be performed during local validation.
