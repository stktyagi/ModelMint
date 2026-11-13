FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim
# xvfb: OpenSCAD's PNG export needs a GL context, which a headless container lacks.
# tini: xvfb-run hangs waiting on SIGUSR1 if it is PID 1
RUN apt-get update \
    && apt-get install -y --no-install-recommends openscad xvfb xauth tini \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/build ./build
COPY public ./public
EXPOSE 3000
ENTRYPOINT ["tini", "--"]
CMD ["xvfb-run", "-a", "node", "build/index.js"]
