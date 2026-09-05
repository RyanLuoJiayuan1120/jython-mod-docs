---
title: Java-to-Jython Code Conversion Tutorial
createTime: 2026/04/04 21:28:14
permalink: /en/docs/lm1kuhiw/
---

This tutorial explains how to convert Java code to Jython (Python for Java) code, specifically for this Minecraft Fabric mod development project.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Basic Conversion Rules](#basic-conversion-rules)
3. [Type Conversion](#type-conversion)
4. [Importing Java Classes](#importing-java-classes)
5. [Practical Examples](#practical-examples)
6. [Common Issues](#common-issues)

---

## Environment Setup

Jython is a Java implementation of the Python language. It can:
- directly import and use Java classes
- subclass Java classes
- implement Java interfaces
- call Java methods

In this project, the Jython environment is already configured, and Python scripts live in the `src/main/resources/assets/jython-mod/jython/` directory.

---

## Basic Conversion Rules

### 1. Variable Declarations

**Java:**
```java
String name = "Steve";
int count = 42;
boolean isActive = true;
```

**Jython:**
```python
name = "Steve"
count = 42
isActive = True
```

### 2. Method Definitions

**Java:**
```java
public void greet(String name) {
    System.out.println("Hello, " + name);
}

public int add(int a, int b) {
    return a + b;
}
```

**Jython:**
```python
def greet(name):
    print("Hello, " + name)

def add(a, b):
    return a + b
```

### 3. Conditionals

**Java:**
```java
if (value > 10) {
    System.out.println("Large");
} else if (value > 5) {
    System.out.println("Medium");
} else {
    System.out.println("Small");
}
```

**Jython:**
```python
if value > 10:
    print("Large")
elif value > 5:
    print("Medium")
else:
    print("Small")
```

### 4. Loops

**Java (traditional for loop):**
```java
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

**Jython:**
```python
for i in range(10):
    print(i)
```

**Java (enhanced for loop):**
```java
List<String> items = Arrays.asList("A", "B", "C");
for (String item : items) {
    System.out.println(item);
}
```

**Jython:**
```python
items = ["A", "B", "C"]
for item in items:
    print(item)
```

---

## Type Conversion

### Primitive Types

| Java | Jython | Description |
|------|--------|------|
| `null` | `None` | null value |
| `true/false` | `True/False` | booleans (mind the case) |
| `int`, `long` | `int`, `long` | integers |
| `float`, `double` | `float`, `double` | floating-point numbers |
| `String` | `str` / `unicode` | strings |

### Collection Types

**Java ArrayList → Python List:**
```java
// Java
List<String> list = new ArrayList<>();
list.add("item1");
list.add("item2");
```

```python
# Jython
list = ["item1", "item2"]
# 或使用 Java 类型
from java.util import ArrayList
list = ArrayList()
list.add("item1")
list.add("item2")
```

**Java HashMap → Python Dict:**
```java
// Java
Map<String, Integer> map = new HashMap<>();
map.put("key1", 100);
```

```python
# Jython
map = {"key1": 100}
# 或使用 Java 类型
from java.util import HashMap
map = HashMap()
map.put("key1", 100)
```

---

## Importing Java Classes

Jython can directly import and use Java classes:

```python
# 导入单个类
from net.minecraft.world.item import Item
from net.minecraft.world.level.block import Block

# 导入整个包
from net.luojiayuan.jython.mod.libs import item, block

# 导入嵌套类
from net.minecraft.world.item import Item.Properties

# 使用 import 语句
import java.util.ArrayList
```

---

## Practical Examples

### Example 1: Registering Items

**Java code:**
```java
import net.minecraft.world.item.Item;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.Identifier;

public class MyMod {
    public static final Item MY_ITEM = new Item(new Item.Properties());

    public static void registerItems() {
        ResourceKey<Item> itemKey = ResourceKey.create(
            Registries.ITEM,
            Identifier.fromNamespaceAndPath("mymod", "my_item")
        );
        Registry.register(BuiltInRegistries.ITEM, itemKey, MY_ITEM);
    }
}
```

**Jython code:**
```python
# 使用项目提供的辅助函数
from net.minecraft.world.item import Item
from net.luojiayuan.jython.mod.libs import item

# 方法1: 使用辅助函数（推荐）
my_item = item.register(
    "my_item",           # 物品名称
    "mymod",             # 模组ID
    lambda: Item(),      # 物品工厂函数
    Item.Properties()    # 物品属性
)

# 方法2: 直接使用 Java API
from net.minecraft.core import Registry
from net.minecraft.core.registries import BuiltInRegistries
from net.minecraft.resources import ResourceKey, Identifier
from net.minecraft.core.registries import Registries

my_item = Item()
item_key = ResourceKey.create(
    Registries.ITEM,
    Identifier.fromNamespaceAndPath("mymod", "my_item")
)
Registry.register(BuiltInRegistries.ITEM, item_key, my_item)
```

### Example 2: Registering Blocks

**Java code:**
```java
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.Item;

public class MyMod {
    public static final Block MY_BLOCK = new Block(
        BlockBehaviour.Properties.of()
    );

    public static void registerBlocks() {
        // 注册方块
        ResourceKey<Block> blockKey = ResourceKey.create(
            Registries.BLOCK,
            Identifier.fromNamespaceAndPath("mymod", "my_block")
        );
        Registry.register(BuiltInRegistries.BLOCK, blockKey, MY_BLOCK);

        // 注册方块物品
        ResourceKey<Item> itemKey = ResourceKey.create(
            Registries.ITEM,
            Identifier.fromNamespaceAndPath("mymod", "my_block")
        );
        BlockItem blockItem = new BlockItem(MY_BLOCK,
            new Item.Properties().setId(itemKey));
        Registry.register(BuiltInRegistries.ITEM, itemKey, blockItem);
    }
}
```

**Jython code:**
```python
# 使用项目提供的辅助函数（推荐）
from net.minecraft.world.level.block import Block
from net.minecraft.world.level.block.state import BlockBehaviour
from net.luojiayuan.jython.mod.libs import block

# 创建方块属性
props = BlockBehaviour.Properties.of()

# 注册方块（自动注册物品）
my_block = block.register(
    "my_block",              # 方块名称
    "mymod",                 # 模组ID
    lambda props: Block(props),  # 方块工厂
    props,                   # 方块属性
    True                     # 是否注册物品
)

# 仅注册方块（不注册物品）
tech_block = block.register(
    "tech_block",
    "mymod",
    lambda props: Block(props),
    props,
    False  # 不注册物品
)
```

### Example 3: Creating Food Properties

**Java code:**
```java
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.consumables.Consumable;
import net.minecraft.world.item.consumables.Consumables;
import net.minecraft.world.item.consumponents.ApplyStatusEffectsConsumeEffect;

// 创建毒效果消耗品组件
public static final Consumable POISON_FOOD_CONSUMABLE = Consumables.defaultFood()
    .onConsume(new ApplyStatusEffectsConsumeEffect(
        new MobEffectInstance(MobEffects.POISON, 6 * 20, 1), 1.0f))
    .build();

// 创建食物属性
public static final FoodProperties POISON_FOOD = new FoodProperties.Builder()
    .alwaysEdible()
    .nutrition(4)
    .saturationMod(0.5f)
    .build();
```

**Jython code:**
```python
from net.minecraft.world.effect import MobEffects
from net.minecraft.world.effect import MobEffectInstance
from net.minecraft.world.food import FoodProperties
from net.minecraft.world.item.consumables import Consumable, Consumables
from net.minecraft.world.item.consumponents import ApplyStatusEffectsConsumeEffect

# 创建毒效果（持续6秒，中毒I级）
poison_effect = MobEffectInstance(MobEffects.POISON, 6 * 20, 1)
poison_consume_effect = ApplyStatusEffectsConsumeEffect(poison_effect, 1.0)

# 创建消耗品组件
POISON_FOOD_CONSUMABLE = Consumables.defaultFood() \
    .onConsume(poison_consume_effect) \
    .build()

# 创建食物属性
POISON_FOOD = FoodProperties.Builder() \
    .alwaysEdible() \
    .nutrition(4) \
    .saturationMod(0.5) \
    .build()
```

### Example 4: Using Logger

**Java code:**
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MyMod {
    public static final Logger LOGGER = LoggerFactory.getLogger("mymod");

    public void doSomething() {
        LOGGER.info("Starting operation");
        LOGGER.debug("Debug info: {}", someValue);
        LOGGER.warn("This is a warning");
        LOGGER.error("An error occurred", exception);
    }
}
```

**Jython code:**
```python
# Logger 由 Java 端传入，直接使用
LOGGER.info("Starting operation")
LOGGER.debug("Debug info: " + str(some_value))
LOGGER.warn("This is a warning")
LOGGER.error("An error occurred: " + str(exception))
```

### Example 5: Converting Lambda Expressions

**Java code:**
```java
// Lambda 表达式
Function<Item.Properties, Item> factory = props -> new Item(props);

// 方法引用
items.forEach(System.out::println);
```

**Jython code:**
```python
# 使用 Python lambda
factory = lambda props: Item(props)

# 使用 Python 循环
for item in items:
    print(item)
```

### Example 6: Exception Handling

**Java code:**
```java
try {
    doSomething();
} catch (IOException e) {
    LOGGER.error("IO Error", e);
} catch (Exception e) {
    LOGGER.error("General error", e);
} finally {
    cleanup();
}
```

**Jython code:**
```python
try:
    do_something()
except IOException, e:
    LOGGER.error("IO Error: " + str(e))
except Exception, e:
    LOGGER.error("General error: " + str(e))
finally:
    cleanup()
```

---

## Common Issues

### Q1: How to handle Java overloaded methods?

Jython automatically selects the best-matching method:

```python
# Java 有多个 println 方法
# println(String), println(int), println(Object)
System.out.println("text")   # 调用 println(String)
System.out.println(42)       # 调用 println(int)
```

### Q2: How to create Java arrays?

```python
# 方法1: 使用 Jython 数组（会自动转换）
arr = [1, 2, 3, 4, 5]

# 方法2: 创建 Java 数组
from jarray import array
java_array = array([1, 2, 3], 'i')  # 'i' 表示 int

# 方法3: 使用 Java 类
from java.lang import String
string_array = String(["A", "B", "C"])
```

### Q3: How to handle interfaces and callbacks?

```python
from java.lang import Runnable

# 方法1: 使用 Python 函数（推荐）
def my_run():
    print("Running...")

# Jython 会自动适配
runnable = my_run

# 方法2: 显式实现接口
class MyRunnable(Runnable):
    def run(self):
        print("Running...")

runnable = MyRunnable()
```

### Q4: Python 2 vs Python 3 syntax?

This project uses Jython 2.x; note the following:

```python
# print 函数形式（推荐）
print("Hello")

# 字符串类型
text = "Hello"          # str 类型（字节串）
unicode_text = u"Hello" # unicode 类型

# 异常语法
except Exception, e:    # 正确
# except Exception as e:  # Python 3 语法，不支持
```

### Q5: How to access Java static members?

```python
# 访问静态字段
from net.minecraft.core.registries import BuiltInRegistries
registry = BuiltInRegistries.ITEM

# 调用静态方法
from net.minecraft.resources import Identifier
id = Identifier.of("mod", "item")
```

---

## Advanced Tips

### 1. Using Java Generics

Jython does not require generic type declarations:

```python
# Java: Map<String, Integer> map = new HashMap<>();
from java.util import HashMap
map = HashMap()
map.put("key", 123)  # 类型自动推断
```

### 2. Subclassing Java Classes

```python
from net.minecraft.world.item import Item

class CustomItem(Item):
    def __init__(self, props):
        Item.__init__(self, props)

    def useOn(self, context):
        # 自定义逻辑
        LOGGER.info("Item used!")
        return Item.useOn(self, context)
```

### 3. Implementing Multiple Interfaces

```python
from java.lang import Runnable, Comparable

class MyClass(Runnable, Comparable):
    def run(self):
        print("Running")

    def compareTo(self, other):
        return 0
```

---

## Quick Reference

### Java → Jython Comparison Table

| Java | Jython |
|------|--------|
| `public/private/protected` | no keywords, all public |
| `;` semicolon | newline |
| `{}` braces | indentation |
| `==` (object comparison) | `is` or `==` |
| `equals()` | `==` (string/value comparison) |
| `new Class()` | `Class()` |
| `instanceof` | `isinstance(obj, Class)` |
| `null` | `None` |
| `&&` \|\| `!` | `and`, `or`, `not` |
| `i++` | `i += 1` |

---

## Project-Specific API

This mod provides a simplified API:

### Registration API

```python
# 注册物品
from net.luojiayuan.jython.mod.libs import item
item.register(name, modid, factory, properties)

# 注册方块
from net.luojiayuan.jython.mod.libs import block
block.register(name, modid, factory, properties, has_item)
```

### MinecraftClasses - Minecraft Class Helper

`MinecraftClasses` is a convenient helper class for simplifying access to Minecraft classes from Jython. It provides references to common Minecraft classes and static methods for creating instances.

**Basic usage:**

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc

# ===== 类引用 =====
# 访问方块和物品相关的类
Block = mc.Block                    # Block 类
Block_Properties = mc.Block_Properties  # BlockBehaviour.Properties 类
Item = mc.Item                      # Item 类
Item_Properties = mc.Item_Properties    # Item.Properties 类
BlockItem = mc.BlockItem            # BlockItem 类
```

**Block creation example:**

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc
from net.luojiayuan.jython.mod.libs import block

# 方法1: 使用静态方法创建方块属性
props = mc.createBlockProperties()

# 方法2: 直接创建方块属性
props = mc.Block_Properties.of()

# 注册方块
my_block = block.register(
    "my_block",
    "mymod",
    lambda p: mc.Block(p),
    props,
    True
)
```

**Item creation example:**

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc
from net.luojiayuan.jython.mod.libs import item

# 方法1: 使用静态方法创建物品属性
item_props = mc.createItemProperties()

# 方法2: 直接创建物品属性
item_props = mc.Item_Properties()

# 注册物品
my_item = item.register(
    "my_item",
    "mymod",
    lambda: mc.Item(item_props),
    item_props
)
```

**Block item creation example:**

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc
from net.minecraft.core import Registry
from net.minecraft.core.registries import BuiltInRegistries
from net.minecraft.resources import ResourceKey, Identifier
from net.minecraft.core.registries import Registries

# 假设已经有了一个方块实例
my_block = ...  # 你的方块

# 创建方块物品
item_props = mc.createItemProperties()
item_key = ResourceKey.create(Registries.ITEM, Identifier.fromNamespaceAndPath("mymod", "my_block"))
block_item = mc.createBlockItem(my_block, item_props.setId(item_key))
Registry.register(BuiltInRegistries.ITEM, item_key, block_item)
```

**Complete item registration example (with food properties):**

```python
from net.luojiayuan.jython.mod.libs import MinecraftClasses as mc
from net.luojiayuan.jython.mod.libs import item
from net.minecraft.world.effect import MobEffects
from net.minecraft.world.effect import MobEffectInstance
from net.minecraft.world.food import FoodProperties
from net.minecraft.world.item.consumables import Consumables
from net.minecraft.world.item.consumponents import ApplyStatusEffectsConsumeEffect

# 创建毒效果消耗品组件
poison_effect = MobEffectInstance(MobEffects.POISON, 6 * 20, 1)
poison_consume_effect = ApplyStatusEffectsConsumeEffect(poison_effect, 1.0)
POISON_FOOD_CONSUMABLE = Consumables.defaultFood().onConsume(poison_consume_effect).build()

# 创建食物属性
POISON_FOOD_COMPONENT = FoodProperties.Builder().alwaysEdible().build()

# 创建物品属性并设置食物
item_props = mc.createItemProperties()
item_props.food(POISON_FOOD_COMPONENT)

# 注册毒食物
poison_food = item.register(
    "poison_food",
    "mymod",
    lambda: mc.Item(item_props),
    item_props
)
```

**Available methods:**

```python
# 方块相关
mc.createBlockProperties()              # 创建方块属性
mc.createBlock(props)                   # 创建方块实例
mc.createBlockFromProps(props)          # 从属性创建方块（用于 lambda）

# 物品相关
mc.createItemProperties()               # 创建物品属性
mc.createItemSettings()                 # 创建物品设置（别名）
mc.createItem(props)                    # 创建物品实例
mc.createItemFromProps(props)           # 从属性创建物品（用于 lambda）
mc.createBlockItem(block, props)        # 创建方块物品实例
```

### Logging API

```python
# Logger 由 Java 端自动传入，直接使用
LOGGER.info(message)
LOGGER.warn(message)
LOGGER.warning(message)  # warn 的别名
LOGGER.error(message)
LOGGER.debug(message)
```

### GameDirHelper - Game Directory Helper

Used to get the Minecraft run directory and its related subdirectories:

```python
from net.luojiayuan.jython.mod.utils import GameDirHelper

# ===== 获取游戏根目录 =====
game_dir = GameDirHelper.getGameDirPath()        # 字符串形式（推荐）
game_dir_file = GameDirHelper.getGameDirFile()   # File 对象
game_dir_path = GameDirHelper.getGameDir()       # Path 对象

# ===== 获取常用子目录 =====
mods_dir = GameDirHelper.getModsDirPath()        # mods 目录
config_dir = GameDirHelper.getConfigDirPath()    # config 目录
saves_dir = GameDirHelper.getSavesDirPath()      # saves 目录（存档）
screenshots_dir = GameDirHelper.getScreenshotsDirPath()  # screenshots 目录（截图）
resourcepacks_dir = GameDirHelper.getResourcePacksDir()  # resourcepacks 目录

# ===== 获取其他目录 =====
shaderpacks_dir = GameDirHelper.getShaderPacksDir()      # shaderpacks 目录
logs_dir = GameDirHelper.getLogsDir()                   # logs 目录
crash_reports_dir = GameDirHelper.getCrashReportsDir()   # crash-reports 目录

# ===== 获取自定义子目录 =====
# 相对于游戏根目录的子路径
custom_dir = GameDirHelper.getSubDirPath("custom/folder")  # 返回游戏目录/custom/folder
my_mod_dir = GameDirHelper.getSubDirPath("mymod")          # 返回游戏目录/mymod

# ===== 创建目录 =====
# 如果目录不存在则创建（返回 True 表示成功或已存在）
success = GameDirHelper.createDirIfNotExists(game_dir_path)
success = GameDirHelper.createDirIfNotExists(game_dir_file)

# ===== 实用示例 =====
# 创建模组配置目录
config_path = GameDirHelper.getSubDirPath("mymod")
GameDirHelper.createDirIfNotExists(config_path)
LOGGER.info("Config directory: " + config_path)

# 读取配置文件
import os
config_file = os.path.join(GameDirHelper.getConfigDirPath(), "mymod.json")

# 列出所有存档
saves_path = GameDirHelper.getSavesDirPath()
for save_name in os.listdir(saves_path):
    LOGGER.info("Found save: " + save_name)

# 备份截图
backup_dir = GameDirHelper.getSubDirPath("screenshots_backup")
GameDirHelper.createDirIfNotExists(backup_dir)
```

### ModConfig - Mod Configuration

Mod configuration is managed via the `config/jython-mod.json` file, or modified in-game through the mod settings screen:

```python
# 在 Python 中访问配置（由 Java 端传入）
from net.luojiayuan.jython.mod import Jythonmod

# 可用的配置项：
CONFIG_ENABLED = Jythonmod.CONFIG.enabled          # 是否启用模组
CONFIG_DEBUG = Jythonmod.CONFIG.debugMode          # 调试模式
CONFIG_SCRIPT_PATH = Jythonmod.CONFIG.scriptPath   # 主脚本路径
CONFIG_AUTO_RELOAD = Jythonmod.CONFIG.autoReload   # 自动重载脚本
CONFIG_TIMEOUT = Jythonmod.CONFIG.scriptTimeout    # 脚本超时时间（秒）
CONFIG_SHOW_OUTPUT = Jythonmod.CONFIG.showPythonOutput  # 显示Python输出
CONFIG_PYTHON_PATH = Jythonmod.CONFIG.pythonPath   # Python系统路径
CONFIG_MODS_PATHS = Jythonmod.CONFIG.modsPaths     # Jython模组加载路径

# 示例：根据配置执行不同逻辑
if CONFIG_DEBUG:
    LOGGER.info("Debug mode is enabled")

# 示例：获取模组加载路径
# modsPaths 格式: "{gamedir}/jymods" 或 "path1;path2;path3"
mods_paths = CONFIG_MODS_PATHS.replace("{gamedir}", GAME_DIR).split(";")
for path in mods_paths:
    LOGGER.info("Mod path: " + path)
```

**Config file location:** `config/jython-mod.json`

**Default config:**
```json
{
  "enabled": true,
  "debugMode": false,
  "scriptPath": "/assets/jython-mod/jython/main.py",
  "autoReload": true,
  "scriptTimeout": 30,
  "showPythonOutput": true,
  "pythonPath": "",
  "modsPaths": "{gamedir}/jymods"
}
```

---

## Summary

Key points for converting Java code to Jython:

1. **Leverage Python's simplicity** - no type declarations, braces, or semicolons
2. **Import Java classes directly** - Jython can use the Java API seamlessly
3. **Use Python syntax** - lambda, list comprehensions, dicts, etc.
4. **Mind the Python 2.x syntax**
5. **Make good use of the project helper functions** - item.register(), block.register(), etc.
