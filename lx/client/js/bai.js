// 画canvas
window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.
	var canvas = document.getElementById("canvas"),
		context = canvas.getContext("2d"),//getContext唯一合法值2d
		video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function(error) {
//			console.log("Video capture error: ", error.code); 
		};

	// Put video listeners into place
//	console.log(2222222222);

//	console.log(navigator.webkitGetUserMedia);

	if(navigator.getUserMedia) { // Standard 如果用户允许打开摄像头
		//stream为读取的视频流
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed  根据不同的浏览器写法不同
		navigator.webkitGetUserMedia(videoObj, function(stream){
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	// 注册点击事件
	document.getElementById("snap").addEventListener("click", function() {
		context.drawImage(video, 0, 0, 320, 240);
		var image = new Image();
		var imageencode=canvas.toDataURL("image/png");
		// 上传图片获取连接
		$.post('http://ml.jsoncool.com/wjz/img.php', {image: imageencode}, function(url) {
			// 请求face++获取微笑程度
		    var getData={
		        'api_key': '11a66b31f12fbeb65f025a301b154a63',
		        'api_secret': 'DetTIObQHNgPS7o4Q7jD-Z8DlP2Bgtb8',
		        'url': url,
		        'attribute': 'smiling'
		    }
		    console.log(111);
		    $.get('http://apicn.faceplusplus.com/v2/detection/detect', getData, function(data) {
		        var smiling=data['face']['0']['attribute']['smiling']['value'];
		        $('#bjy-num').html(smiling);
		        console.log(smiling);
		        if (smiling>5 && smiling<30) {
		        	var postData={
		        		name: getCookie('username'),
		        		pic: url
		        	}
		        	$.post('http://ml.jsoncool.com/wjz/post_img.php', postData, function(data) {
//		        		console.log('点击事件中发送确认成功');
		        		TIPS.set(postData);
		        		clearInterval(startTimer);
		        	});
		        }
//		        console.log(smiling);
		    });
		});
	});
}, false);

// 获取cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/**
 * 轮询判断是否已经有人笑的像蒙娜丽莎了；
 */
endTimer=setInterval(function(){
	$.post('http://ml.jsoncool.com/tjr/result.php', function(data) {
		if (data['status']=='end') {
			clearInterval(startTimer);
			clearInterval(endTimer);
			TIPS.set({
				name: data.username,
				pic: data.profile_link
			})
		}
	});
},7000)