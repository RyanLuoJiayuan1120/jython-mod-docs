---
title: NeoForge Platform
permalink: /en/docs/platforms/neoforge/
createTime: 2026/09/05 21:06:31
---

# NeoForge Platform

## Overview

NeoForge supports full client + server environments, the Cloth Config GUI, and resource pack / data pack generation; bytecode transformation is implemented via the coremod mechanism.

## Entrypoints and Load Timing

- Entrypoint class: `net.luojiayuan.jython.mod.JythonModNeoForge` (`@Mod("jythonmod")`)
- **Registration timing difference**: NeoForge freezes the registry during mod construction, so Python mods cannot register items/blocks in the constructor. Therefore `main` (common environment) is deferred to the **`RegisterEvent`** phase (when the registry is writable), while `client` / `server` environments run in `FMLClientSetupEvent` / `FMLDedicatedServerSetupEvent` respectively (determined by `FMLEnvironment.getDist()`).
- Each environment runs only once (guarded by `AtomicBoolean`).

## Class Names and Mapping

NeoForge uses **official (Mojang) mappings**; class names match the Yarn names in 1.21.11 and can be used directly, with no intermediary conversion needed.

## Configuration

- Cloth Config, config file `config/jython-mod.json`, supports an in-game GUI.
- Dependency declaration: `META-INF/neoforge.mods.toml` requires `cloth_config >= 21.11.152`.

## Bytecode Transformation

Supported, via the coremod mechanism: `NeoForgeBytecodeProcessor` implements the `ClassProcessor` SPI (`META-INF/services/net.neoforged.neoforgespi.transformation.ClassProcessor`) and processes class bytecode after Mixin and COMPUTING_FRAMES. The Python side still uses `BytecodeHelper.registerTransformer()` (see [libs.md](../usage/libs.md)).

## Resource Packs / Data Packs

Supported. Same as Fabric (see [resources.md](../usage/resources.md)).

## Build and Deployment

```bash
./gradlew neoforgeJar
```

Artifact: `build/libs/jython-mod-<version>-neoforge.jar` (bundles the GraalPy runtime and the coremod service file).

Deployment: put the JAR in the `mods/` folder, put the Python module ZIP in the `jymods/` folder, then start the game.

> Dependencies: NeoForge >= 21.11, Minecraft [1.21.11, 1.22), Cloth Config. See `neoforge.mods.toml`.
