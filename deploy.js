const Node_ssh = require('node-ssh');
const ssh = new Node_ssh();
const configs = {
    host: '192.168.86.60',
    user: 'root',
    password: 'Passw0rd',
}

console.log('开始执行deploy.js脚本...');

updateFile();

// 更富服务器文件
function updateFile() {
    ssh.connect({
        host: configs.host,
        username: configs.user,
        password: configs.password,
        port: 22 //SSH连接默认在22端口
    }).then(function () {
        console.log('ssh连接成功');
        ssh.execCommand('ls', { cwd:'/opt/cloudchef/'}).then(res => {
            console.log('打印目录cloudchef: ' , res);
            ssh.execCommand('mv platform-ui.tar.gz platform-ui.tar.gz.bak', { cwd:'/opt/cloudchef/'}).then(result => {
                console.log('移除platform-ui.tar.gz 压缩包: ', result.stdout, result.stderr);
                ssh.execCommand('wget http://192.168.84.254:1688/build/smartcmp-ui/master/latest/platform-ui.tar.gz', { cwd:'/opt/cloudchef/'}).then(result2 => {
                    console.log('拉去最新包: ', result2.stdout, result2.stderr);
                    ssh.execCommand('tar -zxvf platform-ui.tar.gz', { cwd:'/opt/cloudchef/'}).then(result3 => {
                        console.log('解压: ', result3.stdout, result3.stderr);
                        console.log('解压成功')
                        process.exit();
                    });
                });
            });
        });
        // startRemoteShell();//上传成功后触发远端脚本
    }).catch(err=>{
        console.log('ssh连接失败:',err);
        process.exit(0);
    });
}
