<?php
/**
 * Created by PhpStorm.
 * User: wujunze
 * Date: 2016/6/25
 * Time: 18:44
 */
/**
 *  PHP通用文件上传类
 *
 *  支持单文件和多文件上传
 */

class FileUpload{

    //要配置的内容
    private $path = "../img/";
    private $allowtype = array('jpg', 'gif', 'png');
    private $maxsize = 1000000;
    private $israndname = true;

    private $originName;
    private $tmpFileName;
    private $fileType;
    private $fileSize;
    private $newFileName;
    private $errorNum = 0;
    private $errorMess = "";

    /**
     * 用于设置成员属性($path, $allowtype, $maxsize, $israndname)
     * 可以通过连贯操作一次设置多个属性值
     * @param $key  成员属性（不区分大小写）
     * @param $val  为成员属性设置的值
     * @return object 返回自己对象$this, 可以用于连贯操作
     */
    function set($key, $val){
        $key = strtolower($key);
        if (array_key_exists($key, get_class_vars(get_class($this)))){
            $this->setOption($key, $val);
        }
        return $this;
    }

    /**
     * 调用该方法上传文件
     * Enter description here ...
     * @param $fileField    上传文件的表单名称
     */
    function upload($fileField){
        $return = true;
        if (!$this->checkFilePath()){
            $this->errorMess = $this->getError();
            return false;
        }

        //将文件上传的信息取出赋给变量
        $name = $_FILES[$fileField]['name'];
        $tmp_name = $_FILES[$fileField]['tmp_name'];
        $size = $_FILES[$fileField]['size'];
        $error = $_FILES[$fileField]['error'];

        if (is_array($name)){
            $errors = array();


            //多个文件上传则循环处理，这个循环只有检查上传文件的作用，并没有真正上传
            for ($i = 0; $i < count($name); $i++) {
                if ($this->setFiles($name[$i], $tmp_name[$i], $size[$i], $error[$i])) {
                    if (!$this->checkFileSize() || !$this->checkFileType()){
                        $errors[] = $this->getError();
                        $return = false;
                    }
                }else{
                    $errors[] = $this->getError();
                    $return = false;
                }

                //如果有问题，则重新初始化属性
                if (!$return){
                    $this->setFiles();
                }
            }

            if ($return) {
                //存放所有上传后文件名的变量数组
                $fileNames = array();
                //如果上传的多个文件都是合法的，则通过循环向服务器上传文件
                for ($i = 0; $i < count($name); $i++) {
                    if ($this->setFiles($name[$i], $tmp_name[$i], $size[$i], $error[$i])){
                        $this->setNewFileName();
                        if (!$this->copyFile()){
                            $errors[] = $this->getError();
                            $return = false;
                        }
                        $fileNames[] = $this->newFileName;
                    }
                }
                $this->newFileName = $fileNames;
            }
            $this->errorMess = $errors;
            return $return;
        }else{
            //设置文件信息
            if ($this->setFiles($name, $tmp_name, $size, $error)) {
                if ($this->checkFileSize() && $this->checkFileType()) {
                    $this->setNewFileName();
                    if ($this->copyFile()) {
                        return true;
                    }else{
                        $return = false;
                    }
                }else{
                    $return=false;
                }
            }else{
                $return=false;
            }
        }

        if (!$return) {
            $this->errorMess = $this->getError();
        }

        return $return;

    }

    //获取上传后的文件名称
    public function getFileName(){
        return $this->newFileName;
    }
    
    //上传失败后，调用该方法则返回，上传出错信息
    public function getErrorMsg(){
        return $this->errorMess;
    }

    //设置上传出错信息
    public function getError(){
        $str = "上传文件<font color='red'>{$this->originName}</font>时出错：";
        switch ($this->errorNum) {
            case 4:
                $str.= "没有文件被上传";
                break;
            case 3:
                $str.= "文件只有部分被上传";
                break;
            case 2:
                $str.= "上传文件的大小超过了HTML表单中MAX_FILE_SIZE选项指定的值";
                break;
            case 1:
                $str.= "上传的文件超过了php.ini中upload_max_filesize选项限制的值";
                break;
            case -1:
                $str.= "未允许的类型";
                break;
            case -2:
                $str.= "文件过大， 上传的文件夹不能超过{$this->maxsize}个字节";
                break;
            case -3:
                $str.= "上传失败";
                break;
            case -4:
                $str.= "建立存放上传文件目录失败，请重新指定上传目录";
                break;
            case -5:
                $str.= "必须指定上传文件的路径";
                break;

            default:
                $str .= "未知错误";
        }
        return $str."<br>";
    }

    //设置和$_FILES有关的内容
    private function setFiles($name="", $tmp_name="", $size=0, $error=0){
        $this->setOption('errorNum', $error);
        if ($error) {
            return false;
        }
        $this->setOption('originName', $name);
        $this->setOption('tmpFileName', $tmp_name);
        $aryStr = explode(".", $name);
        $this->setOption("fileType", strtolower($aryStr[count($aryStr)-1]));
        $this->setOption("fileSize", $size);
        return true;
    }


    //为单个成员属性设置值
    private function setOption($key, $val){
        $this->$key = $val;
    }

    //设置上传后的文件名称
    private function setNewFileName(){
        if ($this->israndname) {
            $this->setOption('newFileName', $this->proRandName());
        }else{
            $this->setOption('newFileName', $this->originName);
        }
    }

    //检查上传的文件是否是合法的类型
    private function checkFileType(){
        if (in_array(strtolower($this->fileType), $this->allowtype)) {
            return true;
        }else{
            $this->setOption('errorNum', -1);
            return false;
        }
    }


    //检查上传的文件是否是允许的大小
    private function checkFileSize(){
        if ($this->fileSize > $this->maxsize) {
            $this->setOption('errorNum', -5);
            return false;
        }else{
            return true;
        }
    }

    //检查是否有存放上传文件的目录
    private function checkFilePath(){
        if (empty($this->path)) {
            $this->setOption('errorNum', -5);
            return false;
        }
        if (!file_exists($this->path) || !is_writable($this->path)) {
            if (!@mkdir($this->path, 0755)) {
                $this->setOption('errorNum', -4);
                return false;
            }
        }
        return true;
    }

    //设置随机文件名
    private function proRandName(){
        $fileName = date('YmdHis')."_".rand(100,999);
        return $fileName.'.'.$this->fileType;
    }

    //复制上传文件到指定的位置
    private function copyFile(){
        if (!$this->errorNum) {
            $path = rtrim($this->path, '/').'/';
            $path.= $this->newFileName;
            if (@move_uploaded_file($this->tmpFileName, $path)) {
                return true;
            }else{
                $this->setOption('errorNum', -3);
                return false;
            }
        }else{
            return false;
        }
    }

}
