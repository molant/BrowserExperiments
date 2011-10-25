// jQuery magazinify Plugin
(function( $ ) {
	var settings = {
		duration: 1000,
		sheet: 0,
		width: 350,
		height: 400,
		pagePdding: 20,
		pageShadowWidth:10,
		contentShadowWidth: 15,
		classes: {
			magazinify: 'magazinify',
			shadow: 'magazine_shadow',
			content: 'magazine_content',
			sheet: 'magazine_sheet',
			page: 'magazine_page'
		}
	};
	
	var methods = {
		init: function( options ) {
			this.each(function() {
				var data, dataId, opts,
				$this = $(this);
				
				$this.magazinify('options', options);
				data = $this.data('magazinify') || {};
				opts = data.options;
				
				// If the plugin hasn't been initialized yet
				if ( !data.magazinify ) {
					dataId = +new Date;
					data = {
						magazinify: true,
						options: opts,
						id: dataId
					};
					// create element and append to body
					$this.addClass(data.options.classes.magazinify).css({
						width: 2 * data.options.width + ( 2 * data.options.pageShadowWidth ),
						height: data.options.height + ( 2 * data.options.pageShadowWidth )
					});
					if( $this.children().length % 2 != 0 )
					{
						$this.append('<div/>');
					}
					$this.children().addClass(data.options.classes.page).css({
						width: data.options.width,
						height: data.options.height,
						padding: data.options.pageShadowWidth,
						left: 0,
						zIndex: 1
					}).each(function(index){
						var $this = $(this);
						$('<div class="' + data.options.classes.shadow + '"></div>').css({
							width: data.options.contentShadowWidth,
							height: '100%',
							left:0,
							top:0
						}).prependTo(this);
						$this.wrapInner('<div class="' + data.options.classes.content + '"></div>');
						if( index%2 == 0 )
						{
							$this.wrap('<div class="' + data.options.classes.sheet + '"></div>');
						}
						else
						{
							$this.css({
								zIndex: 2,
								left: data.options.width + ( 2 * data.options.pageShadowWidth ),
								width:0
							}).appendTo( $this.prev('.' + data.options.classes.sheet) );
						}
						$this.find('.' + data.options.classes.content).css({
							width:data.options.width - ( 2 * data.options.pagePdding ),
							height:data.options.height - ( 2 * data.options.pagePdding ),
							padding:data.options.pagePdding,
							boxShadow: '0 0 ' + data.options.pageShadowWidth + 'px rgba(0, 0, 0, .5)'
						});
					});
					var $sheets = $this.find('.' + data.options.classes.sheet).data('percent', 0);
					$sheets.css({
						position:'absolute',
						left: data.options.width,
						width:data.options.width + ( 2 * data.options.pageShadowWidth ),
						height:data.options.height + ( 2 * data.options.pageShadowWidth )
					});
					data.options.num_sheets = $sheets.length;
					$sheets.each(function(index)
					{
						$(this).css('zIndex', 2 * data.options.num_sheets - index );
					});
					
					// Bind events.
					var supportTouch = $.support.touch,
						scrollEvent = "touchmove scroll",
						touchStartEvent = supportTouch ? "touchstart" : "mousedown",
						touchStopEvent = supportTouch ? "touchend" : "mouseup",
						touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
					
					var $document = $(document);
					
					$document.bind(touchStopEvent + '.magazinify', function(event){
						if( $document.data('clicking') )
						{
							var _event = event.originalEvent.touches && event.originalEvent.touches[0] ? event.originalEvent.touches[0] : event;
							var offset = $this.offset();
							var percent = 100 - ( ( _event.pageX - offset.left ) * 100 / ( data.options.width * 2 ) );
							if( percent > 50 && percent < 100  )
							{
								$this.magazinify('nextPage');
							}
							else if( percent > 0 && percent < 50 )
							{
								$this.magazinify('flipPage', 0, true);
							}
							$document.data('clicking', false);
						}
					});
					$this.bind(touchStartEvent + '.magazinify', function(event){
						event.preventDefault();
						var _event = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
						var offset = $this.offset();
						var click_x = _event.pageX - offset.left;
						var click_y = _event.pageY - offset.top;
						// Clcik in the magazine area.
						if ( click_x > 0 && click_x < data.options.width * 2 + 2 * data.options.pageShadowWidth &&
							click_y > 0 && click_y < data.options.height + 2 * data.options.pageShadowWidth )
						{
							$document.data('clicking', $this);
							var current_page_percent = $this.find('.' + data.options.classes.sheet).eq( data.options.sheet ).data('percent');
							var percent = 100 - ( ( click_x ) * 100 / ( data.options.width * 2 ) );
							// Click on left sheet.
							if( click_x < data.options.width )
							{
								if( !current_page_percent || current_page_percent == 100 )
								{
									$this.magazinify('previousPage', percent);
								}
								else
								{
									$this.magazinify('flipPage', percent, true);
								}
							}
							else
							{
								$this.magazinify('flipPage', percent, true);
							}
						}
						// $this.magazinify('flipPage', percent );
					}).bind(touchMoveEvent + '.magazinify', function(event)
					{
						var $clicking = $document.data('clicking');
				 		if( $clicking === $this )
				 		{
							var _event = event.originalEvent.touches ? event.originalEvent.touches[ 0 ] : event;
							var offset = $this.offset();
							var percent = 100 - ( ( _event.pageX - offset.left ) * 100 / ( data.options.width * 2 ) );
							$this.magazinify('flipPage', percent );
				 		}
					});
					$this.data('magazinify', data);
				} // !data.magazinify
			});
			return this;
		},
		destroy: function( ) {
			this.each(function() {
				var $this = $(this),
				data = $this.data( 'magazinify' );
				
				// Remove created elements, unbind namespaced events, and remove data
				$this.removeClass(data.options.classes.magazinify).css({
					width: '',
					height: ''
				});
				$(document).unbind( '.magazinify' );
				$this.find('.' + data.options.classes.content).removeClass(data.options.classes.content).css({
					width: '',
					height: '',
					padding: '',
					boxShadow: ''
				}).appendTo(this);
				$this.find('.' + data.options.classes.shadow + ', .' + data.options.classes.sheet).remove();
				$this.unbind( '.magazinify' ).removeData( 'magazinify' );
			});
			return this;
		},
		options: function( options ) {
			this.each(function() {
				var $this = $(this),
				
				// don't use our getData() function here
				// because we want an object regardless
				data = $this.data( 'magazinify' ) || {},
				opts = data.options || {};

				// deep extend (merge) default settings, per-call options, and options set with:
				// html5 data-magazinify options JSON and $('selector').magazinify( 'options', {} );
				opts = $.extend( true, {}, $.fn.magazinify.defaults, opts, options || {} );
				data.options = opts;
				$.data( this, 'magazinify', data );
			});
			return this;
		},
		setSheet: function(sheet)
		{
			var rfxnum = /^([+\-]=)?([\d+.\-]+)$/i,
				parts = rfxnum.exec(sheet),
				data = this.data( 'magazinify' ),
				current_sheet = data.options.sheet;
			if( parts )
			{
				sheet = parseInt( parts[2], 10 );

				// If a +=/-= token was provided, we're doing a relative selection
				if ( parts[1] )
				{
					sheet = ((parts[1] === "-=" ? -1 : 1) * sheet) + current_sheet;
				}
			}
			data.options.sheet = Math.max( 0, Math.min( sheet, data.options.num_sheets ) );
			this.find('.' + data.options.classes.sheet).eq(data.options.sheet).addClass(data.options.classes.currentPAge);
			this.data('magazinify', data);
			return data.options.sheet;
		},
		nextPage: function(percent)
		{
			var _percent = typeof percent == 'number' ? percent : 100;
			var myThis = this;
			// get data.
			var data = this.data( 'magazinify' );
			var callback = function()
			{
				myThis.find('.' + data.options.classes.sheet).eq( data.options.sheet-1 ).css('zIndex', ( data.options.sheet - 1 ) );	
			};
			// Animate current page.
			this.magazinify('flipPage', _percent, true, callback);
			// Set next page as current one.
			data.options.sheet = this.magazinify('setSheet', data.options.sheet + 1 );
			// Save data.
			this.data('magazinify', data);
		},
		previousPage: function(percent)
		{
			var _percent = typeof percent == 'number' ? percent : 0;
			// get data.
			var data = this.data( 'magazinify' );
			// Animate previous page.
			data.options.sheet = this.magazinify('setSheet', data.options.sheet - 1 );
			var $sheet = this.find('.' + data.options.classes.sheet).eq(data.options.sheet).css('zIndex', ( 2 * data.options.num_sheets - data.options.sheet ) );
			
			// Save data.
			this.data('magazinify', data);
			
			if( $sheet.data('percent') != _percent )
			{
				// Animate current page.
				this.magazinify('flipPage', _percent, true);
			}
		},
		flipPage: function(percent, animate, callback) {
			var $this = $(this),
				data = $this.data( 'magazinify' ),
				method = animate ? 'animate' : 'css';
			var _percent = ( typeof percent == 'number' ? percent : 100 ) / 100;
			// .magazine .sheet { left:300px; }
			// .magazine:hover .sheet { left:10px; }
			var $sheet = $this.find('.' + data.options.classes.sheet).data('percent', percent).eq(data.options.sheet)[method]({
				width: data.options.width + data.options.pageShadowWidth + (_percent == 1 ? 0 : data.options.pageShadowWidth),
				left: Math.round( data.options.width * (1 - _percent) )
			}, data.options.duration * ( _percent ? _percent : 1) );
			// .magazine .page:nth-child(2n+1) { left:0px; width:300px; padding:10px; }
			// .magazine:hover .page:nth-child(2n+1) { left:310px; width:0; padding:10px 0; }
			
			$sheet.find('.' + data.options.classes.page + ':eq(0)')[method]({
				left: Math.round( ( data.options.width ) * _percent ),
				width: Math.round( data.options.width * (1 - _percent) )
			}, data.options.duration * ( _percent ? _percent : 1) );
			
			// .magazine .page:nth-child(2n) { left:320px; width:0; padding:10px 0; }
			// .magazine:hover .page:nth-child(2n) { left:0px; width:300px; padding:10px; }
			var $page = $sheet.find('.' + data.options.classes.page + ':eq(1)')[method]({
				left: Math.round( (data.options.width + 2 * data.options.pageShadowWidth ) * (1-_percent) ),
				width: Math.round( data.options.width * _percent )
			}, data.options.duration * ( _percent ? _percent : 1) );
			
			// .magazine .page:nth-child(2n) .content .shadow { left:0px; }
			// .magazine:hover .page:nth-child(2n) .content .shadow { left:280px; }
			$page.find('.' + data.options.classes.shadow)[method]({
				left: Math.max( 0, Math.round( ( data.options.width + (percent == 100 ? data.options.pageShadowWidth : 2 * data.options.pageShadowWidth) ) * _percent ) - data.options.contentShadowWidth - data.options.pageShadowWidth )
				//left: ( (data.options.width + 2 * data.options.pageShadowWidth ) * _percent ) - data.options.contentShadowWidth
			}, data.options.duration * ( _percent ? _percent : 1) );
			if(callback)
			{
				setTimeout(function()
				{
					callback();
				}, data.options.duration * 2*( _percent ? _percent : 1) );
			}
		}
	};

	var protoSlice = Array.prototype.slice;
	
	$.fn.magazinify = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, protoSlice.call( arguments, 1 ) );
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			return $.error( 'Method ' +  method + ' does not exist on jQuery.fn.magazinify' );
		}
	};

	$.extend($.fn.magazinify, {
		defaults: settings
	});
	function getData(el) {
		var magazinify,
			opts,
			$this = $(el),
			data = $this.data( 'magazinify' ) || {};
	
		if (!data.magazinify) { return false; }
		return data;
	}
})( jQuery );