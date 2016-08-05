<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>
	<title>简易登录界面 - bjyadmin</title>
	    <meta http-equiv="Cache-Control" content="no-transform" />
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link rel="stylesheet" href="/Public/statics/bootstrap-3.3.5/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/Public/statics/bootstrap-3.3.5/css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="/Public/statics/font-awesome-4.4.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="/bjy/tpl/Public/css/base.css" />
</head>
<body>
<br />
<br />
<a href="<?php echo U('Admin/Index/index');?>">前往管理后台</a>
<br />
<br />
<a href="<?php echo U('Home/Index/logout');?>">退出登录</a>
<br />
<br />
超级管理员登录：
<form method="post">
    用户名：<input type="text" name="username" value="admin">
    密码：<input type="text" name="password" value="123456">
    <input type="submit" value="登录">
</form>
<br />
文章管理员登录：
<form method="post">
    用户名：<input type="text" name="username" value="admin2">
    密码：<input type="text" name="password" value="123456">
    <input type="submit" value="登录">
</form>
<br />
<br />
<form action="<?php echo U('Home/Index/qrcode');?>" method="post">
    输入连接：http://<input type="text" name="url" value="baijunyao.com">
    <input type="submit" value="生成二维码">
</form>
<br />
<br />
<form action="<?php echo U('Home/Index/send_email');?>" method="post">
    输入邮箱：<input type="text" name="email" value="baijunyao@baijunyao.com">
    <input type="submit" value="发送邮件">
</form>
<br />
<br />
<form action="<?php echo U('Home/Index/alipay');?>" method="post">
    输入金额：<input type="text" name="price" value="1">
    <input type="submit" value="生成支付宝订单">
</form>
<br />
<br />
<form action="<?php echo U('Home/Index/pdf');?>" method="post">
    输入内容：<textarea name="content" cols="30" rows="10"><h1 style="color:red">hello word</h1></textarea>
    <input type="submit" value="生成pdf">
</form>
<br />
<br />
请使用2个不同的浏览器分别打开着两个链接即可聊天：<a href="<?php echo U('Home/Index/user1');?>" target="_blank">用户1</a>&emsp;<a href="<?php echo U('Home/Index/user2');?>">用户2</a>


<!-- 引入bootstrjs部分开始 -->
<script src="/Public/statics/js/jquery-1.10.2.min.js"></script>
<script src="/Public/statics/bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script src="/bjy/tpl/Public/js/base.js"></script>
</body>
</html>