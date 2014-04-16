var LEONARD = {

	init : function() {
		this.hashChange();
		this.loadSite();
	},
	loadSite : function() {
		this.galleryLoad();
	},
	galleryLoad : function() {
		this.preloadImages(imagesSrc).done(function(images) {
			
		});
	},
	preloadImages : function(arr) {
	
		var newimages = [], loadedimages = 0, THIS = this;
		var postaction = function(){};
		var loaderObj = this.initSiteLoader();
		var arr = (typeof arr != "object") ? [arr] : arr;
		function imageloadpost(){
			loadedimages++;
			var loadedPercent = parseInt((loadedimages / arr.length) * 100);
			$('#loaderContainer h1 span').text(loadedPercent + '%');
			THIS.animateSiteLoader(loadedPercent / 100, loaderObj[0], loaderObj[1]); 
			if (loadedimages == arr.length){
				postaction(newimages); // pass newimages to done function
			}
		}
		for (var i=0; i<arr.length; i++){
			newimages[i] = new Image();
			newimages[i].src = arr[i];
			newimages[i].onload = function(){
				imageloadpost();
			}
			newimages[i].onerror = function(){
				imageloadpost();
			}
		}
		return {
			done:function(f){
				postaction = f || postaction;
			}
		}
	},
	initSiteLoader : function() {
		var THIS = this;
		var diameter = 100,
		ringThickness = 1,
		margin = {left:40, right:40, top:10, bottom:10};
		//these are all *relative* units, which will scale
		//to fill the SVG

		var svg = d3.select("#siteLoader").append("svg")
			.attr("height", "100%")
			.attr("width", "100%")
			.attr("viewBox", 
				  "0 0 " + (margin.left + diameter + margin.right) +
				  " " + (margin.top + diameter + margin.bottom) )
				
			.attr("preserveAspectRatio", "xMidYMid meet");
			   //maintain aspect ratio,
			   //fit the viewbox within the svg (meet)
			   //and center it vertically and horizontally
		var vis = svg.append("g")
			.attr("transform", 
				  "translate(" + (margin.left + diameter/2) + ","
				  + (margin.top + diameter/2) + ")");

		var arc = d3.svg.arc()
			.outerRadius(diameter/2)
			.innerRadius(diameter/2 - ringThickness)
			.startAngle(0);

		var τ = 2 * Math.PI;
		// Add the background arc, from 0 to 100% (τ)
		var background = vis.append("path")
			.datum({endAngle: τ})
			.style("fill", "#D6D2D2")
			.attr("d", arc);

		// Add the foreground arc
		var foreground = vis.append("path")
			.datum({endAngle: 0 * τ})
			.style("fill", "#16a6bc")
			.attr("d", arc);
		
		return [arc, foreground];
	},
	animateSiteLoader : function(newAngle, arc, foreground) {
		var THIS = this, τ = 2 * Math.PI;
		foreground.transition()
		  .duration(100)
		  .call(THIS.arcTween, newAngle * τ, arc);
		  if(newAngle == 1) {
			d3.transition().each('end', function() {
				$.bbq.pushState('#!/whoiam');
				$(window).trigger('hashchange');
				$('#loaderContainer h1').fadeOut(100);
				$('#siteContainer').css('display', 'block');
				$('.loader').fadeOut(1000, function() {
					$(this).remove();
				});
			});
		  }
	},
	arcTween : function(transition, newAngle, arc) {
		transition.attrTween("d", function(d) {
			var interpolate = d3.interpolate(d.endAngle, newAngle);
			return function(t) {
			  d.endAngle = interpolate(t);
			  return arc(d);
			};
		});
	},
	hashChange : function() {
		var THIS = this;
		$(window).bind('hashchange', function(e) {
			var url = $.bbq.getState(), key, arr = [], thisPageStr;
			if($('#siteLoader').length < 1) {
				$('.loader').remove();
				var loaderDiv = $('<div />', {
					'class' : 'loader pageLoader'
				});
				loaderDiv.append($('<div />', {
					'id' : 'pageLoader'
				}));
				$('#wrapper').append(loaderDiv);
				$('.loader.pageLoader').stop().animate({
					'top' : '0%'
				}, 300);
				$('#pageLoader').stop().animate({
					'top' : '20%'
				}, 300);
				THIS.pageLoad();
			}
			for(var key in url) {
				if(url.hasOwnProperty(key)) {
					arr.push(key);
				}
			}
			thisPageStr = arr[0].replace('!/', '');
			$article.css({
				'display' : 'none',
				'left' : '100%'
			});
			if($.inArray(thisPageStr, pagesArr) != -1) {
				THIS[thisPageStr](thisPageStr);
			}else{
				THIS.pageNotFound();
			}
			
		});
	},
	pageLoad : function() {
		this.preloadPage(imagesSrc2).done(function(images) {
			
		});
	},
	preloadPage : function(arr) {
	
		var newimages = [], loadedimages = 0, THIS = this;
		var postaction = function(){};
		var loaderObj = this.initPageLoader();
		var arr = (typeof arr != "object") ? [arr] : arr;
		function imageloadpost(){
			loadedimages++;
			var loadedPercent = parseInt((loadedimages / arr.length) * 100);
			
			THIS.animatePageLoader(loadedPercent / 100, loaderObj[0], loaderObj[1]);
			if (loadedimages == arr.length){
				postaction(newimages); // pass newimages to done function
			}
		}
		for (var i=0; i<arr.length; i++){
			newimages[i] = new Image();
			newimages[i].src = arr[i];
			newimages[i].onload = function(){
				imageloadpost();
			}
			newimages[i].onerror = function(){
				imageloadpost();
			}
		}
		return {
			done:function(f){
				postaction = f || postaction;
			}
		}
	},
	initPageLoader : function() {
		var THIS = this;
		var diameter = 100,
		ringThickness = 1,
		margin = {left:40, right:40, top:10, bottom:10};
		//these are all *relative* units, which will scale
		//to fill the SVG

		var svg = d3.select("#pageLoader").append("svg")
			.attr("height", "100%")
			.attr("width", "100%")
			.attr("viewBox", 
				  "0 0 " + (margin.left + diameter + margin.right) +
				  " " + (margin.top + diameter + margin.bottom) )
				
			.attr("preserveAspectRatio", "xMidYMid meet");
			   //maintain aspect ratio,
			   //fit the viewbox within the svg (meet)
			   //and center it vertically and horizontally
		var vis = svg.append("g")
			.attr("transform", 
				  "translate(" + (margin.left + diameter/2) + ","
				  + (margin.top + diameter/2) + ")");

		var arc = d3.svg.arc()
			.outerRadius(diameter/2)
			.innerRadius(diameter/2 - ringThickness)
			.startAngle(0);

		var τ = 2 * Math.PI;
		// Add the background arc, from 0 to 100% (τ)
		var background = vis.append("path")
			.datum({endAngle: τ})
			.style("fill", "#D6D2D2")
			.attr("d", arc);

		// Add the foreground arc
		var foreground = vis.append("path")
			.datum({endAngle: 0 * τ})
			.style("fill", "#16a6bc")
			.attr("d", arc);
		
		return [arc, foreground];
	},
	animatePageLoader : function(newAngle, arc, foreground) {
		var THIS = this, τ = 2 * Math.PI;
		foreground.transition()
		  .duration(100)
		  .call(THIS.arcTween, newAngle * τ, arc);
		  if(newAngle == 1) {
			d3.transition().each(function() {
				setTimeout(function() {
					$('.loader').fadeOut(1000, function() {
						$(this).remove();
					});
				}, 400);
			});
		  }
	},
	whoiam : function(id) {
		this.pageMove(id);
		
	},
	whatido : function(id) {
		this.pageMove(id);
		this.drawSquiggly();
	},
	experiments : function(id) {
		this.pageMove(id);
	},
	findme : function(id) {
		this.pageMove(id);
	},
	pageMove : function(id) {
		$('#' + id).css({
			'left' : '0%',
			'display' : 'block'
		});
	},
	pageNotFound : function() {
		console.log('error ! page not found !');
	},
	drawSquiggly : function() {
		var THIS = this;
		var diameter = 100,
		ringThickness = 1, τ = 2 * Math.PI,
		margin = {left:40, right:40, top:10, bottom:10};
		//these are all *relative* units, which will scale
		//to fill the SVG
		$whatido.find('svg').remove();
		var svg = d3.select("#whatido").append("svg")
			.attr("height", "100%")
			.attr("width", "100%")
			.attr("viewBox", 
				  "0 0 " + (margin.left + diameter + margin.right) +
				  " " + (margin.top + diameter + margin.bottom) )
				
			.attr("preserveAspectRatio", "xMidYMid meet");
			   //maintain aspect ratio,
			   //fit the viewbox within the svg (meet)
			   //and center it vertically and horizontally
		var vis = svg.append("g")
			.attr("transform", 
				  "translate(" + (margin.left + diameter/2) + ","
				  + (margin.top + diameter/2) + ")");

		var arc = d3.svg.arc()
			.outerRadius(diameter/2)
			.innerRadius(diameter/2 - ringThickness)
			.startAngle(0);

		var τ = 2 * Math.PI;
		// Add the background arc, from 0 to 100% (τ)
		var background = vis.append("path")
			.datum({endAngle: τ})
			.style("fill", "#D6D2D2")
			.attr("d", arc);

		// Add the foreground arc
		var foreground = vis.append("path")
			.datum({endAngle: 0 * τ})
			.style("fill", "#16a6bc")
			.attr("d", arc);

		foreground.transition()
		  .duration(100)
		  .call(THIS.arcTween, 0.6 * τ, arc);		
	}
};

