# EASY MOCK CLIENT

## 使用说明：

首先在执行脚本的目录下创建配置文件`app.json`，配置格式如下：
```json
{
  "easy-mock": {
    "host": "http://mock.liuwill.com",
    "name": "username",
    "password": "password"
  }
}
```
分别设置easy mock服务器的主机地址，用户名和密码。

执行命令：
```shell
# 列出所有project
$ node ./lib/bin ls

# 获取单个project的信息和project下的所有mock接口
$ node ./lib/bin ls YourProjectId

```
