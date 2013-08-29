function LayoutPreview(settings){
	this.settings = $.extend({
		'data': 		[],
		'patch': 		"exports/",
		'zip': 			"",
		'nav': 			"#nav",
		'help': 		'#help',
		'header': 		"#header",
		'slider': 		"#demo",
		'btnprev': 		".prev",
		'btnnext': 		".next",
		'btnhelp': 		".help",
		'btndownload': 	".download",
		'info': 		{}
	}, settings);	
	this.init();
	this.loadImages();
	this.loadInf();
	this.bindEvents();
	this.popSelect();
	this.scrollCenter();
	this.validateWindow();
}
LayoutPreview.prototype = {
	init: function(){
		this.data = this.settings.data;
		this.nav = $(this.settings.nav);
		this.help = $(this.settings.help);
		this.header = $(this.settings.header);
		this.slider = $(this.settings.slider);
		this.index = 0;
		this.time = 1000;
		this.helpOn = true;
		this.buttons = {
			prev: $(this.settings.btnprev),
			next: $(this.settings.btnnext),
			help: this.nav.find(this.settings.btnhelp),
			download: this.nav.find(this.settings.btndownload)
		};
		this.info = {
			nome: 	this.settings.info.nome,
			desc: 	this.settings.info.desc,
			pacote: this.settings.info.pacote,
			resp: 	this.settings.info.resp, 
			data: 	this.settings.info.data
		};
	},
	bindEvents: function(){
		var self = this;

		this.header.delegate('a','click', function(){
			self.hideHeader(self.time);
		});
		this.buttons.help.click(function(){
			self.showHeader();
		});
		this.buttons.prev.click(function(){
			self.prev();
		});
		this.buttons.next.click(function(){
			self.next();
		});		
		this.nav.delegate('select','change',function(){
			var v = parseInt($(this).val());
			if(v >= 0 && v < self.slider.find('li').length){
				self.move(v);
			}
		});
		$(window).resize(function(){
			self.validateWindow();
		});
		this.buttons.download[0].href = this.settings.patch + this.settings.zip;
	},
	loadImages: function(){
		var n = this.data.length;
		var ul = document.createElement('ul');
		for(i=0;i<n;i++){
			var li = document.createElement('li');
			var img = new Image();
			img.onload = function() {
			  $(this).attr('width',this.width);
			}
			img.src = this.settings.patch + this.data[i];
			li.appendChild(img);
			
			if(i == 0) li.className = "active";
			else li.style.display = "none";

			ul.appendChild(li);
		}
		this.slider.append(ul);
	},
	loadInf: function(){
		this.header.find('.resp').text(this.info.resp);
		this.header.find('.data').text(this.info.data);
		var h2 = this.header.find('h2')[0];
		
		var n = document.createElement('span');
		n.innerHTML = this.info.nome;
		var d = document.createElement('span');
		d.innerHTML = this.info.desc;
		var p = document.createElement('span');
		p.innerHTML = this.info.pacote;

		h2.appendChild(n);
		h2.appendChild(d);
		h2.appendChild(p);
	},
	popSelect: function(){
		var n = this.data.length;
		var sel = this.nav.find('select');
		sel.empty();

		for(i=0;i<n;i++){
			var op = document.createElement('option');
			op.text = this.data[i];
			op.value = i;
			sel[0].add(op);
		}		
	},
	next: function(){
		var i = this.index;
		var self = this;
		if(i < this.slider.find('li').length - 1){
			i++;
			this.validateHeader(i);
		}
	},
	prev: function(){
		var i = this.index;		
		if(this.index > 0){
			i--;
			this.validateHeader(i);
		}
	},
	move: function(index){
		var self = this;
		this.slider.find('li.active').removeClass('active').fadeOut(function(){
			self.slider.find('li:eq('+index+')').fadeIn().addClass('active');
			self.changeSelectValue(index);
			self.scrollCenter();
		});
		this.index = index;
	},
	changeSelectValue: function(index){
		this.nav.find('select')[0].value = index;
	},
	scrollCenter: function(){
		var i = this.slider.find('li.active img').width() - this.slider.width();
		if(i > 0)
			$(window).scrollLeft(i/2);
	},
	hideHeader: function(time){
		var self = this;
		this.help.fadeOut(function(){
			self.header.animate({top: "-2000px"},time);
		});
		this.helpOn = false;
	},
	showHeader: function(){
		var self = this;

		if(parseInt(self.header.css('top')) < 0){
			self.header.animate({top: "0px"},self.time,function(){
				self.help.fadeIn();
			});
		}
		else
			self.help.fadeIn();

		this.helpOn = true;
	},
	validateHeader: function(index){
		var self = this;
		console.log(this.helpOn);
		if(this.helpOn){
			this.hideHeader(this.time);
			setTimeout(function(){
				self.move(index);
			},this.time);
		}
		else{
			this.move(index);
		}
	},
	validateWindow: function(){
		var w = $(window).width();
		var h = $(window).height();
		
		if (w > 1230 && h > 700){
			this.buttons.help.removeClass('off');
			this.help.show();
		}
		else {
			this.buttons.help.addClass('off');
			this.help.hide();
		}
	}
};