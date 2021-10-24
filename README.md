[TOC]

# picgo-halo图床

## 在线安装

打开 [PicGo](https://github.com/Molunerfinn/PicGo) 详细窗口，选择**插件设置**，搜索**halo**安装，然后重启应用即可。

## 离线安装

克隆该项目，复制项目到 以下目录：

- Windows: `%APPDATA%\picgo\`
- Linux: `$XDG_CONFIG_HOME/picgo/` or `~/.config/picgo/`
- macOS: `~/Library/Application\ Support/picgo/`

在当前目录打开终端执行 `npm install .\picgo-plugin-halo-uploader`，然后重启应用即可。

在picgo - 2.3.0及以上版本，可在图形化页面选择项目所在文件夹进行插件的安装。

![image-20211024103620012](https://www.foraixh.xyz/upload/2021/10/202110241036618-af5c3c0616164c5fa452a3855efc22e2.png)

## 配置

依次配置halo博客地址、halo后台用户名和密码即可。accessToken不需要配置，会自动填充和更新。

![image-20211024102334486](https://www.foraixh.xyz/upload/2021/10/202110241025567-e40d4630396d4fe29e2edf9677b8ff7e.png)

## 更新日志

### V1.0.0

- 实现将halo博客的附件功能作为picgo图床来使用的需求