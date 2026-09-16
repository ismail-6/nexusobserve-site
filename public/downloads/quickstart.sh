#!/usr/bin/env sh
# NexusObserve CE all-in-one Docker quickstart.
#
# Usage:
#   curl -fsSL <SITE_URL>/downloads/quickstart.sh | sh
#
# This installer writes a small Docker Compose stack with Postgres, ClickHouse,
# and NexusObserve, then starts it. Docker is the only runtime dependency.

set -eu

APP_NAME="nexusobserve"
INSTALL_DIR="${NEXUSOBSERVE_INSTALL_DIR:-${HOME:-/opt}/nexusobserve}"
VERSION="${NEXUSOBSERVE_VERSION:-latest}"
IMAGE="${NEXUSOBSERVE_IMAGE:-nexusobserve/nexusobserve:${VERSION}}"
HTTP_PORT="${NEXUSOBSERVE_HTTP_PORT:-8080}"
OTLP_GRPC_PORT="${NEXUSOBSERVE_OTLP_GRPC_PORT:-4317}"
OTLP_HTTP_PORT="${NEXUSOBSERVE_OTLP_HTTP_PORT:-4318}"
AGENT_PORT="${NEXUSOBSERVE_AGENT_PORT:-9090}"
PUBLIC_HOST="${NEXUSOBSERVE_PUBLIC_HOST:-localhost}"
FORCE=0
PULL=1
WAIT=1
DOCKER_SUDO=""

info() { printf '%s\n' "-> $*"; }
warn() { printf '%s\n' "WARN: $*" >&2; }
fail() { printf '%s\n' "ERROR: $*" >&2; exit 1; }

usage() {
  cat <<'EOF'
NexusObserve CE quickstart

Options:
  --dir DIR              Install directory (default: ~/nexusobserve)
  --version VERSION      NexusObserve image tag (default: latest)
  --image IMAGE          Full image reference (overrides --version)
  --http-port PORT       Host portal port (default: 8080)
  --otlp-grpc-port PORT  Host OTLP gRPC port (default: 4317)
  --otlp-http-port PORT  Host OTLP HTTP port (default: 4318)
  --agent-port PORT      Host agent transport port (default: 9090)
  --public-host HOST     Hostname printed in the final URL (default: localhost)
  --force                Regenerate .env, including database passwords
  --no-pull              Skip docker compose pull before starting
  --no-wait              Do not wait for /api/health
  -h, --help             Show this help

Environment variables use the same names as the long flags, prefixed with
NEXUSOBSERVE_, for example NEXUSOBSERVE_HTTP_PORT=18080.
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dir) INSTALL_DIR="$2"; shift 2 ;;
    --version) VERSION="$2"; IMAGE="nexusobserve/nexusobserve:$2"; shift 2 ;;
    --image) IMAGE="$2"; shift 2 ;;
    --http-port) HTTP_PORT="$2"; shift 2 ;;
    --otlp-grpc-port) OTLP_GRPC_PORT="$2"; shift 2 ;;
    --otlp-http-port) OTLP_HTTP_PORT="$2"; shift 2 ;;
    --agent-port) AGENT_PORT="$2"; shift 2 ;;
    --public-host) PUBLIC_HOST="$2"; shift 2 ;;
    --force) FORCE=1; shift ;;
    --no-pull) PULL=0; shift ;;
    --no-wait) WAIT=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *) fail "unknown option: $1" ;;
  esac
done

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "$1 is required"
}

docker_cmd() {
  if [ -n "$DOCKER_SUDO" ]; then
    sudo docker "$@"
  else
    docker "$@"
  fi
}

compose_cmd() {
  if docker_cmd compose version >/dev/null 2>&1; then
    docker_cmd compose "$@"
    return
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    if [ -n "$DOCKER_SUDO" ]; then
      sudo docker-compose "$@"
    else
      docker-compose "$@"
    fi
    return
  fi
  fail "Docker Compose is required. Install the Docker Compose plugin and retry."
}

random_alnum() {
  len="$1"
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 64 | tr -dc 'A-Za-z0-9' | cut -c "1-${len}"
    printf '\n'
    return
  fi
  if [ -r /dev/urandom ]; then
    LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c "$len"
    printf '\n'
    return
  fi
  fail "openssl or /dev/urandom is required to generate passwords"
}

random_b64_32() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -base64 32
    return
  fi
  if [ -r /dev/urandom ] && command -v base64 >/dev/null 2>&1; then
    dd if=/dev/urandom bs=32 count=1 2>/dev/null | base64 | tr -d '\n'
    printf '\n'
    return
  fi
  fail "openssl or /dev/urandom plus base64 is required to generate the secrets key"
}

write_env() {
  env_file="$1"
  if [ -f "$env_file" ] && [ "$FORCE" -ne 1 ]; then
    info "Using existing $env_file"
    return
  fi

  umask 077
  cat > "$env_file" <<EOF
COMPOSE_PROJECT_NAME=${APP_NAME}
NEXUSOBSERVE_IMAGE=${IMAGE}
NEXUSOBSERVE_HTTP_PORT=${HTTP_PORT}
NEXUSOBSERVE_OTLP_GRPC_PORT=${OTLP_GRPC_PORT}
NEXUSOBSERVE_OTLP_HTTP_PORT=${OTLP_HTTP_PORT}
NEXUSOBSERVE_AGENT_PORT=${AGENT_PORT}
NEXUSOBSERVE_LOG_LEVEL=info
NEXUSOBSERVE_SECRETS_KEY=$(random_b64_32)
POSTGRES_DB=nexusobserve
POSTGRES_USER=nexusobserve
POSTGRES_PASSWORD=$(random_alnum 32)
CLICKHOUSE_DB=nexusobserve
CLICKHOUSE_USER=nexusobserve
CLICKHOUSE_PASSWORD=$(random_alnum 32)
EOF
  info "Wrote $env_file"
}

