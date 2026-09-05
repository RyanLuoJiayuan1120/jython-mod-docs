---
title: Jython Mod 文档
createTime: 2026/04/04 21:16:43
permalink: /docs/
---

# Jython Mod 文档

欢迎使用 **Jython Mod** —— 一个基于 GraalPy 的 Minecraft 模组，
允许使用 Python 3 编写模组功能，支持 Fabric / NeoForge / Paper 三个平台。

## 使用指南

- [配置](usage/config.md) — 配置文件与字段说明
- [模块结构](usage/module.md) — ZIP 结构、入口约定、可用变量
- [辅助库 API](usage/libs.md) — item / block / MinecraftClasses / BytecodeHelper
- [对外 API](usage/api.md) — 其它 Java 模组向 Python 暴露 API（JythonModApi / jython_api）
- [Maven 依赖仓库](usage/maven.md) — 通过 Cloudflare Pages 发布 jython-mod-api 供模组依赖
- [资源包与数据包](usage/resources.md)
- [第三方 Python 包](usage/packages.md)

## 平台

- [Fabric](platforms/fabric.md)
- [NeoForge](platforms/neoforge.md)
- [Paper](platforms/paper.md)

## 其它

- [特殊语法与功能](special-syntax.md) — Java 互操作、反射调用
- [故障排除](TROUBLESHOOTING.md)
- [Java 转 Jython 教程](JAVA_TO_JTHON_TUTORIAL.md)
