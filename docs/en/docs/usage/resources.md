---
title: Resource Packs and Data Packs
permalink: /en/docs/usage/resources/
createTime: 2026/09/05 21:13:05
---

# Resource Packs and Data Packs

The mod automatically extracts resources from a mod ZIP and generates a resource pack and a data pack. **This feature is only supported on Fabric / NeoForge; Paper skips resource pack and data pack generation** (see [platforms/paper.md](../platforms/paper.md)).

## Resource Pack

The mod automatically extracts resource files from the ZIP and generates `resourcepacks/JythonModAssets.zip`.

Supported resource folders:

```
assets
atlases
blockstates
equipment
font
items
lang
models
particles
post_effect
sounds
shaders
texts
textures
waypoint_style
```

Supported root files:

```
gpu_warnlist.json
regional_compliancies.json
sounds.json
```

## Data Pack

Include a `data/` folder in the ZIP:

```
your_mod.zip
└── data/
    └── your_namespace/
        ├── functions/
        ├── loot_tables/
        └── ...
```

The generated data pack is automatically copied into the `datapacks/` folder of every save.

## Related Documents

- Platform differences: [platforms](../platforms/)
