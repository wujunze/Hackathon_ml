## 简介
使用thinkphp开发项目的过程中把一些常用的功能或者第三方sdk整合好；开源供亲们参考;
这些都是经过线上运营考验的；无毒害可以免费放心折腾使用；只要不会某一天找到我说因为借鉴了这个开源产品的一些方法；而导致了好几个亿的损失；要我负责并赔偿就好；￣へ￣  
当然；如果是想要一套博客程序；这也是有的：http://git.oschina.net/shuaibai123/thinkbjy

## 说明
此开源产品面向所有thinkphp开发用户；因为我的基本思想是不改动框架的源文件；只是围绕着框架扩展；所以整合的这些功能都可以无痛兼容各种环境；既可以按照文章将整合的这些功能方便的移植到你已有的项目中；也可以直接以此项目为基础开发；

## 系列文章
1. [thinkphp整合系列之短信验证码、订单通知](http://baijunyao.com/article/66)
2. [thinkphp整合系列之rbac的升级版auth权限管理系统demo](http://baijunyao.com/article/67)
3. [thinkphp整合系列之阿里云oss](http://baijunyao.com/article/68)
4. [thinkphp整合系列之phpmailer批量发送邮件](http://baijunyao.com/article/69)
5. [thinkphp整合系列之友盟消息推送](http://baijunyao.com/article/70)  
6. [thinkphp整合系列之phpqrcode生成二维码](http://baijunyao.com/article/71)  
7. [thinkphp整合系列之融云即时通讯在线聊天](http://baijunyao.com/article/72)  
8. [thinkphp整合系列之tcpdf生成pdf文件](http://baijunyao.com/article/73)  
9. thinkphp整合系列之phpexcel生成生成excel文件  
10. thinkphp整合系列之支付宝MD5加密方式  
11. thinkphp整合系列之支付宝RSA加密方式  
12. thinkphp整合系列之微信扫码支付  
13. thinkphp整合系列之微信公众号支付   
14. thinkphp整合系列之微信支付结果通知  
14. thinkphp整合系列之paypal支付  
持续更新中...

## 使用说明
1. 请将程序直接放在根目录下；不要多层目录；例如正确：www/;错误：www/bjyadmin/ ；
2. 默认用户名：admin   密码：123456

## 针对thinkphp的改进优化；
1. 修复tinkphp的session设置周期无效的bug；
2. 自定义标签 /Application/Common/Tag/My.class.php；
3. 将html视图页面分离；

## php整合
1. PHPMail发送邮件
2. PHPExcel生成excel表格
3. TCPDF生成pdf文件
4. 容联云通讯短信验证码
5. 阿里oss云存储
6. 支付宝pc端支付MD5方式
7. 支付宝移动端支付接口RSA方式
8. 微信扫码支付
9. 微信JSSDK支付
10. 融云即时通讯
11. 友盟推送
12. Memcached缓存
13. Auth权限管理
14. emoji表情转换

## php整合使用说明
大量常用的php工具及sdk已经整合；并写成函数；只要配置好各种key使用非常之方便；  
例如：send_email('邮箱','标题','内容'); 即可发送一封邮件  
设置好需要上传到oss的目录；使用upload('路径'); 用户上传文件时会自动上传到oss；并且可以选择是否在本地保留文件；  
更多功能可以查看 /Application/Common/Common/function.php 等源代码

## 前端整合
1. boostrap、sui、framework7、frozenui等前端框架；
2. ueditor、umeditor百度富文本编辑器；
3. webuploader上传、iCheck美化的单选复选按钮、layer弹出层、laydate日期等插件；
4. font-awesome、animate.css；

## 前端使用说明
大量常用的框架及插件已经整合并且加入标签库；在html页面中中只需要很简单的代码就可以引入；  
例如：   `<ueditor name="content" />` 这样一个简单的标签就可以将editor编辑器引入并设置name名为content;
提交post时后台即可通过content字段直接获取到内容；  
`<jquery />`标签可引入jQuery  
不知道怎么自定义标签？传送门：http://baijunyao.com/article/21   
更多标签可以查看 /Application/Common/Tag/My.class.php 源代码

## 链接
- 官网：http://baijunyao.com   
- github：https://github.com/baijunyao/thinkphp-bjyadmin   
- oschina：http://git.oschina.net/shuaibai123/thinkphp-bjyadmin   

## 商业友好的开源协议
bjyadmin遵循Apache2开源协议发布。Apache Licence是著名的非盈利开源组织Apache采用的协议。该协议和BSD类似，鼓励代码共享和尊重原作者的著作权，同样允许代码修改，再作为开源或商业软件发布。