/**
 * Copyright (c) Xinhuanet Inc. All rights reserved.
 *
 * @project Xinhua News Agency Homepage 2016
 * @file    js/index.js
 * @author  St. <st_sister@icloud.com>
 * @times   2015-01-23
 *          2016-06-15-08.22
 *          2016-06-20-10.06 indexBg动画制作
 *          2016-06-25-20.33 for ml
 */
var $window = $(window);
var $html = $('html');
var $body = $('body');
var UA_obj; // 全局设备判断和浏览器识别
var resources = [ // 需要预加载的资源
    'video/videoBg.mp4', //视频地址, 必须为第一个
    'video/videoBgPoster.jpg', // 视频预览图，必须为第二个
    // 'video/video.mp3',
    // 'img/title6.png',
    // 'img/indexBuilding.png',
    // 'img/indexCloud.png',
    // 'img/indexBg.jpg'
];

// var loader = new resLoader({
//     resources: resources,
//     onStart: function(total) {
//         // console.log('start:' + total);
//         // $('#mainBox').addClass('blur');
//     },
//     onProgress: function(current, total) {
//         // console.log(current + '/' + total);
//         var percent = current / total * 100;
//         $('.progressbar').css('width', percent + '%');
//         $('.progresstext .current').text(current);
//         $('.progresstext .total').text(total);
//     },
//     onComplete: function(total) {
//         // alert('加载完毕:'+total+'个资源');
//
//         loadingMask.off();
//     }
// });


var loadingMask = {
    isOn: 0,
    init: function() {
        var _this = this;
        if (_this.isOn === 0) {
            $body.prepend(
                '<div class="loadingMask" id="loadingMask" data-size="auto">' +
                '<div class="t">' +
                // '<div class="progress">' +
                //         '<div class="progressbar"></div>' +
                //         '<div class="progresstext">' +
                //         '正在加载 <span class="current"></span> / ' +
                //         '<span class="total"></span>' +
                //     '</div>' +
                // '</div>' +
                '<div class="startGame hide" id="startGame">开始游戏</div>' +
                '</div>' +
                '</div>');

            // if (!_this.$tag) {
            //     _this.$tag = $('#loadingMask');
            // }
            // loader.start();

            // loadingMask.off();

            XHNA_INDEX.videoInit();
        }
    },
    // off: function() {
    //     this.$tag.velocity('fadeOut', {
    //         duration: 3000,
    //         complete: function(e) {
    //             $(this).fadeOut();
    //             $('#startGame')
    //                 .fadeIn()
    //                 .on('click', function(){
    //                     // $('.blur').removeClass('blur');
    //                     XHNA_INDEX.videoInit();
    //                 });
    //         }
    //     });
    //
    //     // $('.progressbar').hide();
    //
    //
    // }
};

