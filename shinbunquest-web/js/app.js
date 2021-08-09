var stage;
var contentManager;

var CANVAS_SIZE = 600;

(function(){

	// $(document).on('touchmove',function(e){
	//   e.preventDefault();
	// });
	var selScrollable = '.scrollable';
	// Uses document because document will be topmost level in bubbling
	$(document).on('touchmove',function(e){
	  e.preventDefault();
	});
	// Uses body because jQuery on events are called off of the element they are
	// added to, so bubbling would not work if we used document instead.
	$('body').on('touchstart', selScrollable, function(e) {
	  if (e.currentTarget.scrollTop === 0) {
	    e.currentTarget.scrollTop = 1;
	  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
	    e.currentTarget.scrollTop -= 1;
	  }
	});
	// Stops preventDefault from being called on document if it sees a scrollable div
	$('body').on('touchmove', selScrollable, function(e) {
	  e.stopPropagation();
	});


	requirejs.config({
	    baseUrl: 'js'
	});


	// Used to download all needed resources from our webserver
	function ContentManager() {
	    // Method called back once all elements
	    // have been downloaded
	    var ondownloadcompleted;
	    // Number of elements to download

	    var images = [
	    	"res/title/title_bg.png",
	    	"res/bg/bg_boss.png",
	    	"res/bg/bg_town_1.png",
	    	"res/bg/bg_town_2.png",

	    	"res/char/char_1.png",
	    	"res/char/char_2.png",
	    	"res/char/char_3.png",
	    	"res/char/char_4.png",
	    	"res/char/char_5.png",
	    	"res/char/hero_walking.png",
	    	"res/title/title_start_button.png"
	    ];
	    var NUM_ELEMENTS_TO_DOWNLOAD = images.length;

	    // setting the callback method
	    this.SetDownloadCompleted = function (callbackMethod) {
	        ondownloadcompleted = callbackMethod;
	    };

	    
	    this.imgTitle = new Image();
	    this.imageTitleStartButton = new Image();

	    this.imgBossRoom = new Image();
	    this.imgTown_1 = new Image();
	    this.imgTown_2 = new Image();

	    this.img_char_1 = new Image();
	    this.img_char_2 = new Image();
	    this.img_char_3 = new Image();
	    this.img_char_4 = new Image();
	    this.img_char_5 = new Image();
	    this.img_char_hero = new Image();


	    var numImagesLoaded = 0;

	    // public method to launch the download process
	    this.StartDownload = function () {

	    	SetDownloadParameters(this.imgTitle, images[0], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.imgBossRoom, images[1], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.imgTown_1, images[2], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.imgTown_2, images[3], handleImageLoad, handleImageError);

	    	SetDownloadParameters(this.img_char_1, images[4], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.img_char_2, images[5], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.img_char_3, images[6], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.img_char_4, images[7], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.img_char_5, images[8], handleImageLoad, handleImageError);
	    	SetDownloadParameters(this.img_char_hero, images[9], handleImageLoad, handleImageError);

	    	SetDownloadParameters(this.imageTitleStartButton, images[10], handleImageLoad, handleImageError);

	    }

	    function SetDownloadParameters(imgElement, url, loadedHandler, errorHandler) {
	        imgElement.src = url;
	        imgElement.onload = loadedHandler;
	        imgElement.onerror = errorHandler;
	    }

	    // our global handler 
	    function handleImageLoad(e) {
	        numImagesLoaded++

	        // If all elements have been downloaded
	        if (numImagesLoaded == NUM_ELEMENTS_TO_DOWNLOAD) {
	            numImagesLoaded = 0;
	            // we're calling back the method set by SetDownloadCompleted
	            ondownloadcompleted();
	        }
	    }

	    //called if there is an error loading the image (usually due to a 404)
	    function handleImageError(e) {
	        console.log("Error Loading Image : " + e.target.src);
	    }

	    this.showNextGameScene = function(sceneNumber){

	    	stage.hideDialogBox();

	    	var background = new createjs.Shape();
			background.graphics.beginFill("black").drawRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			stage.addChild(background);
			console.log("Prepare to scene"+sceneNumber);
	    	$.getJSON( "res/data/scene"+sceneNumber+".json", function( data ) {

	    		console.log("Show Scene"+sceneNumber);

	    		stage.removeChild(background);
	    		requirejs(['scene/gamescene'],function(gamescene){
	    			gamescene.startSceneWithData(data);	
	    		});
			});
	    	
	    	

	    }
	}

	var updateCanvas = function(){

		var canvas = $('#gameCanvas')[0];

		var MAX_SIZE = 1200; // 600 * 2

		var size = (window.innerWidth > window.innerHeight)?window.innerHeight:window.innerWidth ;
		
		if(size > MAX_SIZE){
			size = MAX_SIZE;
		}


	    if(!stage){


	    	canvas.setAttribute('width', CANVAS_SIZE);
		    canvas.setAttribute('height', CANVAS_SIZE);
	    	// create a new stage and point it at our canvas:
		    stage = new createjs.Stage('gameCanvas');
		    createjs.Touch.enable(stage);

		    var background = new createjs.Shape();
			background.graphics.beginFill("black").drawRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			stage.addChild(background);

			stage.updateDialogBox = function(){
				console.log("updateDialogBox");
				var dialogBox =  $("#dialog-box");
				var canvasOffset = $(canvas).offset();
								
				var dialogWidth = canvas.style.width.replace('px', '');
				var dialogHeight = canvas.style.height.replace('px', '') / 2;

				dialogWidth -= (2 * 2) //Border
				dialogHeight -= (2 * 2) //Border

				
				var offsetTop = canvasOffset.top + dialogHeight;
				var offsetLeft = canvasOffset.left;

				var fontSize = dialogWidth / CANVAS_SIZE * 100 * 2 ;// * percent * multiplier
				if(fontSize < 100){
					fontSize = 100; //Min 100%
				}else if(fontSize > 400){
					fontSize = 400; //MAX 400%
				}							
				fontSize += '%';		 
				console.log('Font Size : ' +fontSize);


				dialogBox.css({ top: offsetTop, left: offsetLeft, 'font-size': fontSize});

				dialogBox.width(dialogWidth);
				dialogBox.height(dialogHeight);

				var DIALOG_CONTENT_PADDING = 10;

				var dialogName = $('#dialog-name');

				var dialogContent = $('#dialog-content');

				var nameFontSize = $("#dialog-name").css("fontSize");
				nameFontSize = nameFontSize.replace('px','');

				dialogName.width(dialogWidth);
				dialogContent.width(dialogWidth - (DIALOG_CONTENT_PADDING * 2));

				dialogContent.height(dialogHeight - nameFontSize - (DIALOG_CONTENT_PADDING * 3));

				dialogContent.css({ 'padding-left': DIALOG_CONTENT_PADDING});
				dialogContent.scrollTop(0);


			}
			stage.showDialogBox = function(name, text, onClickDialogBox){

				var dialogBox =  $("#dialog-box");

				var dialogName = $('#dialog-name');
				if(name){
					dialogName.text('<'+name+'>');
				}

				// var DIALOG_CONTENT_PADDING = 10;

				var dialogContent = $('#dialog-content');
				if(text){
					var content = text.split('\n').join('<br/>') + '<br/><br/>';
					dialogContent.html(content);
				}


				dialogBox.show();
				stage.isDialogBoxShown = true;
				stage.updateDialogBox();
				

				dialogBox.off("click").on( "click", function(e){
					e.stopPropagation();
					dialogBox.off("click");

					stage.hideDialogBox();
				
					setTimeout(function() {
						if(onClickDialogBox){
							onClickDialogBox(e);
						}
					}, 0);
					
				});
				
			}
			stage.hideDialogBox = function(){
				if(stage.isDialogBoxShown){
					$("#dialog-box").off("click").hide();
					stage.isDialogBoxShown = false;
				}
			}
			stage.showSelectionAlert = function (title, items, callbacks){

				var BUTTON_PADDING = 100;
				var BUTTON_FONT_SIZE = 24;
				var BUTTON_HEIGHT = BUTTON_FONT_SIZE + 10;


				var container = new createjs.Container();

				var overlay = new createjs.Shape();
				overlay.graphics.beginFill("black").drawRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
				container.addChild(overlay);
				stage.addChild(container);


				var txt = new createjs.Text(title, BUTTON_FONT_SIZE +"px Arial", "#FF0");
				var bounds = txt.getBounds();
				txt.x = 10;
				txt.y = 50;
                container.addChild(txt);



				
				var BUTTON_PANEL_HEIGHT = items.length * BUTTON_FONT_SIZE + (items.length - 1) * BUTTON_PADDING;
				var BUTTON_TOP_FROM_CONTAINER = (CANVAS_SIZE -BUTTON_PANEL_HEIGHT) / 2;
				for (var i = 0; i < items.length; i++){

					var shape = new createjs.Shape();

	                shape.x = BUTTON_PADDING / 2;
	                shape.y = BUTTON_PADDING * i + BUTTON_TOP_FROM_CONTAINER ;

					var txt = new createjs.Text(items[i], BUTTON_FONT_SIZE +"px Arial", "#000");
					var bounds = txt.getBounds();

					txt.x = (CANVAS_SIZE - bounds.width) / 2;
					txt.y = shape.y + 5;
					
	                container.addChild(shape);
	                container.addChild(txt);
	                var shapeColor = "#CCC"
	                shape.graphics.beginFill(shapeColor).drawRect(0, 0, CANVAS_SIZE - ( BUTTON_PADDING ), 32+10);

					stage.update();	
					shape.addEventListener("click", function(){
						container.removeAllEventListeners();
						stage.removeChild(container);
						this.callback();
					}.bind({callback:callbacks[i]})); 
				}

			}

		}


		var scale = size / CANVAS_SIZE;

    	if (window.devicePixelRatio) {
		    // grab the width and height from canvas    
		    // reset the canvas width and height with window.devicePixelRatio applied
		    canvas.setAttribute('width', Math.round(size * window.devicePixelRatio));
		    canvas.setAttribute('height', Math.round( size * window.devicePixelRatio));
		    // set CreateJS to render scaled
		    scale = scale * window.devicePixelRatio;
			
		}else{
			canvas.setAttribute('width', size);
		    canvas.setAttribute('height', size);
		}
		console.log("Scale : " + scale);
		console.log("Size : " + size);
		stage.scaleX = stage.scaleY = scale;

	    // force the canvas back to the original size using css
	    canvas.style.width = size+"px";
	    canvas.style.height = size+"px";

	    if(stage.isDialogBoxShown){
	    	//Update size
	    	stage.updateDialogBox();
	    	$("#dialog-box").show();
	    }
	}
	
		
	var resizeTimer;
	$( document ).ready(function() {

		$( window ).resize(function() {
			console.log("Resize");

			$("#dialog-box").hide();
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(updateCanvas, 500);

		});

		function orientationChecker(){

			var ori = window.orientation;
		    if(ori == 90 || ori == -90){

		    	$('#orientationAlert').modal({backdrop:'static', keyboard:false, show:true});
		    }else{
		    	$('#orientationAlert').modal('hide');
		    }

		}
		$(window).bind( 'orientationchange', function(e){
		    orientationChecker();
		});
		orientationChecker();

		updateCanvas();


	    //Set fps
	    createjs.Ticker.setFPS(20);
		// in order for the stage to continue to redraw when the Ticker is paused we need to add it with
		// the second ("pauseable") param set to false.
		createjs.Ticker.addEventListener("tick", stage);

	    // grab canvas width and height for later calculations:
	    contentManager = new ContentManager();
	    contentManager.SetDownloadCompleted(function(){ requirejs(['scene/title']); });
	    contentManager.StartDownload();

	});

}());
