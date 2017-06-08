(function($){
	$.fn.magnify = function(options) { 
		
		$.fn.magnify.defaults = {
			width: 100,
			height: 100,
			fit: 'yes'
		};
		
		var options = $.extend($.fn.magnify.defaults, options);

		// Break if required big or dest arguments are missing
		if (!options.big || !options.dest || !options.small) { return this; }		
		
		return this.each(function() {
			var $element = $(this);
			var element_id = $element.attr('id');
					
			var img_loaded = 0;
			var width_ratio = 0;
			var height_ratio = 0;
			
			var rad_x = options.width / 2;
			var rad_y = options.height / 2;
					
			var ctx = document.getElementById(element_id).getContext('2d');  
			var img = new Image();
			img.src = options.small; 
			
			img.onload = function(){  
				// Fit canvas to image if applicable
				if (options.fit == "yes") {
					document.getElementById(element_id).width = img.width;
					document.getElementById(element_id).height = img.height;
				}
				// Draw image
				ctx.drawImage(img,0,0);
				if (big_img.width > 0) { img_loaded = 1; }
			}  	
			
			// Get height and width of big image
			var big_img = new Image();
			big_img.src = options.big;
			big_img.onload = function(){
				if (img.width > 0) { img_loaded = 1; findRatio(); }
			}
			
			function findRatio() {
				width_ratio = big_img.width / img.width;
				height_ratio = big_img.height / img.height; 
				document.getElementById(options.dest).width = options.width*width_ratio;
				document.getElementById(options.dest).height = options.height*height_ratio;
			}
			
			$element.mousemove(function(event) {
				var x = event.pageX - document.getElementById(element_id).offsetLeft;
				var y = event.pageY - document.getElementById(element_id).offsetTop;
				
				// Make sure overlay stays in canvas
				if (x < rad_x) { x = rad_x; }
				if (y < rad_y) { y = rad_y; }
				if (x > ($element.width() - rad_x)) { x = $element.width() - rad_x; }
				if (y > ($element.height() - rad_y)) { y = $element.height() - rad_y; }
				
				// Reset canvas
				ctx.drawImage(img,0,0);

				//Draw overlay
				ctx.fillStyle = "rgba(200,200,200,.5)";
				ctx.fillRect(0,0,img.width,img.height);
				ctx.drawImage(img,x-rad_x,y-rad_y,options.width,options.height,x-rad_x,y-rad_y,options.width,options.height);
				
				if (img_loaded == 1) {
					var zoom = document.getElementById(options.dest).getContext('2d');
					
					var x = event.pageX - document.getElementById(element_id).offsetLeft;
					var y = event.pageY - document.getElementById(element_id).offsetTop;
					var source_x = x - rad_x;
					var source_y = y - rad_y;
					
					// Protect edges
					if (source_x < 0) { source_x = 0; }
					if (source_y < 0) { source_y = 0; }
					if (source_x > ($element.width() - options.width)) { source_x = $element.width() - options.width; }
					if (source_y > ($element.height() - options.height)) { source_y = $element.height() - options.height; }
					
					zoom.drawImage(big_img, source_x*width_ratio, source_y*height_ratio, options.width*width_ratio, options.height*height_ratio, 0, 0, options.width*width_ratio, options.height*height_ratio);
				}
			});
			
			$element.mouseout(function() {
				ctx.drawImage(img,0,0);
			});
			
		});
	};
})(jQuery);