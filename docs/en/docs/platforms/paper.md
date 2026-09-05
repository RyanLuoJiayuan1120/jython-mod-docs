---
title: Paper Platform
permalink: /en/docs/platforms/paper/
createTime: 2026/09/05 21:06:31
---

# Paper Platform

## Overview

Paper (Bukkit) is a **server-only** plugin platform. Compared with Fabric / NeoForge it has significant differences:

- **No client environment**: only `main` + `server` environments run; `client.py` is skipped.
- **Python targets the `org.bukkit.*` API**: `net.minecraft.*` classes are not visible to plugins, so Python mods should use the Bukkit API (`org.bukkit.Bukkit`, `org.bukkit.World`, etc.).
- **No bytecode transformation**: server classes are loaded before the plugin is enabled, and there is no transformer SPI, so `BytecodeHelper` is unavailable.
- **No config GUI**: Gson reads the config file directly.
- **Resource pack / data pack generation is skipped.**

## Entrypoints and Load Timing

- Entrypoint class: `net.luojiayuan.jython.mod.JythonModPaper` (`JavaPlugin`)
- Load timing: on `onEnable()`, runs `main` (common environment) then `server` (server environment) in order.
- Plugin metadata is in `paper-plugin.yml` (`api-version: '1.21'`).

## Class Names and Mapping

Paper uses official (Mojang) class names, and the Bukkit API needs no mapping. `usesOfficialMappings()` returns `true`, so class names pass through directly.

## Configuration

- No Cloth Config; the plugin uses Gson to read `{gamedir}/config/jython-mod.json` directly (`{gamedir}` = server root directory).
- Defaults are used when the file is missing; changes take effect after a server restart.
- Fields are the same as Fabric / NeoForge; see [config.md](../usage/config.md).

## Bytecode Transformation

**Not supported.** Core classes are already loaded at server startup, so bytecode cannot be transformed after the plugin is enabled.

## Resource Packs / Data Packs

**Not supported.** Resource pack and data pack generation are skipped at load time.

## Build and Deployment

```bash
./gradlew paperJar
```

Artifact: `build/libs/jython-mod-<version>-paper.jar` (bundles the GraalPy runtime + Cloth Config interface classes + shared resources).

Deployment:

1. Put the `-paper.jar` in the server's `plugins/` folder.
2. Put the Python module ZIP in the `plugins/jymods/` folder (the `modsPaths` config defaults to `{gamedir}/jymods`, where `{gamedir}` is the server root directory).
3. Start the server.

> The plugin is a self-contained fat jar with no extra dependencies.

## Example: Bukkit API Usage

```python
from org.bukkit import Bukkit

def main():
    server = Bukkit.getServer()
    LOGGER.info("server=%s version=%s", server.getName(), server.getVersion())
    world = server.getWorlds().get(0)
    LOGGER.info("world=%s", world.getName())
```

> Reflection via `McReflect.call()` also works for `org.bukkit.*` classes, for example
> `McReflect.call("org.bukkit.Bukkit", "getServer", None)` (see [special-syntax.md](../special-syntax.md)).
