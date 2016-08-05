<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>titleName - 白俊遥博客</title>
        <meta http-equiv="Cache-Control" content="no-transform" />
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <link rel="stylesheet" href="/Public/statics/bootstrap-3.3.5/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/Public/statics/bootstrap-3.3.5/css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="/Public/statics/font-awesome-4.4.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="/tpl/Public/css/base.css" />
</head>
<body>


<!-- 引入bootstrjs部分开始 -->
<script src="/Public/statics/js/jquery-1.10.2.min.js"></script>
<script src="/Public/statics/bootstrap-3.3.5/js/bootstrap.min.js"></script>
<script src="/tpl/Public/js/base.js"></script>
<script>
$.get('http://apicn.faceplusplus.com/v2/detection/detect?api_key=11a66b31f12fbeb65f025a301b154a63&api_secret=DetTIObQHNgPS7o4Q7jD-Z8DlP2Bgtb8&url=http%3a%2f%2fi4.piimg.com%2f7529%2fb568a3c2004e68a4.jpg&attribute=glass,pose,gender,age,race,smiling', function(data) {
    console.log(data)
});
</script>

</body>
</html>