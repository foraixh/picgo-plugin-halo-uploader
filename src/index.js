const fs = require('fs')
const path = require('path')

module.exports = (ctx) => {
    const name = 'halo-uploader';
    // halo-uploader配置：blog网址、用户名和密码
    const config = ctx => {
        let userConfig = ctx.getConfig('picBed.halo-uploader')
        if (!userConfig) {
            userConfig = {}
        }
        return [{
                name: 'haloUrl',
                type: 'input',
                default: userConfig.haloUrl || '',
                message: 'haloUrl不能为空',
                required: true
            },
            {
                name: 'username',
                type: 'input',
                default: userConfig.username || '',
                message: 'username不能为空',
                required: true
            },
            {
                name: 'password',
                type: 'password',
                default: userConfig.password || '',
                message: 'password不能为空',
                required: true
            },
            {
                name: 'accessToken',
                type: 'password',
                default: userConfig.accessToken || '',
                required: false,
                message: '不需要配置（会自动填充），仅作为缓存使用'
            }
        ]
    };
    // 处理图片上传核心代码
    const handle = async(ctx) => {
        const imgList = ctx.output
        for (let i in imgList) {
            let image = imgList[i].buffer
            if (!image && imgList[i].base64Image) {
                image = Buffer.from(imgList[i].base64Image, 'base64')
            }
            const data = new Uint8Array(image)
            const fileName = imgList[i].fileName
            const filePath = path.join(__dirname, fileName)
            await fs.writeFileSync(filePath, data)

            ctx.log.info(name + ' --> 开始上传图片: ' + fileName);
            let userConfig = ctx.getConfig('picBed.halo-uploader')

            // 获取登陆token和刷新token
            var accessToken = await getTokenByConfig(ctx);
            const haloUrl = userConfig.haloUrl

            // 文件上传
            const uploadConfig = uploadOptions(haloUrl, accessToken, fs.createReadStream(filePath))
            let uploadBody = await ctx.request(uploadConfig)
            uploadBody = JSON.parse(uploadBody);
            // 如果token过期，则重新登陆获取token
            if (uploadBody.status === 401) {
                accessToken = await getTokenByLogin(ctx)
                uploadBody = await ctx.request(uploadConfig)
                uploadBody = JSON.parse(uploadBody);
            }
            if (uploadBody.status === 200) {
                fs.unlink(filePath, () => {})
                delete imgList[i].base64Image
                delete imgList[i].buffer
                imgList[i].imgUrl = uploadBody.data.path
                ctx.log.info(name + " --> 图片上传成功；imgUrl: " + imgList[i].imgUrl)
            } else {
                ctx.emit('notification', {
                    title: '上传失败',
                    body: uploadBody.message
                })
                throw new Error(uploadBody.message)
            }
        }
    };
    // 注册halo-uploader
    const register = () => {
        ctx.helper.uploader.register(name, {
            name: 'halo图床',
            handle,
            config: config
        })
    };

    async function getTokenByConfig(ctx) {
        let userConfig = ctx.getConfig('picBed.halo-uploader')
            // ctx.log.info('获取配置')
            // ctx.log.info(ctx.getConfig('picBed.halo-uploader'))
        if (!userConfig.accessToken) {
            return getTokenByLogin(ctx)
        }
        return userConfig.accessToken
    }

    async function getTokenByLogin(ctx) {
        let userConfig = ctx.getConfig('picBed.halo-uploader')
        if (!userConfig.haloUrl) {
            ctx.emit('notification', {
                title: '请先配置haloUrl',
                body: 'halo博客网址'
            })
            throw new Error('请先配置halo博客网址')
        }
        if (!userConfig.username) {
            ctx.emit('notification', {
                title: '请先配置username',
                body: 'halo用户名'
            })
            throw new Error('请先配置用户名')
        }
        if (!userConfig.password) {
            ctx.emit('notification', {
                title: '请先配置password',
                body: 'halo密码'
            })
            throw new Error('请先配置密码')
        }

        const haloUrl = userConfig.haloUrl
        const username = userConfig.username
        const password = userConfig.password

        // 获取登陆token和刷新token
        const loginConfig = loginOptions(haloUrl, username, password)
        let loginBody = await ctx.request(loginConfig)
        if (loginBody.status === 200) {
            var accessToken = loginBody.data.access_token
            userConfig.accessToken = accessToken
            ctx.log.info(name + ' --> 登陆成功，获取accessToken: ' + accessToken)
            ctx.saveConfig({ 'picBed.halo-uploader.accessToken': accessToken })
                // ctx.log.info('登录并更新后配置')
                // ctx.log.info(ctx.getConfig('picBed.halo-uploader'))
            return accessToken
        } else {
            ctx.emit('notification', {
                title: 'halo登陆失败，无法获取token，请稍后重试',
                body: loginBody.message
            })
            throw new Error(loginBody.message)
        }
    }

    const loginOptions = (url, username, password) => {
        return {
            method: 'POST',
            uri: url + '/api/admin/login',
            headers: {
                contentType: 'application/json',
                uploader: name
            },
            json: {
                username: username,
                password: password,
                authcode: null
            }
        }
    }

    const uploadOptions = (url, accessToken, image) => {
            return {
                method: 'POST',
                uri: url + '/api/admin/attachments/upload',
                headers: {
                    contentType: 'multipart/form-data',
                    uploader: name,
                    'Admin-Authorization': accessToken
                },
                formData: {
                    file: image
                }
            }
        }
        // npm.cmd install | cls | picgo.cmd u .\test.png
    return {
        uploader: name,
        register,
        config: config
    }
}