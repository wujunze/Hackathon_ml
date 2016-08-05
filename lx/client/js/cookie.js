// @St. 2016-06-26
var cookie = {
    expdays: 365,
    set: function(cookieName, cookieValue) {
        var d = new Date();
        d.setTime(d.getTime() + (cookie.expdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    },
    get: function(cookieName) {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};

$(function(){

    var $username = $('#username');
    var $roomName = $('#room-name');

    $('#join-meeting').on('click', function(){
        var name = $.trim($username.val());
        var room = $.trim($roomName.val());
        cookie.set('name', name);
        cookie.set('room', room);
    });

    var cookieName = get('name');
    var cookieRoom = get('room');

    // if (cookieName !== "" && cookieRoom !== "") {
        $username.attr('value', cookieName);
        $roomName.attr('value', cookieRoom);
    // }
});
