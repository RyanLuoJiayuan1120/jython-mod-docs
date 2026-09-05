---
title: Configuration
permalink: /en/docs/usage/config/
createTime: 2026/09/05 21:12:51
---

# Configuration

## Config File Locations

| Platform | Path | Reading Method |
|------|------|----------|
| Fabric | `config/jython-mod.json` | Cloth Config (with in-game GUI) |
| NeoForge | `config/jython-mod.json` | Cloth Config (with in-game GUI) |
| Paper | `{gamedir}/config/jython-mod.json` | Gson direct read (no GUI) |

- Fabric / NeoForge use Cloth Config. A default config is generated automatically on first launch and can be edited from the in-game mod settings screen.
- Paper has no Cloth Config; the plugin reads the same-named fields directly with Gson. If the file is missing, defaults are used; changes require a server restart.
- Field names and defaults are identical across all three platforms, so a single config can be reused everywhere.

## Fields

```json
{
  "enabled": true,
  "debugMode": false,
  "scriptPath": "/assets/jython-mod/jython/main.py",
  "showPythonOutput": true,
  "pythonPath": "",
  "modsPaths": "{gamedir}/jymods",
  "pythonPackagesPath": "{gamedir}/graalpy/Lib"
}
```

| Field | Description | Default |
|------|------|--------|
| `enabled` | Whether the mod is enabled | `true` |
| `debugMode` | Debug mode; outputs detailed logs | `false` |
| `scriptPath` | Main script path (currently unused, kept for compatibility) | `/assets/jython-mod/jython/main.py` |
| `showPythonOutput` | Whether to show Python output in the console | `true` |
| `pythonPath` | Additional Python system path (comma-separated) | `""` |
| `modsPaths` | Mod search paths; multiple paths separated by `;` | `{gamedir}/jymods` |
| `pythonPackagesPath` | Deployment directory for third-party Python packages | `{gamedir}/graalpy/Lib` |

> The `{gamedir}` placeholder is replaced with the game/server root directory of the current platform.
>
> The `autoReload` and `scriptTimeout` options from older versions have been removed; do not use them.

## Related Documents

- Platform differences (GUI support, path resolution): [platforms](../platforms/)
- Third-party package deployment directory: [packages.md](packages.md)
