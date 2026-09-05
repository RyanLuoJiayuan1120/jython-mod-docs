---
title: Third-Party Python Packages
permalink: /en/docs/usage/packages/
createTime: 2026/09/05 21:12:58
---

# Third-Party Python Packages

Each Python mod can declare dependencies in its `config.json` and bundle the package files in the `Lib/` directory of the ZIP. When the game loads the mod, it automatically extracts `Lib/` into `{gamedir}/graalpy/Lib` and adds it to the Python search path.

## Mod ZIP Structure

```
your_mod.zip
├── config.json          # Mod config file
├── main.py              # Common entrypoint
├── client.py            # Client entrypoint (optional)
├── server.py            # Server entrypoint (optional)
└── Lib/                 # Third-party pure-Python packages
    ├── requests/
    └── termcolor.py
```

## config.json Format

```json
{
  "name": "My Mod",
  "version": "1.0.0",
  "dependencies": ["requests", "termcolor"]
}
```

- `name` / `version`: mod name and version, used only for log display.
- `dependencies`: list of third-party package names bundled in `Lib/`, used for log validation.

## Bundling Packages

Use any local Python runtime:

```bash
pip install --target ./Lib requests termcolor
```

Then bundle the `Lib/` directory together with `config.json` into the ZIP. As long as the packages are pure Python, they run cross-platform and require no network access on the player side.

## Config Option

The package deployment directory can be changed in the config file (default `{gamedir}/graalpy/Lib`):

```json
{
  "pythonPackagesPath": "{gamedir}/graalpy/Lib"
}
```

Changes require a game restart. See [config.md](config.md) for the field description.

## Notes

- Only packages bundled in the mod ZIP are supported; downloading from PyPI at runtime is not supported.
- Packages with C extensions must be recompiled for GraalPy and are not recommended for distribution through this mechanism.
- When multiple mods carry different versions of the same dependency, the version loaded first wins.

## Related Documents

- Configuration: [config.md](config.md)
