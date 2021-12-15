const exec = require('child_process').execSync;
let base = process.cwd() === 'D:\\workspace\\company\\smartcmp-ui-other' ? process.cwd() : 'D:\\workspace\\company\\smartcmp-ui';
const repositoryList = ['/', '/static/common', '/static/core'];
const argvs = process.argv.splice(2);
repositoryList.forEach(repository => {
    repository = base + repository;
    let message;
    let diff = exec('git reset HEAD . && git diff', {cwd: repository}).toString("utf8").trim();
    try {
        if (argvs[1] === 'pull') {
            if (diff) {
                // 本地有改动
                message = exec('git add . && git stash && git pull --rebase && git stash pop', {cwd: repository});
            } else {
                // 本地无改动
                message = exec('git pull --rebase', {cwd: repository});
            }
        } else if (argvs[1] === 'push') {
            if (diff) {
                message = exec(`git add . && git stash && git pull --rebase && git push origin HEAD:refs/for/${argvs[1] || 'master'} && git stash pop`, {cwd: repository});
            } else {
                message = exec(`git pull --rebase && git push origin HEAD:refs/for/${argvs[2] || 'master'}`, {cwd: repository});
            }
        } else {
            message = exec(argvs.join(' '), {cwd: repository});
        }
    } catch (e) {
        message = e;
    }

    if (message) {
        console.log('\x1B[31m%s\x1B[0m', repository);
        console.log(message.toString("utf8").trim() + '\n');
    }
});
