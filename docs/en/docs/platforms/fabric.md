---
title: Fabric Platform
permalink: /en/docs/platforms/fabric/
createTime: 2026/09/05 21:06:31
---

# Fabric Platform

## Overview

Fabric is the mod's primary target platform, supporting full client + server environments, the Cloth Config GUI, resource pack / data pack generation, and bytecode transformation.

## Entrypoints and Load Timing

- Entrypoint class: `net.luojiayuan.jython.mod.Jythonmod` (`ModInitializer`)
- Load timing:
  - `main` (common environment): runs in `onInitialize()`
  - `client` (client environment): runs in `JythonModClient` (`ClientModInitializer`)
  - `server` (server environment): runs in `JythonModServer` (`DedicatedServerModInitializer`)
- Registered entries are listed in the `entrypoints` of `fabric.mod.json`.

## Class Names and Mapping

In production, Minecraft class names are **intermediary** (e.g. `class_1792`). The mod bundles a McReflect import hook, so `from net.minecraft.xxx import Yyy` is automatically mapped to the runtime class name — no manual handling required.

- In the development environment (`runClient` / `runServer`), Yarn names are used directly.
- In production, names are automatically converted via `mappings.tiny` (mojmap→intermediary).

## Configuration

- Cloth Config, config file `config/jython-mod.json`, supports an in-game GUI.
- Dependency declaration: the `depends` of `fabric.mod.json` requires `cloth-config >= 21.11.153`.

## Bytecode Transformation

Supported. Transformers registered via `BytecodeHelper.registerTransformer()` run after Mixin transformation completes (see the BytecodeHelper section of [libs.md](../usage/libs.md)).

## Resource Packs / Data Packs

Supported. The mod automatically extracts resources from the module ZIP to generate resource packs and data packs (see [resources.md](../usage/resources.md)).

## Build and Deployment

```bash
./gradlew build
```

Artifact: `build/libs/jython-mod-<version>.jar` (bundles the GraalPy runtime, ~56MB).

Deployment: put the JAR in the `mods/` folder, put the Python module ZIP in the `jymods/` folder, then start the game.

> Dependencies: Fabric Loader >= 0.18.4, Fabric API, Cloth Config. See the `depends` of `fabric.mod.json`.
