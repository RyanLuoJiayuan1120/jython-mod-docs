---
title: Public API (JythonModApi + jython_api)
permalink: /en/docs/usage/api/
createTime: 2026/09/05 21:07:34
---

# Public API (JythonModApi + jython_api)

This mod provides a set of **bidirectional access points**: other Java mods register their own API classes / instances, and Python scripts running inside this mod can call them in two ways.

```
┌────────────────────┐   register()   ┌──────────────────────┐
│  其它 Java 模组      │ ──────────────▶ │  JythonModApi 注册表   │
│  (Fabric/NeoForge/  │                │  modId → apiName →  │
│   Paper)            │                │  Object              │
└────────────────────┘                └──────────┬───────────┘
                                                 │ 活引用（只读视图）
                                                 ▼
┌────────────────────┐                ┌──────────────────────┐
│  Python 脚本        │ ◀────────────── │  API 全局 / jython_api │
│  (main.py / ...)   │   API[...] 或    │  import 钩子          │
└────────────────────┘   from ... import
```

## 1. Java Side: Registering an API

### Dependency Declaration

Other mods depend on this mod at compile time (`compileOnly` / `modCompileOnly`); at runtime this mod's jar coexists with theirs in `mods/` (Fabric/NeoForge) or `plugins/` (Paper).

- **Maven coordinates**: `net.luojiayuan.jython.mod:jython-mod-api:<version>`. See [maven.md](maven.md) for the repository URL and integration example (`jython-mod-api` is the API-only artifact, used only at compile time);
- **Fabric**: declare `"depends": { "jython-mod": "*" }` in `fabric.mod.json`; in code, `import net.luojiayuan.jython.mod.api.JythonModApi;`
- **NeoForge**: declare a dependency on `jythonmod` in `neoforge.mods.toml`;
- **Paper**: `depend: [jython-mod]` in `paper-plugin.yml`.

### Registration

```java
import net.luojiayuan.jython.mod.api.JythonModApi;

// 1) 注册实例：key 自动取类简单名（"TradeApi"）
JythonModApi.register("mymod", new TradeApi());

// 2) 注册 Class 对象：key 自动取类简单名（"Calculator"），Python 侧可调静态方法/构造
JythonModApi.register("mymod", Calculator.class);

// 3) 自定义 key
JythonModApi.register("mymod", "trade", new TradeApi());
```

**When to register**: register in the **earliest possible initialization phase on each platform**, ensuring it happens before this mod runs the Python scripts:

| Platform | Recommended registration point | Notes |
|------|-----------|------|
| Fabric | `preLaunch` entrypoint | Earlier than any `main` entrypoint, hence always before Python |
| NeoForge | `@Mod` constructor | Python runs during the `RegisterEvent` phase, after construction |
| Paper | `onLoad()` | Python runs in `onEnable()`; `onLoad` is always earlier |

> **Timing constraint (important)**: this mod executes Python scripts synchronously during its initialization phase. If your mod declares a dependency on this mod via `depends` (Fabric/NeoForge `depends` causes your mod to initialize **later than** this mod), then registration happens **after** the Python scripts have run — Python scripts that need "post-registered" APIs should defer when they read them (for example, read them inside a registered event callback, or in an event that fires after the server starts). The registry is a live reference: **data registered at any moment can be read from the Python side at any later time**.

### Complete Method Surface

| Method | Description |
|------|------|
| `register(String modId, Object api)` | Register; the key is automatically the class simple name |
| `register(String modId, String apiName, Object api)` | Register with a custom key; can overwrite |
| `get(String modId, String apiName)` | Get; throws `IllegalArgumentException` if absent |
| `getAll(String modId)` | Read-only Map of all that mod's APIs; returns an empty Map if absent |
| `has(String modId, String apiName)` | Whether it exists |
| `modIds()` | The set of registered mod IDs |
| `unregister(String modId)` | Unregister an entire mod |
| `unregister(String modId, String apiName)` | Unregister a single API |

## 2. Python Side: Calling APIs

At runtime the scripts get an injected global `API` (a dict-style read-only view), plus the `jython_api` import hook.

### Method 1: Direct Access via the Global `API`

```python
# 实例：直接调用方法
api = API["mymod"]["TradeApi"]
api.greet("Python")

# Class 对象：静态方法 / 静态字段 / 构造
calc = API["mymod"]["Calculator"]
calc.add(1, 2)          # 静态方法
calc.PI                 # 静态字段

# Class 对象：构造实例（注册的是类）
cls = API["mymod"]["TradeApiClass"]
inst = cls("参数")

# 嵌套类 + 链式 Builder
b = calc.Builder()
b.set(21).build()
```

### Method 2: The Import Hook

```python
# 直取式：import 的即对象
from jython_api.mymod import TradeApi
TradeApi.greet("import")

# 模块式：先拿模组命名空间，再取 API
from jython_api import mymod
mymod.Calculator.add(3, 4)
```

### Interface Surface

| Operation | Description |
|------|------|
| `API["modId"]` | Get a mod's namespace; throws `KeyError` if absent |
| `API["modId"]["apiName"]` | Get an API; throws `KeyError` if absent |
| `"modId" in API` / `"apiName" in API["modId"]` | Existence check |
| `API.get("modId")` / `API["modId"].get("apiName", default)` | Lenient access |
| `API.keys()` / `API["modId"].keys()` | List outer mod IDs / inner API names |
| `API.items()` / `values()` / `len(API)` | Standard dict-style |

### Value Wrapping Rules

- What is registered is an **instance**: the host object is returned directly, and method calls are instance methods;
- What is registered is a **Class object**: it is wrapped into a callable reference —
  - attribute access → first looks up nested classes, then static fields, then static methods;
  - `Class(...)` → constructs an instance;
  - if a return value is a Class, it continues to be wrapped (supporting chained Builders).

### Error Handling

```python
try:
    API["不存在的模组"]
except KeyError as e:
    pass

try:
    from jython_api.不存在的模组 import X
except ImportError as e:
    pass
```

## 3. Examples

- Complete Java-side example mod: `examples/api-demo-mod/` (Fabric/NeoForge/Paper three-platform entrypoints + `ApiDemoCore.register()`), build task `./gradlew demoJars`;
- Python-side example: `examples/api-demo-python/main.py` (demonstrates direct access, the import hook, Class wrapping, chaining, and error handling), build task `./gradlew demoPythonZip`.

Smoke test: put `build/libs/*-demo-*.jar` into the corresponding platform's mods/plugins directory, put `build/libs/api-demo-python.zip` into the `jymods/` directory, and after startup check the log for the `JythonModApi demo` output.

## Related Documentation

- Module structure and available variables: [module.md](module.md)
- Java interop (McReflect, etc.): [special-syntax.md](../special-syntax.md)
