<?php
/**
 * Created by PhpStorm.
 * User: wujunze
 * Date: 2016/6/25
 * Time: 22:27
 */

$obj = $_REQUEST['image'];
if(empty($obj)){
    echo '文件资源为空';
    exit;
}
$dir = '../photo/';
$file_name = time().'.jpg';
$file_path = $dir.$file_name;
$obj = str_replace('data:image/png;base64,','',$obj);
$res = base64_decode($obj);
file_put_contents($file_path,$res);
echo  'http://ml.jsoncool.com/photo/'.$file_name;