var imagesSrc = [
	'http://24.media.tumblr.com/tumblr_lrem7bqpGN1qfkaqso1_500.gif',
	'http://th07.deviantart.net/fs70/200H/i/2012/206/c/2/wind_waker_makorra_contest_prize_by_wolfy_lemur-d58lrem.jpg',
	'http://fc00.deviantart.net/fs71/i/2012/175/9/d/youtube_button_by_wolfy_lemur-d54r4g7.png',
	'http://th06.deviantart.net/fs70/300W/i/2013/244/2/e/virginie_by_3lrem-d6kl6lg.jpg',
	'http://fc06.deviantart.net/fs71/i/2013/226/3/9/8531_by_darktoys2012-d6i41b7.jpg',
	'http://sophieleroybook.com/img/web_works/prod-effect-agence1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-conception1.jpg' /*, 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-contact1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-creation1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-gallery1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-metiers1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-production1.jpg', 
	'http://www.sophieleroybook.com/img/web_works/prod-effect-tiles1.jpg',
	'http://www.lsst.org/News/images/LSST_Rendering_VK.jpg' */
	];
	var imagesSrc2 = [
	'https://fbstatic-a.akamaihd.net/rsrc.php/v1/yK/r/TYF-zbYYYvn.jpg',
	'http://upload.wikimedia.org/wikipedia/commons/2/22/Canada_Search_and_Rescue.jpg',
	'http://cdn.marklogic.com/images/2012/09/Typical-Search-Environment.jpg',
	'http://searchengineland.com/figz/wp-content/seloads/2012/11/zoo-Google-Search-600x1102.jpg',
	'http://news.cnet.com/i/bto/20090129/firefox_msft_live_search.jpg',
	'http://www.dailygalaxy.com/.a/6a00d8341bf7f753ef019b007734cb970b-pi',
	'http://soffff.files.wordpress.com/2010/10/google-voice-search-mobile-app-covent-garden-large-167871.jpg'
	];
	
var pagesArr = [
	'whoiam',
	'whatido',
	'experiments',
	'findme'
	];
	
var $article = $('.article'), $whatido = $('#whatido');
	
LEONARD.init();
var aspect = 960 / 500;
$(function() {
	$(window).resize(function(){
		
	});
	
});