define(function (require) {



	var titleBitmap = new createjs.Bitmap(contentManager.imgTitle);
	titleBitmap.alpha = 0;
	// stage.addChild(titleBitmap);


	// Create a new Text object, and position it on stage:
	// var txt = new createjs.Text("Tap to Start!", "36px Arial", "#FFF");
	var txt = new createjs.Bitmap(contentManager.imageTitleStartButton);
	var bounds = txt.getBounds();

	txt.x = (CANVAS_SIZE - bounds.width) / 2;
	txt.y = (CANVAS_SIZE - bounds.height) / 3 * 2;
	txt.alpha = 0;
	// txt.outline = true;	


	
	var container = new createjs.Container();
	container.addChild(titleBitmap);
	container.addChild(txt);
	stage.addChild(container);
	stage.update();	


	// createjs.Tween.get(txt,{loop:true}).to({ alpha:0}, 800).to({ alpha:1}, 800);
	createjs.Tween.get(titleBitmap,{loop:false}).to({ alpha:0}, 800).to({ alpha:1}, 800).call(
		function(){
			//Message
			createjs.Tween.get(txt,{loop:true}).to({ alpha:1}, 800).to({ alpha:0}, 800);
			container.addEventListener("click", goToGameScene); 
		}
	);

	function goToGameScene(){

		//TODO: Animation
		container.removeAllEventListeners();
		stage.removeChild(container);
		contentManager.showNextGameScene(1);

	}


});