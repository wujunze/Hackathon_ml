(function($) {
    $(function() {
        var resolution          = Cookies.get("resolution") || "480p",
            maxFrameRate        = Number(Cookies.get("maxFrameRate") || 15),
            //maxBitRate        = Number(Cookies.get("maxBitRate") || 750),
            channel             = Cookies.get("roomName"),
            key                 = Cookies.get("vendorKey"),
            remoteStreamList    = [],
            client              = AgoraRTC.createRtcClient(),
            disableAudio        = false,
            disableVideo        = false,
            hideLocalStream     = false,
            fullscreenEnabled   = false,
            recordingServiceUrl = 'https://recordtest.agorabeckon.com:9002/agora/recording/genToken?channelname=' + channel,
            recording           = false,
            uid,
            client,
            localStream,
            queryRecordingHandler,
            lastLocalStreamId;

        if (!key) {
            $.alert("No vendor key specified.");
            return;
        }

        /* Joining channel */
        (function initAgoraRTC() {
            client.init(key, function (obj) {
//              console.log("AgoraRTC client initialized");
                client.join(key, channel, undefined, function(uid) {
//                  console.log("User " + uid + " join channel successfully");
//                  console.log("Timestamp: " + Date.now());
                    localStream = initLocalStream(uid);
                    lastLocalStreamId = localStream.getId();
                });
            }, function(err) {
//              console.log(err);
                if (err) {
                    switch(err.reason) {
                        case 'CLOSE_BEFORE_OPEN':
                            var message = 'to use voice/video functions, you need to run Agora Media Agent first, if you do not have it installed, please visit url(' + err.agentInstallUrl + ') to install it.';
                            $.alert(message);
                            break;
                        case 'ALREADY_IN_USE':
                            $.alert("Agora Video Call is running on another tab already.");
                            break;
                        case "INVALID_CHANNEL_NAME":
                            $.alert("Invalid channel name, Chinese characters are not allowed in channel name.");
                            break;
                    }
                }
            });
        }());

        subscribeStreamEvents();
        subscribeMouseClickEvents();
        subscribeMouseHoverEvents();
        subscribeWindowResizeEvent();
        $("#room-name-meeting").html(channel);

        attachExitFullscreenEvent();

        // Initialize and display stream end

        // Utility functions definition
        function generateVideoProfile(resolution, frameRate) {
            var result = "480P_2";
            switch(resolution) {
                case '120p':
                    result = "120P";
                    break;
                case '240p':
                    result = "240P";
                    break;
                case '360p':
                    result = "360P";
                    break;
                case '480p':
                    if (frameRate === "15") {
                        result = "480P";
                    } else {
                        result = "480P_2";
                    }
                    break;
                case '720p':
                    if (frameRate === "15") {
                        result = "720P";
                    } else {
                        result = "720P_2";
                    }
                    break;
                case '1080p':
                    if (frameRate === "15") {
                        result = "1080P";
                    } else {
                        result = "1080P_2";
                    }
                    break;
                default:
                    // 480p, 30
                    // Do nothing
                    break;
            }
            return result;
        }

        //function updateRoomInfo() {
            //var info = "",
                //videoLength = Math.min(4, remoteStreamList.length),
                //index, length;

            //info += "<p>****************Begin:*****************</p>"
            //info += "<p style='font-size: 1.5em'>Video users:</p>";
            //for (index = 0; index < videoLength; index += 1) {
                //info += "<p>stream id: " + remoteStreamList[index].id + "</p>";
                //info += "<p>hasAudio: " + remoteStreamList[index].stream.hasAudio() + "</p>";
                //info += "<p>hasVideo: " + remoteStreamList[index].stream.hasVideo() + "</p>";
                //info += "<p>isVideoOn: " + remoteStreamList[index].stream.isVideoOn() + "</p>";
                //info += "<p>isAudioOn: " + remoteStreamList[index].stream.isAudioOn() + "</p>";
            //}

            //if (remoteStreamList.length > 4) {
                //info += "<p style='font-size: 1.5em'>Audio users:</p>";
                //for (index = 4, length = remoteStreamList.length; index < length; index += 1) {
                    //info += "<p>stream id: " + remoteStreamList[index].id + "</p>";
                    //info += "<p>hasAudio: " + remoteStreamList[index].stream.hasAudio() + "</p>";
                    //info += "<p>hasVideo: " + remoteStreamList[index].stream.hasVideo() + "</p>";
                    //info += "<p>isVideoOn: " + remoteStreamList[index].stream.isVideoOn() + "</p>";
                    //info += "<p>isAudioOn: " + remoteStreamList[index].stream.isAudioOn() + "</p>";
                //}
            //}
            //info += "<p>***********End***********</p>";
            //$("#roomInfoModal").find(".modal-body").empty();
            //$("#roomInfoModal").find(".modal-body").append(info);
        //}

        function attachExitFullscreenEvent() {
            if (document.addEventListener) {
                document.addEventListener('webkitfullscreenchange', exitHandler, false);
                document.addEventListener('mozfullscreenchange', exitHandler, false);
                document.addEventListener('fullscreenchange', exitHandler, false);
                document.addEventListener('MSFullscreenChange', exitHandler, false);
            }

            function exitHandler() {
                if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
                    /* Run code on exit */
                    if (screenfull.enabled) {
                        fullscreenEnabled = screenfull.isFullscreen;
                    }
                }
            }
        }

        function initLocalStream(id, callback) {
            var videoProfile = generateVideoProfile(resolution, maxFrameRate);
            uid = id;
            if(localStream) {
                // local stream exist already
                client.unpublish(localStream, function(err) {
//                  console.log("Unpublish failed with error: ", err);
                });
                localStream.close();
            }
            localStream = AgoraRTC.createStream({
                streamID: uid,
                audio  : true,
                video  : true,
                screen : false,
                local  : true
            });
            //localStream.setVideoResolution(resolution);
            //localStream.setVideoFrameRate([maxFrameRate, maxFrameRate]);
            //localStream.setVideoBitRate([maxBitRate, maxBitRate]);
            localStream.setVideoProfile(videoProfile);

            localStream.init(function() {
//              console.log("Get UserMedia successfully");
//              console.log(localStream);

                var size = calculateVideoSize();
                if (remoteStreamList.length === 0) {
                    removeStream('agora-remote', localStream.getId());
                    displayStream('agora-remote', localStream, size.width, size.height, '');
                } else if (remoteStreamList.length === 1) {
                    $("div[id^='agora-local']").remove();
                    displayStream('agora-local', localStream, 160, 120, 'local-partner-video');
                } else if (remoteStreamList.length === 3) {
                    // TODO FIXME
                }

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
                client.publish(localStream, function (err) {
//                  console.log("Timestamp: " + Date.now());
//                  console.log("Publish local stream error: " + err);
                });
                client.on('stream-published');

                // workaround to remove bottom bar
                $("div[id^='bar_']").remove();

            }, function(err) {
//              console.log("Local stream init failed.", err);
                displayInfo("Please check camera or audio devices on your computer, then try again.");
                $(".info").append("<div class='back'><a href='index.html'>Back</a></div>");
            });
            return localStream;
        }

        function displayInfo(info) {
            $(".info").append("<p>" + info + "</p>")
        }

        function removeStreamFromList(id) {
            var index, tmp;
            for (index = 0; index < remoteStreamList.length; index += 1) {
                var tmp = remoteStreamList[index];
                if (tmp.id === id) {
                    var toRemove = remoteStreamList.splice(index, 1);
                    if (toRemove.length === 1) {
                        //delete toRemove[1];
//                      console.log("stream stopping..." + toRemove[0].stream.getId());
                        toRemove[0].stream.stop();
                        return true;
                    }
                }
            }
            return false;
        }

        function removeStream(tagId, streamId) {
            var streamDiv = $("#" + tagId + streamId);
            if (streamDiv && streamDiv.length > 0) {
                streamDiv.remove();
            }
        }

        function addToRemoteStreamList(stream, videoEnabled, audioEnabled) {
            if (stream) {
                remoteStreamList.push({
                    id: stream.getId(),
                    stream: stream,
                    videoEnabled: videoEnabled,
                    audioEnabled: audioEnabled
                });
            }
        }

        function removeElementIfExist(tagId, uid) {
            $("#" + tagId + uid).remove();
        }

        function displayStream(tagId, stream, width, height, className, parentNodeId) {
            // cleanup, if network connection interrupted, user cannot receive any events.
            // after reconnecting, the same node id is reused,
            // so remove html node with same id if exist.
            removeElementIfExist(tagId, stream.getId());

            var $container;
            if (parentNodeId) {
                $container = $("#" + parentNodeId);
            } else {
                $container = $("#video-container-multiple");
            }

            $container.append('<div id="' + tagId + stream.getId() + '" class="' + className + '" data-stream-id="' + stream.getId() + '"></div>');

            $("#" + tagId + stream.getId()).css({
                width: String(width) + "px",
                height: String(height)+ "px"
            });
            stream.play(tagId + stream.getId());
        }

        function addPlaceholderDiv(parentNodeId, width, height) {
            var placehoder = $("#placeholder-div");
            if (placehoder.length === 0) {
                $("#" + parentNodeId).append("<div id='placeholder-div' style='width:" + width + "px;height:" + height + "px' class='col-sm-6 remote-partner-video-multiple'></div>");
            }
        }

        function addNewRows(parentNodeId) {
            var row1 = $("#video-row1"),
                row2 = $("#video-row2");
            if(row1 && row1.length === 0) {
                $("#" + parentNodeId).append("<div id='video-row1' class='row'></div>");
            }

            if (row2 && row2.length === 0) {
                $("#" + parentNodeId).append("<div id='video-row2' class='row'></div>");
            }
        }

        function toggleFullscreenButton(show, parent) {
            if (parent) {
                $(parent + " .fullscreen-button").parent().toggle(show);
                $(parent + " .fullscreen-button, " + parent + " .fullscreen-button>img").toggle(show);
            } else {
                $("#video-container .fullscreen-button").parent().toggle(show);
                $("#video-container .fullscreen-button, #video-container .fullscreen-button>img").toggle(show);
            }
        }

        function toggleExpensionButton(show, parent) {
            if (parent) {
                $(parent + " .expension-button").parent().toggle(show);
                $(parent + " .expension-button, " + parent + " .expension-button>img").toggle(show);
            } else {
                $("#video-container .expension-button").parent().toggle(show);
                $("#video-container .expension-button, #video-container .expension-button>img").toggle(show);
            }
        }

        function addingMuteSpeakIcon(streamId) {
            $("#agora-remote" + streamId).append("<a class='remote-mute-speak-icon' data-stream-id='" + streamId + "' href='#'><img src='images/icon_mute.png'></a>");

            $(".remote-mute-speak-icon").off("click").on("click", function(e) {
                var streamId = Number($(e.target).parent().data("stream-id"));
                var index, length, obj;
                for (index = 0, length = remoteStreamList.length; index < length; index += 1) {
                    obj = remoteStreamList[index];
                    if (obj.id === streamId) {
                        if (obj.audioEnabled) {
                            obj.stream.disableAudio();
                            obj.audioEnabled = false;
                            $(e.target).attr("src", "images/icon_speak.png");
                        } else {
                            obj.stream.enableAudio();
                            obj.audioEnabled = true;
                            $(e.target).attr("src", "images/icon_mute.png");
                        }
                    }
                }
            });
        }

        function showStreamOnPeerLeave(streamId) {
            var size;
            var removed = removeStreamFromList(Number(streamId));
            if (! removed) {
              return ;
            }

            if (remoteStreamList.length === 0) {
                clearAllStream();
                size = calculateVideoSize(false);

                displayStream("agora-loal", localStream, size.width, size.height, '');

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 1) {
                clearAllStream();
                size = calculateVideoSize(false);

                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, '');
                displayStream("agora-local", localStream, 160, 120, 'local-partner-video');

                toggleFullscreenButton(true);
                toggleExpensionButton(true);
            } else if (remoteStreamList.length === 2) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");

                // row 2
                displayStream("agora-local", localStream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
                addPlaceholderDiv("video-row2", size.width, size.height);
            } else if (remoteStreamList.length === 3) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");

                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
                displayStream("agora-local", localStream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
            } else if (remoteStreamList.length === 4) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");

                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
                remoteStreamList[3].stream.enableVideo();
                displayStream("agora-remote", remoteStreamList[3].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
            } else {
                removeStream('agora-remote', streamId);
            }

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }

        function stopLocalAndRemoteStreams() {
            if (localStream) {
                localStream.stop();
            }
            var index, length;
            for (index = 0, length = remoteStreamList.length; index < length; index += 1) {
                remoteStreamList[index].stream.stop();
            }
        }

        function clearAllStream() {
            stopLocalAndRemoteStreams();
            $("#video-container-multiple").empty();
        }

        function createAudioContainer() {
            var container = $("#audio-container");
            if (container && container.length > 0) {
                return;
            }
            $("#video-container-multiple").append("<div id='audio-container' style='display: none;'></div>");
        }

        function showStreamOnPeerAdded(stream) {

                var size;

            if (remoteStreamList.length === 0) {
                clearAllStream();
                size = calculateVideoSize(false);

                displayStream('agora-local', localStream, 160, 120, 'local-partner-video');
                displayStream("agora-remote", stream, size.width, size.height, '');

                toggleFullscreenButton(true);
                toggleExpensionButton(true);
            } else if (remoteStreamList.length === 1) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-local", localStream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");
                addPlaceholderDiv("video-row2", size.width, size.height);

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 2) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', 'video-row2');
                displayStream("agora-local", localStream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");
            } else if (remoteStreamList.length === 3) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
                displayStream("agora-remote", stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', 'video-row2');
            } else if (remoteStreamList.length === 4) {
                clearAllStream();
                addNewRows("video-container-multiple");
                size = calculateVideoSize(true);

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");
                displayStream("agora-remote", remoteStreamList[3].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row2");

                // we only allow 4 vidwo streams to display at the same time
                createAudioContainer();
                stream.disableVideo();
                displayStream("agora-remote", stream, 0, 0, "", "audio-container");
            } else {
                stream.disableVideo();
                displayStream("agora-remote", stream, 0, 0, "", "audio-container");
            }

            addToRemoteStreamList(stream, true, true);
            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }

        function subscribeStreamEvents() {
            client.on('stream-added', function (evt) {
                var stream = evt.stream;
//              console.log("New stream added: " + stream.getId());
//              console.log("Timestamp: " + Date.now());
//              console.log("Subscribe ", stream);
                client.subscribe(stream, function (err) {
//                  console.log("Subscribe stream failed", err);
                });
            });

            client.on('peer-leave', function(evt) {
//              console.log("Peer has left: " + evt.uid);
//              console.log("Timestamp: " + Date.now());
//              console.log(evt);
                showStreamOnPeerLeave(evt.uid);
                //updateRoomInfo();
            });

            client.on('stream-subscribed', function (evt) {
                var stream = evt.stream;
//              console.log("Got stream-subscribed event");
//              console.log("Timestamp: " + Date.now());
//              console.log("Subscribe remote stream successfully: " + stream.getId());
//              console.log(evt);
                showStreamOnPeerAdded(stream);
                //updateRoomInfo();
            });

            client.on("stream-removed", function(evt) {
                var stream = evt.stream;
//              console.log("Stream removed: " + evt.stream.getId());
//              console.log("Timestamp: " + Date.now());
//              console.log(evt);
                showStreamOnPeerLeave(evt.stream.getId());
                //updateRoomInfo();
            });
        }

        function subscribeWindowResizeEvent() {
            var videoSize;
            $(window).resize(function(e) {
                if (fullscreenEnabled) {
                    return;
                }
                if (remoteStreamList.length === 0 || remoteStreamList.length === 1) {
                    videoSize = calculateVideoSize(false);
                } else {
                    videoSize = calculateVideoSize(true);
                }
                resizeStreamOnPage(videoSize);
            });
        }

        function resizeStreamOnPage(size) {
            if (!size) {
                return;
            }

            clearAllStream();
            var width = size.width,
                height = size.height;

            if (remoteStreamList.length === 0) {
                displayStream('agora-local', localStream, width, height, '');
                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 1) {
                displayStream("agora-remote", remoteStreamList[0].stream, width, height, '');
                // TODO resize local video
                displayStream('agora-local', localStream, 160, 120, 'local-partner-video');
            } else if (remoteStreamList.length === 2) {
                addNewRows("video-container-multiple");

                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-local", localStream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");
                addPlaceholderDiv("video-row2", size.width, size.height);

                toggleFullscreenButton(false);
                toggleExpensionButton(false);
            } else if (remoteStreamList.length === 3) {
                addNewRows("video-container-multiple");

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', 'video-row2');
                displayStream("agora-local", localStream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");
            } else if (remoteStreamList.length === 4) {
                addNewRows("video-container-multiple");

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', 'video-row2');
                displayStream("agora-remote", remoteStreamList[3].stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");
            } else {
                addNewRows("video-container-multiple");

                // row 1
                displayStream("agora-remote", remoteStreamList[0].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                displayStream("agora-remote", remoteStreamList[1].stream, size.width, size.height, "remote-partner-video-multiple col-sm-6", "video-row1");
                // row 2
                displayStream("agora-remote", remoteStreamList[2].stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', 'video-row2');
                displayStream("agora-remote", remoteStreamList[3].stream, size.width, size.height, 'remote-partner-video-multiple col-sm-6', "video-row2");

                // we only allow 4 vidwo streams to display at the same time
                createAudioContainer();
                stream.disableVideo();
                displayStream("agora-remote", stream, 0, 0, "", "audio-container");
            }

            // workaround to remove bottom bar
            $("div[id^='bar_']").remove();
        }

        function getResolutionArray(reso) {
            switch (reso) {
                case "120p":
                    return [160, 120];
                case "240p":
                    return [320, 240];
                case "360p":
                    return [640, 360];
                case "480p":
                    return [640, 480];
                case "720p":
                    return [1280, 720];
                case "1080p":
                    return [1920, 1080];
                default:
                    return [1280, 720];
            }
        }

        function calculateVideoSize(multiple) {
            var viewportWidth = $(window).width(),
                viewportHeight = $(window).height(),
                curResolution = getResolutionArray(resolution),
                width,
                height,
                newWidth,
                newHeight,
                ratioWindow,
                ratioVideo;

            if (multiple) {
                width = viewportWidth / 2 - 50;
                height = viewportHeight / 2 - 40;
            } else {
                width = viewportWidth - 100;
                height = viewportHeight - 80;
            }
            ratioWindow = width / height;
            ratioVideo = curResolution[0] / curResolution[1];
            if (ratioVideo > ratioWindow) {
                // calculate by width
                newWidth = width;
                newHeight = width * curResolution[1] / curResolution[0];
            } else {
                // calculate by height
                newHeight = height;
                newWidth = height * curResolution[0] / curResolution[1];
            }

            newWidth = Math.max(newWidth, 160);
            newHeight = Math.max(newHeight, 120);
            return {
                width: newWidth,
                height: newHeight
            };
        }

        function subscribeMouseHoverEvents() {
            $(".mute-button").off("hover").hover(function(e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_mute.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute_touch.png");
                }
            }, function(e) {
                if (disableAudio) {
                    $(e.target).attr("src", "images/btn_mute_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_mute.png");
                }
            });

            $(".switch-audio-button").off("hover").hover(function(e) {
                if (disableVideo) {
                    $(e.target).attr("src", "images/btn_video_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_voice_touch.png");
                }
            }, function(e) {
                if (disableVideo) {
                    $(e.target).attr("src", "images/btn_video.png");
                } else {
                    $(e.target).attr("src", "images/btn_voice.png");
                }
            });

            $(".fullscreen-button").off("hover").hover(function(e) {
                if (fullscreenEnabled) {
                    $(e.target).attr("src", "images/btn_reduction_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_maximize_touch.png");
                }
            }, function(e) {
                if (screenfull.isFullscreen) {
                    $(e.target).attr("src", "images/btn_reduction.png");
                } else {
                    $(e.target).attr("src", "images/btn_maximize.png");
                }
            });

            $(".expension-button").off("hover").hover(function(e) {
                if (hideLocalStream) {
                    $(e.target).attr("src", "images/btn_expansion.png");
                } else {
                    $(e.target).attr("src", "images/btn_expansion_touch.png");
                }
            }, function(e) {
                if (hideLocalStream) {
                    $(e.target).attr("src", "images/btn_expansion_touch.png");
                } else {
                    $(e.target).attr("src", "images/btn_expansion.png");
                }
            });

            $(".video-container").off("mouseover").mousemove(function(e) {
                $(".toolbar").addClass("toolbar-hover");
                if (window.mousemoveTimeoutHandler) {
                    window.clearTimeout(window.mousemoveTimeoutHandler);
                }
                window.mousemoveTimeoutHandler = setTimeout(function() {
                    $(".toolbar").removeClass("toolbar-hover");
                }, 5000);
            });

            $(".toolbar img").off("hover").hover(function(e) {
                $(this).filter(':not(:animated)').animate({ width: "70px", height: "70px" });
            }, function() {
                $(this).animate({ width: "50px", height: "50px" });
            });
        }

        function subscribeMouseClickEvents() {
            // Adding events handlers
            $(".mute-button").off("click").on("click", function(e){
                disableAudio = !disableAudio;
                if (disableAudio) {
                    localStream.disableAudio();
                    $(e.target).attr("src", "images/btn_mute_touch.png");
                } else {
                    localStream.enableAudio();
                    $(e.target).attr("src", "images/btn_mute.png");
                }
            });

            $(".switch-audio-button").off("click").click(function(e) {
                disableVideo = !disableVideo;
                if (disableVideo) {
                    localStream.disableVideo();
                    $(e.target).attr("src", "images/btn_video.png");
                    $("#stream" + localStream.getId()).css({display: 'none'});
                    $("#stream" + lastLocalStreamId).css({display: 'none'});

                    $("#player_" + localStream.getId()).css({
                        "background-color": "#4b4b4b",
                        "background-image": "url(images/icon_default.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "center center"
                    });
                    $("#player_" + lastLocalStreamId).css({
                        "background-color": '#4b4b4b',
                        "background-image": "url(images/icon_default.png)",
                        "background-repeat": "no-repeat",
                        "background-position": "center center"
                    });
                } else {
                    localStream.enableVideo();
                    $(e.target).attr("src", "images/btn_voice.png");
                    $("#stream" + localStream.getId()).css({display: 'block'});
                    $("#stream" + lastLocalStreamId).css({display: 'block'});
                }
            });

            $(".fullscreen-button").off("click").click(function(e) {
                var target;
                fullscreenEnabled = !fullscreenEnabled;
                if (screenfull.enabled) {
                    if (screenfull.isFullscreen) {
                        screenfull.exit();
                        $(e.target).attr("src", "images/btn_maximize.png");
                    } else {
                        var videoWrapper = $("div[id^='agora-remote']")[0];
                        target = $(videoWrapper).find("video")[0];
                        screenfull.request(target);
                        $(e.target).attr("src", "images/btn_reduction.png");
                    }
                } else {
                    // TODO will we provide fallback for older browsers??
                }
            });

            $(".expension-button").off("click").click(function(e) {
                hideLocalStream = !hideLocalStream;

                if (hideLocalStream) {
                    $("div[id^='agora-local']").remove();
                } else {
                    displayStream("agora-local", localStream, 160, 120, 'local-partner-video');
                }
                // workaround to remove bottom bar
                $("div[id^='bar_']").remove();
            });

            $(".end-call-button").click(function(e) {
                client.leave();
                window.location.href = "index.html";
            });
        }
    });
}(jQuery));