var XHNA_INDEX = {
    setTags: function() {
        if (!this.$mainBox) {
            this.$mainBox = $('#mainBox');
            // console.log(this.$mainBox);
        }
        if (!this.$indexNav) {
            this.$indexNav = $('#indexNav');
            // console.log(this.$indexNav);
        }
    },
    size: function() { // size
        var _this = this;
        if (!_this.$sizeTag) {
            _this.$sizeTag = $('[data-size="auto"]');
            _this.$index_navBox_img = $('.index_navBox').find('img');
        }
        _this.sizeObj = {
            $windowWidth: $window.width(),
            $windowHeight: $window.height()
        };

        _this.$sizeTag
            .css({
                width: _this.sizeObj.$windowWidth,
                height: _this.sizeObj.$windowHeight
            });

        _this.$index_navBox_img
            .css({
                'margin-left': -_this.$index_navBox_img.width() * 0.5,
                'margin-top': -_this.$index_navBox_img.height() * 0.5

            })

        if (_this.videoJplayer !== undefined) {
            $('#jquery_jplayer_1').jPlayer('option', {
                size: _this.videSize()
            });
        }
    },
    videSize: function() {
        if (!this.sizeObj) {
            this.size();
        }
        var width = Math.round(this.sizeObj.$windowHeight * 16 / 9);
        if (width > this.sizeObj.$windowWidth) {
            this.$jplayer_id.css({
                left: 'auto',
                right: 0,
                'margin-left': 0
            });
        } else {
            this.$jplayer_id.css({
                left: '50%',
                right: 'auto',
                'margin-left': -width * 0.5
            });
        }
        return ({
            width: width,
            height: this.sizeObj.$windowHeight
                // height: _this.sizeObj.$windowWidth * 0.5625
        });
    },
    videoInit: function() {
        var _this = this;
        // console.log(_this.$videoBox === 0);
        if (!_this.$videoBox) {
            _this.setTags();

            $('.loadingMask .t').velocity({
                // scale: 1,
                // rotateY: 0,
                translateX: '+=20px',
                // rotateX: 0,
                // opacity: 1
            }, {
                duration: 2600,
                loop: true,
                easing: "easeInOut"
                    // complete: function() {
                    //     // console.log('aaa');
                    //     window.location.href = 'http://ml.jsoncool.com/lx/client/';
                    //     // window.location.href = 'client';
                    // }
            });

            // console.log(UA);
            // console.log('videoInit', UA_obj);
            // var isIpad = (UA_obj.device === 'ipad');
            var temp =
                '<span class="videoClose"></span>' +
                '<div class="videoBox">' +
                '<div id="jp_container_1" class="jp-video">' +
                '<div id="jquery_jplayer_1" class="jp-jplayer"></div>' +
                // (isIpad ? '<div class="jp-play videoBgPoster" role="button" tabindex="0" onClick="$(this).hide();"><div class="iconPlay"></div></div>' : '') +
                // '<button class="jp-play" role="button" tabindex="0" style="position:absolute;z-index:9999;left:50%;bottom:10px;width:100px;margin-left:-50px;display:block;">play</button>' + // 调试用
                '</div>' +
                '</div>';

            _this.$mainBox.show().append(temp);
            // 初始化indexNav的位置
            _this.indexNavOff();

            // 获取 $mainBox 下三个新装载的目标
            _this.$videoBox = _this.$mainBox.find('.videoBox');
            _this.$videoClose = _this.$mainBox.find('.videoClose');
            _this.$jplayer_id = _this.$mainBox.find('#jquery_jplayer_1');

            // _this.indexBgInit();

            // 初始化jplayer
            _this.videoJplayer = _this.$jplayer_id.jPlayer({
                swfPath: "lib",
                supplied: "webmv, ogv, m4v, mp3",
                size: _this.videSize(),
                useStateClassSkin: true,
                autoBlur: false,
                smoothPlayBar: true,
                keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true,
                wmode: "window", // 让古代firefox浏览器支持flash播放
                ready: function() {
                    // var hash = location.hash;
                    // var cons = (hash === '#novideo');
                    //
                    // // console.log(cons);
                    //
                    // if (cons) {
                    //     _this.videoOff();
                    // }else {
                    $(this).jPlayer("setMedia", {
                        // title: "蒙娜丽莎的微笑",
                        m4v: resources[0],
                        poster: resources[1]
                    });
                    //     // if (isIpad) {
                    //     //     $(this).jPlayer("pause");
                    //     // } else {
                    //     //     $(this).jPlayer("play");
                    //     // }
                    //     // $(this).jPlayer("pause");
                    //
                    // }

                },
                timeupdate: function(event) {
                    var time = event.jPlayer.status.currentTime;
                    // console.log(time);
                    var cons = (time > 18);
                    if (cons) {
                        // if (time > 9.5) { // 调试用
                        _this.videoOff();
                        // $(this).jPlayer("pause");

                        // _this.$jplayer_id.jPlayer("setMedia", {
                        //     // title: "蒙娜丽莎的微笑",
                        //     mp3: 'video/video.mp3'
                        //     // poster: resources[1]
                        // }, 21.0);
                        // cons = true;

                        // $(this).jPlayer("play", time);
                    }
                },
                // ended: function() {
                //     // $(this).jPlayer("pause");
                //     // $(this).jPlayer("play");
                //     _this.videoOff();
                // },
            });

            // _this.$indexNav
            //     .on('click',
            //         'a:eq(0)',
            //         function(e) {
            //             e.preventDefault();
            //
            //             var href = $(this).attr('href');
            //             // var _this = this;
            //
            //             console.log('aa');
            //
            //             _this.$indexNav.velocity({
            //                 scale: 6,
            //                 rotateY: '150deg',
            //                 translateZ: '-1800px',
            //                 rotateX: '-120deg',
            //             }, {
            //                 duration: 2000,
            //                 begin: function() {
            //                     console.log('begin');
            //                 },
            //                 complete: function() {
            //
            //                     console.log('complete');
            //
            //                     _this.$mainBox.velocity({
            //                         height: 0,
            //                     }, {
            //                         duration: 800,
            //                         complete: function() {
            //                             console.log('ccc');
            //
            //                             window.location.href = href;
            //                         }
            //
            //                     });
            //                 }
            //             });
            //
            //             console.log('return');
            //
            //
            //         });

            _this.$videoClose
                .on('click', function() {
                    _this.videoOff();
                });
        }
    },
    videoOff: function() {
        var _this = this;
        _this.$videoClose.hide();
        _this.videoOffTime = 4000;
        _this.$videoBox.velocity("fadeOut", {
            duration: _this.videoOffTime,
            // daley: 0.3,
            complete: function() {
                _this.$mainBox.show();
                // _this.$jplayer_id.jPlayer("pause");
            }
        });
        _this.indexNavOn();
    },
    // indexBgInit: function() {
    //     // var _this = this;
    //     // var dom =
    //     //     '<div class="indexBg">' +
    //     //     '<img class="indexBuilding" width="auto" height="1003" src="img/indexBuilding.png">' +
    //     //     '<img class="indexCloud" width="auto" height="786" src="img/indexCloud.png">' +
    //     //     '<img class="indexCloud2" width="auto" height="786" src="img/indexCloud2.png">' +
    //     //     '</div>';
    //     // _this.$indexNav.after(dom);
    //     // if (!_this.$indexBg) {
    //     //     _this.$indexBg = _this.$mainBox.find('.indexBg');
    //     //     _this.$indexBuilding = _this.$mainBox.find('.indexBuilding');
    //     //     _this.$indexCloud = _this.$mainBox.find('.indexCloud');
    //     //     _this.$indexCloud2 = _this.$mainBox.find('.indexCloud2');
    //     // }
    //     // _this.indexBgSize();
    //     // _this.indexCloudAni();
    //     // _this.indexCloudAni2();
    // },
    // indexBgSize: function() {
    //     var _this = this;
    //     _this.$indexBg
    //         .css({
    //             width: _this.sizeObj.$windowWidth,
    //             height: _this.sizeObj.$windowHeight
    //         });
    //
    //     _this.$indexBuilding
    //         .css({
    //             left: Math.round(_this.sizeObj.$windowWidth * 109 / 1920),
    //             height: Math.round(_this.sizeObj.$windowHeight * 1003 / 1200),
    //         });
    //
    //     _this.$indexCloud
    //         .css({
    //             left: 0,
    //             height: Math.round(_this.sizeObj.$windowHeight * 786 / 1200),
    //             bottom: Math.round(_this.sizeObj.$windowHeight * 414 / 1200)
    //         });
    //     _this.$indexCloudWidth = Math.round(_this.sizeObj.$windowWidth * 1281 / 1920);
    //
    //     _this.$indexCloud2
    //         .css({
    //             left: -_this.$indexCloudWidth,
    //             height: Math.round(_this.sizeObj.$windowHeight * 501 / 1200),
    //             bottom: Math.round(_this.sizeObj.$windowHeight * 600 / 1200)
    //         });
    // },
    // : function() {
    //     var _this = this;
    //     _this.indexCloudAni();
    //     _this.indexCloudAni2();
    // },
    // indexCloudAni: function() {
    //     var _this = this;
    //     _this.$indexCloud
    //         .velocity({
    //             // scale: 0.8,
    //             translateX: '+' + _this.sizeObj.$windowWidth - 0 + _this.$indexCloudWidth + 'px',
    //             opacity: 0.4
    //         }, {
    //             duration: 1000 * 60 * 3,
    //             easing: 'linear',
    //             loop: false,
    //             complete: function() {
    //                 $(this).velocity({
    //                     // scale: 1,
    //                     translateX: -_this.$indexCloudWidth,
    //                     opacity: 1
    //                 }, {
    //                     duration: 0,
    //                     // delay: 2000,
    //                     complete: function() {
    //                         // console.log('indexCloudAni');
    //                         _this.indexCloudAni();
    //                     }
    //                 });
    //             }
    //         });
    // },
    // indexCloudAni2: function() {
    //     var _this = this;
    //     _this.$indexCloud2
    //         .velocity({
    //             // scale: 0.8,
    //             translateX: '+' + _this.sizeObj.$windowWidth - 0 + _this.$indexCloudWidth + 'px',
    //             // opacity: 0.4
    //         }, {
    //             duration: 1000 * 60 * 3,
    //             easing: 'linear',
    //             loop: false,
    //             complete: function() {
    //                 $(this).velocity({
    //                     // scale: 1,
    //                     translateX: -(Math.round(_this.$indexCloudWidth * 1.3)),
    //                     // opacity: 1
    //                 }, {
    //                     duration: 0,
    //                     // delay: 2000,
    //                     complete: function() {
    //                         // console.log('indexCloudAni2');
    //                         _this.indexCloudAni2();
    //                     }
    //                 });
    //             }
    //         });
    // },
    indexNavOn: function() {
        var _this = this;
        _this.$indexNav
            .velocity({
                scale: 1,
                // rotateY: 0,
                // translateZ: 0,
                // rotateX: 0,
                opacity: 1
            }, {
                duration: _this.videoOffTime,
                complete: function() {
                    // console.log('aaa');
                    window.location.href = 'http://ml.jsoncool.com/lx/client/';
                    // window.location.href = 'client';
                }
            });

        // _this.indexNavSize();
    },
    indexNavOff: function(duration) {
        var _this = this;

        if (duration === undefined) {
            duration = 0;
        } else {
            duration = _this.videoOffTime;
        }
        _this.$indexNav.velocity({
            scale: 3,
            // rotateY: '150deg',
            // translateZ: '-1800px',
            // rotateX: '-120deg',
            opacity: 0
        }, {
            duration: duration
        });
    },
    // indexNavSize: function() {
    //     var _this = this;
    //     if (!_this.$indexNavBox) {
    //         _this.$indexNavBox = $('#indexNavBox');
    //     }
    //     if ((432 + 260) > _this.sizeObj.$windowHeight) {
    //         _this.$indexNavBox
    //             .css({
    //                 'width': 384,
    //             });
    //         _this.$indexNavBox
    //             .find('a')
    //             .css({
    //                 'margin-left': 20
    //             });
    //     } else {
    //         _this.$indexNavBox
    //             .css({
    //                 'width': 200,
    //             });
    //         _this.$indexNavBox
    //             .find('a')
    //             .css({
    //                 'margin-left': 'auto'
    //             });
    //     }
    // },
    // loadPages: function($tag) {
    //     var href = $tag.attr('href');
    //     var _this = this;
    //
    //     console.log('aa');
    //
    //     _this.$indexNav.velocity({
    //         // scale: 6,
    //         rotateY: '150deg',
    //         translateZ: '-1800px',
    //         rotateX: '-120deg',
    //     }, {
    //         duration: 200,
    //         complete: function() {
    //
    //             console.log('bb');
    //
    //             _this.$mainBox.velocity({
    //                 height: 0,
    //             }, {
    //                 duration: 800,
    //                 complete: function() {
    //                     console.log('ccc');
    //
    //                     window.location.href = href;
    //                 }
    //
    //             });
    //         }
    //     });
    // }
};

$(function() {
    // 初始化浏览器识别
    UA_obj = $.browser({
        tag: $html
    });

    // 锁定浏览器窗口溢出
    $html.addClass('oh');

    loadingMask.init();

    XHNA_INDEX.size();


    $('#startGame')
        .fadeIn(function() {
            $(this).on('click', function() {
                // $('.blur').removeClass('blur');
                $('#loadingMask').fadeOut();
                $('#jquery_jplayer_1').jPlayer('play');
            });
        });

});
$window.resize(function() {
    XHNA_INDEX.size();
    // XHNA_INDEX.indexBgSize();
    // XHNA_INDEX.indexNavSize();
});
