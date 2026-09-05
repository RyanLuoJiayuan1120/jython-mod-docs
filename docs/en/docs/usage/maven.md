---
title: Maven Dependency Repository (Public API Publishing)
permalink: /en/docs/usage/maven/
createTime: 2026/09/05 21:07:34
---

# Maven Dependency Repository (Public API Publishing)

Other Java mods can depend on this mod's **API-only jar** (`jython-mod-api`) via Maven, call `JythonModApi.register(...)` in their code, and expose their own APIs to Python scripts (see [Public API](api.md)).

The repository is hosted on **Cloudflare Pages** (free and accessible from within mainland China); CI publishes automatically when a tag is pushed.

## Repository Coordinates

```groovy
// 仓库地址（Cloudflare Pages 自定义域名）
maven { url = 'https://maven.luojiayuan.de5.net' }

// 依赖（把版本换成最新 tag）
modCompileOnly "net.luojiayuan.jython.mod:jython-mod-api:v1.2.0-pre"
```

> `jython-mod-api` is an **API-only** artifact (pure JDK, ~10 KB, containing only `JythonModApi` / `ApiReflect`). It is used only for compile-time calls to register APIs; **at runtime you still need to put the full mod jar into mods/ / plugins/** (download the full fat jar from [Releases](https://github.com/RyanLuoJiayuan1120/jython-mod/releases)).

## 1. Cloudflare Pages Initialization (one-time)

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com);
2. **Workers & Pages → Create → Pages**, fill in `jython-mod-maven` as the project name (can be changed, but must match `CLOUDFLARE_PAGES_PROJECT` in CI); choose **Direct Upload** as the connection method (no Git connection needed, CI uploads files directly);
3. After the project is created: **Custom domains → Set up a custom domain**, fill in `maven.yourdomain.com` and complete the DNS binding;
4. Note the **Account ID** (bottom-right of the Dashboard home page / the Workers page).

## 2. GitHub Actions Secrets (one-time)

In the repository `Settings → Secrets and variables → Actions`, add:

| Secret | Value |
|--------|-----|
| `CLOUDFLARE_API_TOKEN` | Create an **API Token** in Cloudflare, choose the **Pages:Edit** permission (`Account > Cloudflare Pages > Edit`), and record the token as `CLOUDFLARE_API_TOKEN` |
| `CLOUDFLARE_ACCOUNT_ID` | The Account ID (see above) |

Optional variable: `CLOUDFLARE_PAGES_PROJECT` (default `jython-mod-maven`).

## 3. Publishing Workflow

Push a tag (or manually trigger the `Publish Maven API` workflow):

```bash
git tag v1.2.0-pre && git push origin v1.2.0-pre
```

CI runs automatically:

```
./gradlew publishMavenApiPublicationToGithubPagesRepository  # 生成 build/maven-repo
npx wrangler pages deploy build/maven-repo                    # 推到 Cloudflare Pages
```

After publishing, verify (in a browser or via curl):

```
https://maven.luojiayuan.de5.net/net/luojiayuan/jython/mod/jython-mod-api/maven-metadata.xml
```

## 4. Local Manual Publishing (for debugging, no CI needed)

```bash
# 生成 maven 目录到 build/maven-repo
./gradlew publishMavenApiPublicationToGithubPagesRepository

# 本地起个静态服务器验证（任选其一）
python3 -m http.server 8080 -d build/maven-repo

# 用 wrangler 手动部署（需本机登录 Cloudflare：npx wrangler login）
npx wrangler pages deploy build/maven-repo --project-name=jython-mod-maven
```

## 5. Mod Author Integration Example

```groovy
repositories {
    maven { url = 'https://maven.luojiayuan.de5.net' }
    // Fabric 还需 Fabric maven：
    maven { url = 'https://maven.fabricmc.net/' }
}

dependencies {
    // Fabric：modCompileOnly；NeoForge/Paper 用 compileOnly
    modCompileOnly "net.luojiayuan.jython.mod:jython-mod-api:v1.2.0-pre"
}
```

```java
import net.luojiayuan.jython.mod.api.JythonModApi;

public class MyMod implements ModInitializer {
    @Override
    public void onInitialize() {
        // 建议在各平台最早的初始化阶段注册（Fabric preLaunch / NeoForge
        // 构造 / Paper onLoad），保证早于 Python 脚本运行，详见 api.md 时序一节。
        JythonModApi.register("mymod", new MyApi());
        JythonModApi.register("mymod", MyApiClass.class);
    }
}
```

## Related Documentation

- Full usage and timing constraints of the public API: [api.md](api.md)