write_compose() {
  compose_file="$1"
  cat > "$compose_file" <<'EOF'
name: nexusobserve

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"$${POSTGRES_USER}\" -d \"$${POSTGRES_DB}\""]
      interval: 10s
      timeout: 5s
      retries: 12

  clickhouse:
    image: clickhouse/clickhouse-server:24.8-alpine
    restart: unless-stopped
    environment:
      CLICKHOUSE_DB: ${CLICKHOUSE_DB}
      CLICKHOUSE_USER: ${CLICKHOUSE_USER}
      CLICKHOUSE_PASSWORD: ${CLICKHOUSE_PASSWORD}
      CLICKHOUSE_DEFAULT_ACCESS_MANAGEMENT: "1"
    volumes:
      - clickhouse_data:/var/lib/clickhouse
    healthcheck:
      test: ["CMD-SHELL", "clickhouse-client --user \"$${CLICKHOUSE_USER}\" --password \"$${CLICKHOUSE_PASSWORD}\" --query 'SELECT 1'"]
      interval: 10s
      timeout: 5s
      retries: 12

  nexusobserve:
    image: ${NEXUSOBSERVE_IMAGE}
    command: ["--log-level", "${NEXUSOBSERVE_LOG_LEVEL:-info}"]
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      clickhouse:
        condition: service_healthy
    environment:
      NEXUSOBSERVE_DB_URL: "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?sslmode=disable"
      NEXUSOBSERVE_CH_URL: "clickhouse://${CLICKHOUSE_USER}:${CLICKHOUSE_PASSWORD}@clickhouse:9000/${CLICKHOUSE_DB}?dial_timeout=10s&read_timeout=30s&compress=true"
      NEXUSOBSERVE_SECRETS_KEY: ${NEXUSOBSERVE_SECRETS_KEY}
      NEXUSOBSERVE_LOG_LEVEL: ${NEXUSOBSERVE_LOG_LEVEL:-info}
    ports:
      - "${NEXUSOBSERVE_HTTP_PORT}:8080"
      - "${NEXUSOBSERVE_OTLP_GRPC_PORT}:4317"
      - "${NEXUSOBSERVE_OTLP_HTTP_PORT}:4318"
      - "${NEXUSOBSERVE_AGENT_PORT}:9090"
    volumes:
      - nexusobserve_data:/home/nonroot/.nexusobserve

volumes:
  postgres_data:
  clickhouse_data:
  nexusobserve_data:
EOF
  info "Wrote $compose_file"
}

wait_for_health() {
  url="http://127.0.0.1:${NEXUSOBSERVE_HTTP_PORT}/api/health"
  if ! command -v curl >/dev/null 2>&1; then
    warn "curl not found; skipping health check"
    return
  fi

  info "Waiting for NexusObserve health at $url"
  i=1
  while [ "$i" -le 60 ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return
    fi
    sleep 2
    i=$((i + 1))
  done
  warn "NexusObserve is still starting. Check logs with the command below."
}

need_cmd docker
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    DOCKER_SUDO="1"
    docker_cmd info >/dev/null 2>&1 || fail "cannot access the Docker daemon, even with sudo"
  else
    fail "cannot access the Docker daemon. Add this user to the docker group or run with sudo."
  fi
fi

mkdir -p "$INSTALL_DIR"
ENV_FILE="${INSTALL_DIR}/.env"
COMPOSE_FILE="${INSTALL_DIR}/compose.yml"

write_env "$ENV_FILE"
write_compose "$COMPOSE_FILE"

# Load the generated or existing env so printed URLs and health checks reflect it.
# shellcheck disable=SC1090
. "$ENV_FILE"

cd "$INSTALL_DIR"
if [ "$PULL" -eq 1 ]; then
  info "Pulling container images"
  compose_cmd -f "$COMPOSE_FILE" pull
fi

info "Starting NexusObserve"
compose_cmd -f "$COMPOSE_FILE" up -d

if [ "$WAIT" -eq 1 ]; then
  wait_for_health
fi

if [ -n "$DOCKER_SUDO" ]; then
  DOCKER_PREFIX="sudo docker"
else
  DOCKER_PREFIX="docker"
fi

cat <<EOF

NexusObserve is deployed.

Open:  http://${PUBLIC_HOST}:${NEXUSOBSERVE_HTTP_PORT}
Setup: create the first admin user in the browser.

Manage:
  cd ${INSTALL_DIR}
  ${DOCKER_PREFIX} compose ps
  ${DOCKER_PREFIX} compose logs -f nexusobserve

Upgrade:
  cd ${INSTALL_DIR}
  ${DOCKER_PREFIX} compose pull
  ${DOCKER_PREFIX} compose up -d

Stop:
  cd ${INSTALL_DIR}
  ${DOCKER_PREFIX} compose down

EOF
