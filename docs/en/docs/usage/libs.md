---
title: Helper Library APIs
permalink: /en/docs/usage/libs/
createTime: 2026/09/05 21:07:34
---

# Helper Library APIs

The helper libraries live in the `net.luojiayuan.jython.mod.libs` package and provide item/block registration and quick class references.

> Where other common APIs belong:
> - `McReflect` (reflection calls) → [special-syntax.md](../special-syntax.md)
> - `GameDirHelper` (directory utilities) → [utils section](#other-utility-classes)
> - `BytecodeHelper` (bytecode transformation) → [BytecodeHelper section](#bytecodehelper-—-bytecode-transformation)

## item — Item Registration

```python
from net.minecraft.world.item import Item
from net.luojiayuan.jython.mod.libs import item

my_item = item.register("my_item", "mymod", lambda: Item(), Item.Properties())
```

Signature:

```python
item.register(name, modid, itemFactory, settings)
```

| Parameter | Type | Description |
|------|------|------|
| `name` | str | Item name (without the mod ID prefix) |
| `modid` | str | Mod ID |
| `itemFactory` | callable | Item factory function that receives `Item.Properties` and returns an item instance |
| `settings` | `Item.Properties` | Item properties |

Returns the registered item instance. If the item is already registered, the existing instance is returned directly (no duplicate registration).

## block — Block Registration

```python
from net.minecraft.world.level.block import Block
from net.minecraft.world.level.block.state import BlockBehaviour
from net.luojiayuan.jython.mod.libs import block

props = BlockBehaviour.Properties.of()

# 注册方块 + 对应物品
my_block = block.register("my_block", "mymod", lambda p: Block(p), props, True)

# 仅注册方块（技术性方块，无物品）
tech_block = block.register("tech_block", "mymod", lambda p: Block(p), props, False)
```

Signature:

```python
block.register(name, modid, blockFactory, settings, shouldRegisterItem)
```

| Parameter | Type | Description |
|------|------|------|
| `name` | str | Block name (without the mod ID prefix) |
| `modid` | str | Mod ID |
| `blockFactory` | callable | Block factory function that receives `BlockBehaviour.Properties` and returns a block instance |
| `settings` | `BlockBehaviour.Properties` | Block properties |
| `shouldRegisterItem` | bool | Whether to also register the corresponding block item |

## MinecraftClasses — Quick Class References

Used to bypass GraalPy's limitation on nested-class-name resolution, providing common Minecraft classes as static fields:

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc

props = mc.Block_Properties.of()
block = mc.Block(props)

item_props = mc.Item_Properties()
item = mc.Item(item_props)
```

| Field | Corresponding class |
|------|--------|
| `mc.Block` | `net.minecraft.world.level.block.Block` |
| `mc.Block_Properties` | `BlockBehaviour.Properties` |
| `mc.Item` | `net.minecraft.world.item.Item` |
| `mc.Item_Properties` | `Item.Properties` |
| `mc.BlockItem` | `net.minecraft.world.item.BlockItem` |

Static factory methods are also provided: `mc.createBlockProperties()`, `mc.createBlock(props)`, `mc.createItemProperties()`, `mc.createItem(props)`.

> For the nested-class `.` / `$` notations, see the nested class access section in [special-syntax.md](../special-syntax.md); the modern style `from net.minecraft.world.item import Item.Properties` usually works too.

## BytecodeHelper — Bytecode Transformation

Registers a custom bytecode transformer during the class-loading phase (continuing to modify class bytecode after Mixin transformation).

```python
from net.luojiayuan.jython.mod.bytecode import BytecodeHelper

def my_transform(className, classBytes):
    # className: 类的全限定名，如 "net.minecraft.class_1234"
    # classBytes: 字节数组
    # 返回修改后的字节数组，无需修改则直接返回 classBytes
    LOGGER.info("Transforming: " + className)
    return classBytes

BytecodeHelper.registerTransformer(my_transform)
```

> **Platform differences**: the mechanism by which bytecode transformation takes effect varies by platform — Fabric uses a post-Mixin transformation hook, NeoForge uses a coremod (`NeoForgeBytecodeProcessor`), and **Paper does not support bytecode transformation**. See [platforms](../platforms/) for details.

## Other Utility Classes

- `GameDirHelper` (`net.luojiayuan.jython.mod.utils`) — game directory utilities:

```python
from net.luojiayuan.jython.mod.utils import GameDirHelper

game_dir = GameDirHelper.getGameDirPath()
mods_dir = GameDirHelper.getModsDirPath()
config_dir = GameDirHelper.getConfigDirPath()
```

  Common methods: `getGameDirPath()` / `getModsDirPath()` / `getConfigDirPath()` / `getSavesDirPath()` / `getSubDirPath(sub)`, etc.

## Related Documentation

- Reflection calls (`McReflect`): [special-syntax.md](../special-syntax.md)
- Module structure: [module.md](module.md)
