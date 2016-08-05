<?php
/**
 * Created by PhpStorm.
 * User: wujunze
 * Date: 2016/6/25
 * Time: 18:40
 */

if(file_exists('../data/result.txt')){
    echo json_encode(
        array(
            'status' => 'already_exist',
            'msg'    => '结果已经存在',
        )
    );
    exit;
}
if(empty($_REQUEST['name'])){
    echo json_encode(
        array(
            'status' => 'name_is_empty',
            'msg'    => '姓名值为空',
        )
    );
    exit;
}

if(empty($_REQUEST['pic'])){
    echo json_encode(
        array(
            'status' => 'pic_is_empty',
            'msg'    => '文件为空',
        )
    );
    exit;
}

/*include'../core/file_uploader.php';
$file_uploader = new FileUpload();
$name = $_REQUEST['name'];
$file_uploader->upload('pic');
$pic_url =  'http://ml.jsoncool.com/img/'.$file_uploader->getFileName();*/

$name = $_REQUEST['name'];
$pic_url = $_REQUEST['pic'];
$result = array(
    'name' => $name,
    'is_laugh' => 1,
    'pic_url' => $pic_url,
);
file_put_contents('../data/result.txt',json_encode($result));
echo json_encode(array(
    'status' => 'upload_success',
    'pic_url'=> $pic_url,
    'msg'    => '图片上传成功',
));



