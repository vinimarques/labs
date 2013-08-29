function Gallery(settings){
	this.settings = $.extend({
		'element': 		"ul",
		'selector': 	"img",
		'time': 		500,
		'resize': 		0.45
	}, settings);

	this.init();
	this.bindEvents();
}
Gallery.prototype = {
	init: function(){
		this.element = $(this.settings.element);		
		this.time = this.settings.time;
		this.resize = this.settings.resize;
		this.selector = this.settings.selector;
		this.animate = false;

		this.element.find(this.selector).each(function(){
			var w = $(this).width();
			var h = $(this).height();
			$.data(this,'widthEl',w);
			$.data(this,'heightEl',h);
			$.data(this,'animate',false);
		});
	},
	bindEvents: function(){
		var self = this;
		this.element.find(this.selector).bind('mouseover', function(){
			self.mouseOver(this);
		});
		this.element.find(this.selector).bind('mouseout', function(){
			self.mouseOut(this);
		});
	},
	mouseOver: function(el){
		if(!$.data(el,'animate')){
			$.data(el,'animate',true)
			var self = this;
			var i = $(el);
			var w = $.data(el,'widthEl');
			var h = $.data(el,'heightEl');
			var wm = parseInt(w * this.resize);
			var hm = parseInt(h * this.resize);
			var t = '-' + parseInt(hm/2);
			var l = '-' + parseInt(wm/2);
			wm += w;
			hm += h;
			
			i.css('z-index','9999');
			i.animate({
				top: t,
				left: l,
				width: wm,
				height: hm
			}, self.time , 'easeInOutQuad', function(){
				$.data(self,'animate',false);
			});
		}

	},
	mouseOut: function(el){
		var self = this;		
		$(el).clearQueue().animate({
			top: 0,
			left: 0,
			width: $.data(el,'widthEl'),
			height: $.data(el,'heightEl')
		}, self.time , 'easeInOutQuad' , function(){
			$.data(el,'animate',false);
			$(el).css('z-index','0');
		});
	}
}
$.easing.easeInOutQuad = function(x, t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
};