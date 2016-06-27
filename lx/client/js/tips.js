// @St. 2016-06-26
var TIPS = {
    init: function() {
        var _this = this;
        _this.$tips = $('#tips');
        _this.$tips.hide();
    },
    on: function() {
        this.$tips.fadeIn();
    },
    off: function() {
        this.$tips.fadeOut();
    },
    set: function(options) {
        var _this = this;
        if (!_this.$tips) {
            _this.$tips = $('#tips');
        }
        _this.options = options;
        if (_this.options) {
            _this.$tips.find('#img').attr('src', _this.options.pic);
            _this.$tips.find('span').html(_this.options.name);
            _this.on();
        }
    }
};
$(function() {
    TIPS.init();
});
// TIPS.set({
//     name: '超级木木',
//     pic: 'http://ml.jsoncool.com/photo/1466901165.jpg'
// });
