---
title: Special Syntax and Features
permalink: /en/docs/special-syntax/
createTime: 2026/09/05 21:06:32
---

# Special Syntax and Features

This mod uses **GraalPy (Python 3)** as its scripting engine. This document only covers syntax and features **specific to this mod** — i.e. the parts related to Java interop. For general Python syntax (variables, loops, conditionals, collections, etc.), refer to the official Python documentation.

## Importing Java Classes

Python can import Java classes directly:

```python
from net.minecraft.world.item import Item
from net.minecraft.world.level.block import Block
from net.minecraft.resources import Identifier

item = Item()
id = Identifier.fromNamespaceAndPath("mymod", "my_item")
```

**Automatic Minecraft class mapping**: the mod registers an import hook (McReflectFinder) for `net.minecraft.*`, `com.mojang.*`, and `net.fabricmc.*`. In production (where class names are obfuscated), the `from net.minecraft.xxx import Yyy` statements above are automatically resolved by McReflect to the corresponding runtime class names — no manual mapping required.

> Platform differences: in production, Fabric maps to intermediary names, NeoForge uses official names (pass-through), and Paper targets `org.bukkit.*`. See [platforms](../platforms/) for details.

Other Java classes can be obtained with `java.type()`:

```python
import java
ArrayList = java.type('java.util.ArrayList')
```

## Nested Class Access

Nested classes support both `.` and `$` notations, resolved automatically:

```python
from net.minecraft.world.item import Item

# 两种写法等价
props = Item.Properties()
props2 = Item$Properties()  # 或直接写 $ 形式
```

Accessing nested members of host classes directly in GraalPy can fail (especially in production, where they are obfuscated to `class_1792$class_1793`); the mod wraps them via `JavaClassRef` to automatically try both the `.` and `$` forms, falling back to `McReflect.call`.

> If importing nested classes directly fails, use the `MinecraftClasses` shortcuts (`mc.Item_Properties`) or `McReflect` (see below).

## McReflect — Reflection Calls

`McReflect` provides reflection calls by class-name string, suitable for dynamic calls, constructors, field access, and classes outside `net.minecraft.*` / `com.mojang.*` / `org.bukkit.*`.

```python
from net.luojiayuan.jython.mod.mapping import McReflect

# 调用静态方法
id = McReflect.call(
    "net.minecraft.resources.Identifier",
    "fromNamespaceAndPath",
    None,          # 实例；静态方法传 None
    "mymod",
    "my_block"
)

# 调用构造函数（方法名使用 "<init>"）
settings = McReflect.call(
    "net.minecraft.world.level.block.state.BlockBehaviour$Properties",
    "<init>",
    None
)

# 调用实例方法
server = McReflect.call("org.bukkit.Bukkit", "getServer", None)
world = McReflect.call("org.bukkit.World", "getName", server)
```

### Method Signature

```python
McReflect.call(className, methodName, instance, *args)
```

- `className`: the fully qualified class name (nested classes can use `.` or `$`).
- `methodName`: the method name; use `"<init>"` for constructors.
- `instance`: the instance object; pass `None` for static methods / constructors.
- `args`: variadic arguments, auto-matched to overloads with type narrowing.

### Other Methods

| Method | Description |
|------|------|
| `McReflect.getClassName(yarnClass)` | Returns the runtime class name (string); throws if not mapped |
| `McReflect.getClass(yarnClass)` | Returns the Java `Class` object |

> When a method / constructor is not found, check the number and types of arguments, the nested class name notation (`$`), and the class mapping result in the log.

## Static Member Access

```python
# 静态字段
from net.minecraft.core.registries import BuiltInRegistries
registry = BuiltInRegistries.ITEM

# 静态方法
from net.minecraft.resources import Identifier
id = Identifier.of("mod", "item")
```

## Subclassing Java Classes / Implementing Java Interfaces

GraalPy supports Python classes subclassing Java classes and implementing Java interfaces:

```python
from net.minecraft.world.item import Item

class CustomItem(Item):
    def __init__(self, props):
        Item.__init__(self, props)

    def useOn(self, context):
        LOGGER.info("CustomItem used!")
        return Item.useOn(self, context)
```

Implementing interfaces:

```python
import java
Runnable = java.type('java.lang.Runnable')

# 方式1：Python 函数自动适配
def my_run():
    print("run!")
runnable = my_run

# 方式2：显式实现接口
class MyRunnable(Runnable):
    def run(self):
        print("run!")

runnable = MyRunnable()
```

## Lambdas and Callbacks

GraalPy automatically adapts Python functions to Java functional interfaces:

```python
# Java: Function<Item.Properties, Item> factory = props -> new Item(props);
factory = lambda props: Item(props)

# Java: items.forEach(System.out::println);
for item in items:
    print(item)
```

## Other Interop Tips

- **Overloaded methods**: the engine automatically selects the best match (e.g. `System.out.println` with str / int / Object).
- **Java arrays**: Python lists are converted automatically; you can also use `java.type('java.lang.String[]')`.
- **Generics**: no generic declaration is needed in Python — `map = HashMap(); map.put("key", 123)` infers types automatically.
- **Exception handling**: Java exceptions can be caught directly in Python with `except Exception as e`; `str(e)` gives the message.

## Related Documents

- Helper library API (item / block / MinecraftClasses / BytecodeHelper): [usage/libs.md](usage/libs.md)
- Module structure (entrypoints, available variables): [usage/module.md](usage/module.md)
