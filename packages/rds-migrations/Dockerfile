FROM postgres:17

# 1) Install CA certs, build tools & pgvector, then clean up
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    build-essential \
    postgresql-server-dev-17 \
    && update-ca-certificates \
    \
    # 2) Clone & install pgvector
    && git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git /tmp/pgvector \
    && cd /tmp/pgvector \
    && make \
    && make install \
    \
    # 3) Clean up
    && cd / \
    && rm -rf /tmp/pgvector \
    && apt-get purge -y --auto-remove git build-essential \
    && rm -rf /var/lib/apt/lists/*

# Expose the default port
EXPOSE 5432
