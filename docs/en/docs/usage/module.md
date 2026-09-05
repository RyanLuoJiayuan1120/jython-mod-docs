---
title: Module Structure
permalink: /en/docs/usage/module/
createTime: 2026/09/05 21:12:43
---

# Module Structure

A Python mod is a ZIP file placed in the configured `modsPaths` directory (default `{gamedir}/jymods`), which is then loaded automatically by the mod.

## ZIP Structure

```
your_mod.zip
├── config.json          # Mod metadata (optional)
├── main.py              # Common entrypoint (required)
├── client.py            # Client entrypoint (optional)
├── server.py            # Server entrypoint (optional)
└── Lib/                 # Bundled third-party pure-Python packages (optional)
    ├── requests/
    └── termcolor.py
```

> A folder containing `__init__.py` can be used instead of a `.py` file.

## Entrypoint Conventions

Each entrypoint file must define a `main()` function, which is invoked automatically when loaded:

```python
def main():
    LOGGER.info("Hello from Python!")
```

| Entrypoint | Environment | Description |
|------|------|------|
| `main.py` | common | Executed on both sides; required |
| `client.py` | client | Executed on the client only (Fabric / NeoForge) |
| `server.py` | server | Executed on the server only |

> **Paper has no client environment**: only `main.py` and `server.py` run; `client.py` is skipped. See [platforms/paper.md](../platforms/paper.md).

## Available Variables

The following variables are injected when a script runs:

| Variable | Type | Description |
|------|------|------|
| `LOGGER` | Logger | SLF4J logger, supports `info` / `warn` / `error` / `debug` |
| `ENV_TYPE` | str | Environment type: `"common"` / `"client"` / `"server"` |
| `GAME_DIR` | str | Game/server root directory path |
| `Script` | str | Absolute path of the current mod ZIP |
| `API` | ApiView | Read-only view of the public API registry (APIs registered by other Java mods); see [Public API](api.md) |

```python
def main():
    LOGGER.info("ENV=%s GAME_DIR=%s", ENV_TYPE, GAME_DIR)
    LOGGER.debug("module path: %s", Script)
    # Call an API registered by another Java mod (see docs/usage/api.md)
    api = API["mymod"]["TradeApi"]
    api.greet("Python")
```

> Note: `LOGGER` calls support SLF4J-style `{}` placeholders, and Python's `%` formatting works too.

## Mod Metadata (config.json)

Optional. Used for log display of the mod name and dependencies:

```json
{
  "name": "My Mod",
  "version": "1.0.0",
  "dependencies": ["termcolor"]
}
```

- `name` / `version`: only used for log display.
- `dependencies`: list of third-party package names bundled in `Lib/`, used for log validation.

## Related Documents

- Helper library APIs: [libs.md](libs.md)
- Bundling third-party packages: [packages.md](packages.md)
