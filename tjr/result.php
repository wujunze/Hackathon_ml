<?php
/**
 * This is an API of Mona Lisa`s test.
 */
$result_path = '../data/result.txt';
$user_list_path = '../data/userlist.txt';

$failed_user = file_get_contents($result_path);
if ($failed_user) {
    $failed_user = json_decode($failed_user, true);
} else {
    $failed_user = [];
}

if (isset($failed_user['name'])) {
    $username = $failed_user['name'];
}

if (isset($failed_user['pic_url'])) {
    $profile_link = $failed_user['pic_url'];
}

if ($username || $profile_link) {
    $result = [
        'status' => 'end',
        'username' => $username,
        'profile_link' => $profile_link,
    ];

    file_put_contents($user_list_path, json_encode([]));
} else {
    $result = [
        'status' => 'playing',
    ];
}
echo json_encode($result);