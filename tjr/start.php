<?php
/**
 * 点击开始游戏接口
 * 获取用户清单，如果没有，则生成新的
 * 够：返回playing
 * 不够，则继续往下走
 * 校验username，如果没有输入，则报错
 * 如果有，则校验是否已存在，
 * 已存在，返回waiting
 * 不存在，新增并写入
 * 统计用户数，已够三个就返回success
 *
 */
$user_list_path = '../data/userlist.txt';
$user_list_string = file_get_contents($user_list_path);
if ($user_list_string) {
    $user_list = json_decode($user_list_string, true);
    if (!$user_list) {
        $user_list = [];
    }
} else {
    $user_list = [];
}

$username = $_GET['username'];
if (!$username) {
    echo json_encode(['status' => 'error', 'message' => '请输入英文昵称']);
    exit();
}

if (in_array($username, $user_list)) {

    if (is_player_enough($user_list)) {
        echo json_encode(['status' => 'playing']);
        exit();
    } else {
        echo json_encode(['status' => 'waiting', 'ready_num' => count($user_list)]);
        exit();
    }
}

if (is_player_enough($user_list)) {
    echo json_encode(['status' => 'playing']);
    exit();
}

$user_list[] = $username;
file_put_contents($user_list_path, json_encode($user_list));
if (is_player_enough($user_list)) {
    echo json_encode(['status' => 'playing']);
    exit();
}
echo json_encode(['status' => 'waiting', 'ready_num' => count($user_list)]);

/**
 * 校验人数是否已够
 * @param  array  $user_list 玩家清单
 * @return boolean           true  够了
 *                           false 没够
 */
function is_player_enough($user_list) {
    if (count($user_list) >= 4) {
        return true;
    }
    return false;
}