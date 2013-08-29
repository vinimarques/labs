function Slider(settings){
	this.settings = $.extend({
		'element': 			"#slider .viewport ul",
		'animationClass': 	".animate",
		'next': 			"#slider .next",
		'prev': 			"#slider .prev",
		'paginator': 		"#slider .paginator",
		'background': 		"#slider"
	}, settings);

	this.element = $(this.settings.element);
	this.paginator = $(this.settings.paginator);
	this.background = $(this.settings.background);
	this.index = 0;
	this.preload_index = 1;
	this.animating = false;	
	this.backgroundPos = 0;	
	this.buttons = {
		prev: $(this.settings.prev),
		next: $(this.settings.next)
	};
	
	this.fetchSlides();
	this.createPaginator();
	this.bindEvents();
}
Slider.prototype = {
	bindEvents: function() {
		var self = this;
		this.buttons.next.bind('click', function() {
			self.next();
		});		
		this.buttons.prev.bind('click', function() {
			self.prev();
		});
		this.paginator.find('a').bind('click', function() {
			var i = parseInt(this.getAttribute('rel'));
			var o = "";
		
			if(i == self.index) return false;

			if(i>this.index) o = 'right';
			if(i<this.index) o = 'left';

			self.goToPage(i);
			self.goTo(i,o);
		});	
	},
	fetchSlides: function() {
		var self = this;
		var slides = this.element.children();
		this.slides = [];
		slides.each(function(i) {
			self.slides.push(new self.SlideObject(self, this, i, self.settings.animationClass));
		});
		for (var i = 1; i < this.slides.length; i++) {
			this.slides[i].element.css('visibility', 'hidden');
		}
	},
	createPaginator: function(){
		var num = this.element.children().length;
		this.paginator.empty();

		for(i=0;i<num;i++){
			var n = "Page " + (i + 1);
			var l = document.createElement('li');
			var a = document.createElement('a');
			a.setAttribute('href','javascript:;');
			a.setAttribute('title',n);
			a.setAttribute('rel',i);
			a.innerHTML = n;
			if(i==0) a.className = 'actived';
			l.appendChild(a);
			this.paginator.append(l);
		}
		var w = this.paginator.children().width();
		this.paginator.width(w*num);
	},
	goToPage: function(index){				
		this.paginator.find('a').removeClass('actived');
		this.paginator.find('a:eq('+index+')').addClass('actived');
	},
	goTo: function(index, orientation) {
		if (this.index == index) return false;
		
		if (this.animating) return false;
		if (!orientation){
			var orientation = (index > this.index) ? 'right' : 'left';
		}
		var index = index;
		if (index < 0) {
			index = this.slides.length - 1;
		} else if (index >= this.slides.length) {
			index = 0;
		}
		
		var self = this;
		var i;
		var current_slide = this.slides[this.index];
		var next_slide = this.slides[index];
		this.animating = true;
		next_slide.adjustPosition();
		if (orientation === 'right') {
			next_slide.adjustAtRight();
			current_slide.slideLeft();
			setTimeout(function() {
				next_slide.show();
			}, 500);
		} else if (orientation === 'left') {
			next_slide.adjustAtLeft();
			current_slide.slideRight();
			setTimeout(function() {
				next_slide.show();
			}, 500);
		}
		if(!$.browser.msie)
			this.backgroundMove(orientation);

		this.index = index;
		setTimeout(function() {
			self.animating = false;
		}, 1500);
	},
	next: function() {
		this.goTo(this.index + 1, 'right');
		this.goToPage(this.index);
	},
	prev: function() {
		this.goTo(this.index - 1, 'left');
		this.goToPage(this.index);
	},
	backgroundMove: function(orientation){
		var bg = this.backgroundPos;
		var el = this.background;		

		if(orientation === 'left'){
			bg += this.element.width();
			el.css('background-position',bg+'px 0px');
		}
		else if(orientation === 'right'){
			bg -= this.element.width();
			el.css('background-position',bg+'px 0px');
		}
		this.backgroundPos = bg;
	}
}

Slider.prototype.SlideObject = function(parent, el, i, animeClass) {
	this.element = $(el);
	this.parent = parent;
	this.index = i;
	this.animeClass = animeClass;
	this.fetchAnimationElements();
	this.setup();
};

Slider.prototype.SlideObject.prototype = {
	setup: function() {
		this.isAnimating = false;
	},
	fetchAnimationElements: function() {
		this.animationElements = this.element.find(this.animeClass);
		var el;
		var position;
		var self = this;
		this.element.css('position', 'relative');
		this.animationElements.each(function() {
			el = $(this);
			position = el.position();
			el.data('left', position.left);
			el.data('top', position.top);
		});
		this.adjustPosition();
	},
	adjustPosition: function() {
		var self = this;
		this.animationElements.each(function() {
			el = $(this);
			el.css({
				top: el.data('top'),
				left: el.data('left') + ((self.element.width() * 2) * self.index)
			});
		});
		this.animationElements.css('position', 'absolute');
	},
	adjustAtRight: function() {
		var self = this;
		var el;
		var position;
		this.element.css('visibility', 'visible');
		this.animationElements.each(function() {
			el = $(this);
			position = el.position();
			el.css({
				left: (self.element.width() * 2) + el.data('left')
			});
		});
		this.element.css('position', 'static');
	},
	adjustAtLeft: function() {
		var self = this;
		var el;
		var position;
		this.element.css('visibility', 'visible');
		this.animationElements.show().each(function() {
			el = $(this);
			position = el.position();
			el.css({
				left: el.data('left') - (self.element.width() * 3)
			});
		});
		this.element.css('position', 'static');
	},
	slideLeft: function() {
		var self = this;
		var el;
		var position;
		var wait = 200;
		this.animationElements.each(function(i) {
			var element = $(this);
			var position = element.position();
			setTimeout(function() {
				element.animate({
					left: element.data('left') - (self.element.width() * 2)
				}, 1000, 'easeInOutExpo');}, wait*i+1);
		});
		
		setTimeout(function() {
			self.element.css('visibility', 'hidden');
		}, (this.animationElements.length * wait) + 1000);		
	},
	slideRight: function() {
		var self = this;
		var el;
		var position;
		var wait = 200;
		$(this.animationElements.toArray().reverse()).each(function(i) {
			var element = $(this);
			var position = element.position();
			setTimeout(function() {
				element.animate({
					left: element.data('left') + (self.element.width() * 2)
				}, 1000, 'easeInOutExpo');
			}, wait*i+1);
		});
		
		setTimeout(function() {
			self.element.css('visibility', 'hidden');
		}, (this.animationElements.length * wait) + 1000);
	},
	show: function() {
		var self = this;
		var el;
		var position;
		var wait = 200;
		var elements = this.animationElements;
		if (parseInt(elements.css('left')) < 0) {
			elements = $(elements.toArray().reverse());
		}
		elements.each(function(i) {
			var element = $(this);
			var position = element.position();
			setTimeout(function() {
				element.animate({
					left: element.data('left')
				}, 1000, 'easeInOutExpo');
			}, wait*i+1);
		});
	}
};

$.easing.easeInOutExpo = function (x, t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
};