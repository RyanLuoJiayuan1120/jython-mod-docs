---
title: Troubleshooting
permalink: /en/docs/TROUBLESHOOTING/
createTime: 2026/09/05 21:06:31
---

# Troubleshooting

## Debugging

Enable debug mode to get detailed logs:

1. Open `config/jython-mod.json`
2. Set `debugMode` to `true`
3. Restart the game / server

## Common Issues

### Module fails to load

1. Check that the ZIP file contains `main.py` (or a `main/` folder with `__init__.py`)
2. Confirm the ZIP file is in the `jymods/` directory (for Paper: `plugins/jymods/`)
3. Check the log (`logs/latest.log`) for detailed error information

### Method / constructor not found

If using `McReflect.call()` produces `找不到方法：<init>` or a similar error:

- Constructors must use `"<init>"` as the method name
- Make sure the number and types of arguments match the target method
- Use `$` for nested class names (e.g. `BlockBehaviour$Properties`)
- Check the mapping information in the log to confirm the class name resolved correctly

### `from net.minecraft.xxx import Yyy` error

If importing Minecraft classes directly fails:

1. Confirm the class name is spelled correctly (nested classes can use `.` or `$`)
2. Check whether the log contains `McReflect import hook registered`
3. In production, class mapping is handled automatically by `McReflect`; if it still fails, fall back to `McReflect.call()` or `McReflect.getClassName()` to diagnose
4. **Paper platform**: `net.minecraft.*` is not visible to plugins; use the `org.bukkit.*` API instead (see [platforms/paper.md](platforms/paper.md))

### Plugin class reports `'JavaPackage' object is not callable` (Paper)

When GraalPy's host class loader cannot see the plugin's own classes, it returns a JavaPackage instead of a host class. Make sure you're using the latest plugin jar (the hostClassLoader issue is fixed); if it still occurs, check that the class name in the `java.type()` / import statement is complete.

## About Bytecode Transformation (Mixin / Coremod)

> Traditionally, Mixin / coremod game code modifications could only be written in Java.

This project does **not support** writing Mixin classes directly in Python, but it provides the `BytecodeHelper` bytecode transformation mechanism: you can register custom transformers in GraalPy to further modify class bytecode after Mixin transformation completes, achieving a similar code-injection effect.

Platform differences:

- **Fabric**: takes effect via a post-Mixin transformation hook (`BytecodeHook`, registered at preLaunch)
- **NeoForge**: takes effect via the coremod mechanism (`NeoForgeBytecodeProcessor`, `ClassProcessor` SPI)
- **Paper**: bytecode transformation is **not supported** (server classes are loaded before the plugin is enabled, and there is no transformer SPI)

See the BytecodeHelper section of [usage/libs.md](usage/libs.md) and the platform docs under [platforms](../platforms/).
