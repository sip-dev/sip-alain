# 描述

[Demo](https://sip-dev.github.io/ng-sip/)

[ng-sip](https://github.com/sip-dev/ng-sip) 是一个基于 [ng-alain](https://github.com/cipchk/ng-alain) 的企业级中后台前端脚手架，目标也非常简单，希望在Angular上面开发企业后台更简单、更快速。

## Environment

| package | version | git | document |
| ------- | ------- | ------- | ------- |
| `sip-alain` | 0.5.0 | [git](https://github.com/sip-dev/sip-alain/) | [文档](https://github.com/sip-dev/sip-alain/wiki) |
| `ng-alain` | 1.3.1 | [git](https://github.com/cipchk/ng-alain/) | [文档](http://ng-alain.com/) |
| `ng-zorro-antd` | 1.2.0 | [git](https://github.com/NG-ZORRO/ng-zorro-antd) | [文档](https://ng.ant.design/) |
| `@angular` | 6.1.0 | [git](https://github.com/angular/angular) | [文档](https://angular.cn/) |

## Quick start

Make sure you have Node version >= 6.9.0 and NPM >= 3 or higher.

```bash
# clone ng-alain-sip repo
# 如果不能clone: git config --global http.sslVerify false
git clone https://github.com/sip-dev/ng-sip.git

# change directory
cd ng-sip

# install npm package
npm install
# in china please use cnpm （https://github.com/cnpm/cnpm）
# cnpm install

# start the serve
npm start

# or use HMR
npm run serve:hmr
```
