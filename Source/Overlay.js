/*
---
description: Overlay

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.2.1: '*'

provides:
  - Overlay
...
*/

var Overlay = new Class({

	Implements: [Options, Events],

	options: {
		id: 'overlay',
		color: '#000',
		duration: 500,
		opacity: 0.5,
		zIndex: 5000/*,
		onClick: $empty,
		onClose: $empty,
		onHide: $empty,
		onOpen: $empty,
		onShow: $empty
		*/
	},

	initialize: function(container, options){
		this.setOptions(options);
		this.container = document.id(container);

		this.bound = {
			'window': {
				resize: this.resize.bind(this),
				scroll: this.scroll.bind(this)
			},
			overlayClick: this.overlayClick.bind(this),
			tweenStart: this.tweenStart.bind(this),
			tweenComplete: this.tweenComplete.bind(this)
		};

		this.build().attach();
	},

	build: function(){
	  this.overlay = new Element('div', {
			id: this.options.id,
			opacity: 0,
			styles: {
				position: (Browser.ie6) ? 'absolute' : 'fixed',
				background: this.options.color,
				left: 0,
				top: 0,
				'z-index': this.options.zIndex
			}
		}).inject(this.container);
		this.tween = new Fx.Tween(this.overlay, {
			duration: this.options.duration,
			link: 'cancel',
			property: 'opacity'
		});
	 return this;
	}.protect(),

	attach: function(){
		window.addEvents(this.bound.window);
		this.overlay.addEvent('click', this.bound.overlayClick);
		this.tween.addEvents({
			onStart: this.bound.tweenStart,
			onComplete: this.bound.tweenComplete
		});
	 return this;
	},

	detach: function(){
		var args = Array.prototype.slice.call(arguments);
		args.each(function(item){
			if(item == 'window') window.removeEvents(this.bound.window);
			if(item == 'overlay') this.overlay.removeEvent('click', this.bound.overlayClick);
		}, this);
		return this;
	},

	overlayClick: function(){
		this.fireEvent('click');
		return this;
	},

	tweenStart: function(){
		this.overlay.setStyles({
			width: '100%',
			height: this.container.getScrollSize().y
		});
	 return this;
	},

	tweenComplete: function(){
		this.fireEvent(this.overlay.get('opacity') == this.options.opacity ? 'show' : 'hide');
		return this;
	},

	open: function(){
		this.fireEvent('open');
		this.tween.start(this.options.opacity);
		return this;
	},

	close: function(){
		this.fireEvent('close');
		this.tween.start(0);
		return this;
	},

	resize: function(){
		this.fireEvent('resize');
		this.overlay.setStyle('height', this.container.getScrollSize().y);
		return this;
	},

	scroll: function(){
		this.fireEvent('scroll');
		if (Browser.ie6) this.overlay.setStyle('left', window.getScroll().x);
		return this;
	}

});
