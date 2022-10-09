electron-builder：打包工具


concurrently：阻塞运行多个命令，-k参数用来清除其它已经存在或者挂掉的进程
wait-on：等待资源，此处用来等待url可访问

cross-env:运行跨平台设置和使用环境变量(Node中的环境变量)的脚本

yarn electron为等待tcp协议3000端口可访问，然后执行electron
yarn electron:serve为阻塞执行开发服务器运行和npm run electron命令


github下载超时
手动下载后，放到 C:\Users\user\AppData\Local\electron\Cache