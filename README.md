## 灵感桌面助手 · Linggan

一个极简的桌面灵感悬浮窗小程序，让你在每次打开电脑时，都能看到自己收藏的金句和提醒，像一位懂你的朋友在屏幕角落轻声鼓励你。

基于 **Tauri v2 + React + TypeScript** 开发，当前主要支持 **Windows**，语录数据保存在本地 JSON 文件中，不依赖云端服务。

---

### 功能特性

- **桌面悬浮窗展示**
  - 无边框、小而精致的卡片样式，始终置顶，适合作为“数字便利贴”。
- **自动轮播机制**
  - 支持随机 / 顺序播放模式。
  - 支持配置轮播间隔：15 秒 / 30 秒 / 1 分钟 / 5 分钟。
- **剪贴板一键导入**
  - 在任何地方复制一句话，回到悬浮窗点击「导入剪贴板」，立即保存为新语录。
  - 自动去重，防止同一句话重复导入。
- **手动添加语句**
  - 点击「手动添加」，在卡片中直接输入任意文本，保存后立即加入轮播。
- **删除当前语句**
  - 点击「删除当前」，可以从本地语录库中移除当前正在显示的那一句。
- **本地持久化存储**
  - 使用 Tauri 在应用数据目录下维护 `quotes.json` 文件。
  - 前端在浏览器模式下会自动退回到 `localStorage` 存储，方便开发调试。

---

### 运行环境要求

- **操作系统**：Windows 10 / 11
- **Node.js**：建议 ≥ 18
- **Rust 工具链**：stable，带 `cargo`（通过 [rustup](https://www.rust-lang.org/tools/install) 安装）
- **Visual Studio Build Tools（仅 Windows）**：
  - 安装 “Build Tools for Visual Studio”
  - 勾选工作负载：**Desktop development with C++（使用 C++ 的桌面开发）**

---

### 本地开发

1. 克隆仓库

```bash
git clone https://github.com/PalmerXiao/Linggan.git
cd Linggan
```

> 如果你是从源码压缩包开始，可以直接在项目根目录执行下面步骤。

2. 安装依赖

```bash
npm install
```

3. 仅前端预览（浏览器中查看样式和交互）

```bash
npm run dev
```

打开终端提示的地址（默认 `http://localhost:5180`）即可看到悬浮窗效果。

4. 启动桌面应用（Tauri 开发模式）

```bash
npm run tauri:dev
```

这会：

- 启动 Vite 前端开发服务器（端口 `5180`）。
- 启动 Tauri 桌面壳，弹出一个无边框的小窗，展示语录轮播。

---

### 使用说明

- **添加新语句**
  - 剪贴板导入：
    1. 在任意应用中选中并复制一句话（Ctrl+C）。
    2. 回到灵感桌面助手小窗，点击底部工具栏中的「导入剪贴板」。
  - 手动输入：
    1. 点击底部工具栏中的「手动添加」。
    2. 在弹出的输入框中键入内容。
    3. 点击「保存」。

- **切换语句**
  - 点击「下一句」按钮，立即跳到下一条语录。

- **删除当前语句**
  - 点击「删除当前」，确认后会从语录列表中移除当前显示的那一句。

- **轮播与模式设置**
  - 使用底部两个下拉框可以：
    - 选择轮播模式：随机 / 顺序。
    - 选择轮播时间间隔。

---

### 构建安装包

在 Windows 上构建安装包（如 `.msi` / `.exe`）：

```bash
npm run build        # 构建前端
npm run tauri:build  # 构建桌面安装包
```

打包完成后，安装包通常会出现在：

```text
src-tauri/target/release/
```

---

### 项目结构概览

```text
Linggan/
├── src/                 # 前端 React + TS 代码
│   ├── ui/
│   │   └── App.tsx      # 悬浮窗 UI 与交互逻辑
│   ├── utils/
│   │   ├── storage.ts   # 语录读写（Tauri JSON / localStorage）
│   │   └── rotation.ts  # 轮播索引逻辑
│   └── styles.css       # 悬浮窗样式
├── src-tauri/           # Tauri 桌面壳（Rust）
│   ├── src/
│   │   └── main.rs      # Tauri 入口 & JSON 文件读写命令
│   ├── tauri.conf.json  # Tauri v2 配置
│   └── icons/           # 由 `tauri icon` 生成的图标文件
├── package.json         # 前端依赖与脚本
├── vite.config.ts       # Vite 配置（端口 5180）
└── README.md            # 本文档
```

---

### 图标生成

项目使用 Tauri 官方工具从一张正方形 PNG 生成多平台图标：

1. 将正方形源图放在项目根目录，命名为 `app-icon.png`。
2. 运行：

```bash
npm run tauri:icon
```

工具会在 `src-tauri/icons/` 下生成 `icon.ico` 等需要的资源。

---

### 未来规划（Roadmap）

- 增加语录列表与批量管理界面（搜索、编辑、批量删除）。
- 增加简单的“免打扰/隐藏”模式与托盘菜单控制。
- 支持多主题 / 配色切换（在不牺牲极简性的前提下）。
- 优化数据备份与导出导入体验（例如一键导出 JSON）。

---

### License

本项目使用 MIT License，详见仓库中的 `LICENSE` 文件。

