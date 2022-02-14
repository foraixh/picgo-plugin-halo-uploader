[TOC]

# picgo-halo图床

## 在线安装

打开 [PicGo](https://github.com/Molunerfinn/PicGo) 详细窗口，选择**插件设置**，搜索**halo**安装，然后重启应用即可。

![image-20211101103421797](https://www.foraixh.fun/upload/2021/11/202111011034387-82edc0e73526440d9f858708844c7ac7.png)

## 离线安装

克隆该项目，复制项目到 以下目录：

- Windows: `%APPDATA%\picgo\`
- Linux: `$XDG_CONFIG_HOME/picgo/` or `~/.config/picgo/`
- macOS: `~/Library/Application\ Support/picgo/`

在当前目录打开终端执行 `npm install .\picgo-plugin-halo-uploader`，然后重启应用即可。

在picgo - 2.3.0及以上版本，可在图形化页面选择项目所在文件夹进行插件的安装。

![image-20211024103620012](https://www.foraixh.fun/upload/2021/10/202110241036618-af5c3c0616164c5fa452a3855efc22e2.png)

## 配置

依次配置halo博客地址、halo后台用户名和密码即可。accessToken不需要配置，会自动填充和更新。

![image-20211030112513601](https://www.foraixh.fun/upload/2021/10/202110301125667-067775f419114569b1fe13753ee02165.png)

## 更新日志

### V1.0.2

- 解决accessToken过期后不会重新获取Token的问题

### V1.0.1

- 解决"node.js request请求url错误:证书已过期 Error: certificate has expired"问题，构造请求的时候增加"strictSSL: false"

### V1.0.0

- 实现将halo博客的附件功能作为picgo图床来使用的需求