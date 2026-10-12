# cPanel Frontend Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Jenkins-built, Nginx-hosted Docker deployment and Kubernetes resources for the cPanel frontend.

**Architecture:** Jenkins builds the existing Vite application with development API URLs, validates `dist`, and packages it in an unprivileged Nginx image. Kubernetes runs two secured replicas behind a ClusterIP Service and TLS Ingress, while Nginx maps the application's `/cp` public base to the files stored at the image document root.

**Tech Stack:** Vite 7, React 19, Nginx Alpine, Docker, Jenkins Declarative Pipeline, Kubernetes, cert-manager

## Global Constraints

- Follow the deployment structure in `C:\Users\omar\Desktop\Omar\micbackend\micwebsite-gitea`.
- Use image `10.30.18.30:3033/mic/cpanel`.
- Use namespace `mic-dev` and resource/app name `cpanel`.
- Use host `cpanel.dev.mic.internal`, TLS secret `cpanel-tls`, issuer `mic-dev-ca`, and pull secret `gitea-registry`.
- Build with `VITE_API_URL=https://api.dev.mic.internal/api` and `VITE_CONFIG_URL=https://api.dev.mic.internal`.
- Preserve the existing Vite `base: "/cp"` and application routes.
- Do not change application source files or add dependencies.
- Do not push an image, deploy to a live cluster, or create a Git commit during local implementation.

---

### Task 1: Container Runtime and `/cp` Routing

**Files:**
- Create: `.dockerignore`
- Create: `Dockerfile`
- Create: `nginx.conf`

**Interfaces:**
- Consumes: Vite output at `dist/index.html` and `dist/assets/`.
- Produces: An unprivileged HTTP container on port `8080`, health endpoint `/healthz`, and SPA under `/cp/`.

- [ ] **Step 1: Confirm the expected artifacts are absent**

Run:

```powershell
@("Dockerfile", ".dockerignore", "nginx.conf") |
  ForEach-Object { if (Test-Path $_) { throw "$_ already exists" } }
```

Expected: command exits successfully because all three files are absent.

- [ ] **Step 2: Create the restricted Docker build context**

Create `.dockerignore` so `dist/` and `nginx.conf` remain available while `.git`, `.vs`, `node_modules`, `src`, `public`, environment files, project metadata, and deployment files are excluded. Include cPanel's JavaScript configs (`vite.config.js`, `eslint.config.js`) rather than the reference project's TypeScript configs.

- [ ] **Step 3: Create the runtime-only Docker image**

Create `Dockerfile` using the reference runtime pattern:

```dockerfile
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx dist/ /usr/share/nginx/html/

RUN test -f /usr/share/nginx/html/index.html

USER nginx

EXPOSE 8080
```

- [ ] **Step 4: Create the Nginx configuration**

Create `nginx.conf` with:

- Nginx PID, logs, and all temporary paths under `/tmp`.
- Port `8080`, document root `/usr/share/nginx/html`, security headers, gzip, and hidden server version.
- Exact `/healthz` endpoint returning `200`.
- Exact `/` and `/cp` redirects to `/cp/`.
- `/cp/assets/` mapped to `/usr/share/nginx/html/assets/` with immutable caching.
- `/cp/` mapped to the document root with `index.html` fallback for React routes.
- `index.html` served with `Cache-Control: no-store, must-revalidate`.

The SPA mapping must strip the public `/cp/` prefix when looking up generated files; otherwise Vite URLs such as `/cp/assets/index-*.js` will incorrectly resolve under `/usr/share/nginx/html/cp/assets`.

- [ ] **Step 5: Build the Vite output**

Run:

```powershell
$env:VITE_API_URL = "https://api.dev.mic.internal/api"
$env:VITE_CONFIG_URL = "https://api.dev.mic.internal"
npm ci
Remove-Item -Recurse -Force .\dist -ErrorAction SilentlyContinue
npm run build
if (-not (Test-Path .\dist\index.html)) { throw "dist/index.html is missing" }
if (-not (Select-String -Path .\dist\index.html -Pattern '/cp/assets/' -Quiet)) {
  throw "Expected /cp/assets/ URLs"
}
```

Expected: Vite build succeeds and `dist/index.html` references `/cp/assets/`.

- [ ] **Step 6: Validate the image when Docker is available**

Run `docker version`. If available:

```powershell
docker build --tag cpanel-local:test .
docker run --detach --rm --name cpanel-test --publish 8080:8080 cpanel-local:test
try {
  if ((Invoke-WebRequest "http://localhost:8080/healthz").StatusCode -ne 200) {
    throw "Health check failed"
  }
  if ((Invoke-WebRequest "http://localhost:8080/cp/" -MaximumRedirection 0 -SkipHttpErrorCheck).StatusCode -ne 200) {
    throw "App shell failed"
  }
  if ((Invoke-WebRequest "http://localhost:8080/cp/signin").StatusCode -ne 200) {
    throw "SPA fallback failed"
  }
} finally {
  docker stop cpanel-test
}
```

Inspect one asset path from `dist/index.html` and verify it returns `200`.

---

### Task 2: Kubernetes Workload and Network Resources

**Files:**
- Create: `k8s/deployment.yaml`
- Create: `k8s/service.yaml`
- Create: `k8s/ingress.yaml`

**Interfaces:**
- Consumes: Container image `10.30.18.30:3033/mic/cpanel:latest` on named port `http`.
- Produces: Deployment `cpanel`, Service `cpanel`, and HTTPS Ingress `cpanel.dev.mic.internal`.

- [ ] **Step 1: Create the Deployment**

Adapt the reference Deployment with:

```yaml
metadata:
  name: cpanel
  namespace: mic-dev
  labels:
    app: cpanel
```

Use two replicas, rolling update (`maxUnavailable: 0`, `maxSurge: 1`), revision history 3, progress deadline 300 seconds, `gitea-registry`, topology spreading, container `cpanel`, image `10.30.18.30:3033/mic/cpanel:latest`, and named port `http` on `8080`.

Copy the reference `/healthz` readiness/liveness probes, resource requests/limits, UID/GID 101 security context, dropped capabilities, read-only root filesystem, and `/tmp` emptyDir mount without changing their values.

- [ ] **Step 2: Create the Service**

Create a ClusterIP Service named `cpanel` in `mic-dev`, select `app: cpanel`, expose port `80`, and target named port `http`.

- [ ] **Step 3: Create the Ingress**

Create an Nginx Ingress named `cpanel` in `mic-dev` with:

```yaml
annotations:
  cert-manager.io/cluster-issuer: mic-dev-ca
  nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

Terminate TLS for `cpanel.dev.mic.internal` using `cpanel-tls` and route prefix `/` to Service `cpanel` port `80`.

- [ ] **Step 4: Validate resource consistency**

Check that every resource uses namespace `mic-dev`, every selector and pod label is `app: cpanel`, the Jenkins deployment/container names will both be `cpanel`, and the Service target uses the Deployment's named `http` port.

If `kubectl` is available, run:

```powershell
kubectl apply --dry-run=client -f .\k8s\deployment.yaml
kubectl apply --dry-run=client -f .\k8s\service.yaml
kubectl apply --dry-run=client -f .\k8s\ingress.yaml
```

Expected: all three resources validate without contacting or modifying the live cluster.

---

### Task 3: Jenkins Build and Deployment Pipeline

**Files:**
- Create: `Jenkinsfile`

**Interfaces:**
- Consumes: Existing `package.json`, `package-lock.json`, Task 1 Docker files, and Task 2 Kubernetes manifests.
- Produces: Immutable and `latest` cPanel image tags and a branch-gated Kubernetes rollout.

- [ ] **Step 1: Create pipeline controls and environment**

Mirror the reference options (`skipDefaultCheckout`, no concurrent builds, 30-minute timeout, build retention, timestamps) and set:

```groovy
environment {
    DOCKER_REGISTRY = '10.30.18.30:3033'
    DOCKER_IMAGE = '10.30.18.30:3033/mic/cpanel'
    NAMESPACE = 'mic-dev'
    DEPLOYMENT = 'cpanel'
    CONTAINER = 'cpanel'
    VITE_API_URL = 'https://api.dev.mic.internal/api'
    VITE_CONFIG_URL = 'https://api.dev.mic.internal'
}
```

- [ ] **Step 2: Add checkout, tagging, install, and build stages**

Copy the reference checkout and immutable tag logic. Permit deployment only when the normalized branch name is `main` or `master`. Verify Node/npm and lockfiles, run `npm ci`, remove stale `dist`, and run `npm run build`.

- [ ] **Step 3: Add build-output validation**

Require `dist/index.html`, require `/cp/assets/` in that HTML, and fail if any generated file contains a localhost or `127.0.0.1` development URL.

- [ ] **Step 4: Add branch-gated registry stages**

For deployment branches only, log in with username/password credential `Gitea_Jenkins_Hub`, build both immutable and `latest` tags, and push both tags. Keep password handling under `set +x` and `--password-stdin`.

- [ ] **Step 5: Add branch-gated Kubernetes rollout**

Apply all three manifests, set:

```bash
kubectl set image \
  -n "$NAMESPACE" \
  "deployment/$DEPLOYMENT" \
  "$CONTAINER=$DOCKER_IMAGE:$IMAGE_TAG"
```

Then wait up to 120 seconds for `deployment/cpanel` rollout status.

- [ ] **Step 6: Add unconditional cleanup**

Always attempt registry logout without failing the build and clean the Jenkins workspace with deferred wipeout disabled.

- [ ] **Step 7: Review pipeline consistency**

Verify:

- Jenkins Vite variable names exactly match `src/api/config.js`.
- Docker image matches the Deployment's initial image.
- `DEPLOYMENT` and `CONTAINER` match Kubernetes names.
- Non-main/master branches never log in, build/push images, or run `kubectl`.
- Jenkins uses POSIX `sh`, matching the Linux agent assumptions in the reference.

---

### Task 4: Final Validation and Scope Review

**Files:**
- Review: all files created in Tasks 1–3
- Review: `docs/superpowers/specs/2026-08-25-cpanel-deployment-design.md`

**Interfaces:**
- Consumes: Completed deployment stack.
- Produces: Evidence that the requested files are internally consistent and buildable.

- [ ] **Step 1: Run frontend validation**

Run `npm run build` with both confirmed Vite variables and verify `dist/index.html`, `/cp/assets/`, and absence of development URLs.

- [ ] **Step 2: Run available infrastructure validation**

Build and smoke-test Docker when Docker is available. Run Kubernetes client dry-runs when `kubectl` is available. Clearly record unavailable tools rather than claiming those checks passed.

- [ ] **Step 3: Check linter diagnostics**

Read diagnostics for the newly created files and fix any introduced errors that can be resolved without changing the approved architecture.

- [ ] **Step 4: Review Git diff**

Run `git status --short` and `git diff -- .dockerignore Dockerfile nginx.conf Jenkinsfile k8s docs/superpowers`.

Expected: only the seven requested deployment files and approved planning documentation are changed; pre-existing `.vs` files remain untouched.
