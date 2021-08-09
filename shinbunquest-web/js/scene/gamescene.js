define(function (require) {
return {
startSceneWithData: function(data){

	var container;
	var SCENE_STATUS = {};

	var sceneNumber = data.sceneNumber;

	function clearContainer(){
		if(container){
			container.removeAllEventListeners();
			stage.removeChild(container);
		}
		stage.hideDialogBox();
		container = null;
	}

	

	function changeState_Boss_GettingQuest(){

		clearContainer();

		container = new createjs.Container();
		container.alpha = 0;
		var bgBitmap = new createjs.Bitmap(contentManager.imgBossRoom);
		container.addChild(bgBitmap);

		stage.addChild(container);
		stage.update();	

		//Show Boss Room
		createjs.Tween.get(container,{loop:false}).to({ alpha:0}, 800).to({ alpha:1}, 800).call(
		function(){
			if(sceneNumber == 1){

				//Show Dialog - Information
				stage.showDialogBox(data.informationName, data.initialTipScript, function(){

					stage.showDialogBox(data.informationName, data.welcomeScript, function(){
						container.addEventListener("click", function(e){ 
							stage.showDialogBox(data.bossName, data.bossGettingQuestScript, function(){
								changeState_Town();
							});

						});

					});

				});

			}else{

				stage.showDialogBox(data.bossName, data.bossGettingQuestScript, function(){
					changeState_Town();
				});

			}
			

		});
	};

	function changeState_Town(){

		clearContainer();

		container = new createjs.Container();
		container.alpha = 0;
		var bgBitmap = new createjs.Bitmap(contentManager['imgTown_'+sceneNumber]);
		container.addChild(bgBitmap);


		var heroSpriteData = {
		     images: [contentManager['img_char_hero']],
		     frames: {width:62, height:69},
		     animations: {stop:[1], run:[0,2]},
		     framerate: 6
		 };
		 var heroSpriteSheet = new createjs.SpriteSheet(heroSpriteData);
		 var heroSprite = new createjs.Sprite(heroSpriteSheet, "stop");

		heroSprite.x = CANVAS_SIZE / 2;
		heroSprite.y = CANVAS_SIZE / 2;

		container.addChild(heroSprite);
		// createjs.Tween.get(heroSprite,{loop:true}).to({ alpha:1}, 800).to({ alpha:0}, 800);

		var heroIndex = container.getChildIndex(heroSprite);


		var npcs = data.npcs;

		for (var i = 0; i < npcs.length; i++){

			var npc = npcs[i];
			var npcName = npc[0];
			var npcImage = npc[1];
			var npcPositionX = npc[2];
			var npcPositionY = npc[3];
			var npcScript = npc[4];

			var npcSpirte = new createjs.Bitmap(contentManager[npcImage]);
			npcSpirte.x = CANVAS_SIZE / 100 * npcPositionX;
			npcSpirte.y = CANVAS_SIZE / 100 * npcPositionY;



			npcSpirte.addEventListener("click", function(){

				if(SCENE_STATUS.moving == true) return;

				SCENE_STATUS.moving = true;
				heroSprite.gotoAndPlay("run");

				var distance = Math.sqrt(Math.pow(heroSprite.x + 50 - this.npcSpirte.x, 2) + Math.pow(heroSprite.y - this.npcSpirte.y, 2));
				var speed = distance * 5
				console.log("distance : "+distance);
				console.log("speed :" +speed);
				createjs.Tween.get(heroSprite,{loop:false}).to({ x:this.npcSpirte.x - 50, y: this.npcSpirte.y}, speed).call(
					function(){
						SCENE_STATUS.moving = false;
						heroSprite.gotoAndPlay("stop");
						stage.showDialogBox(this.npcName, this.npcScript, function(e){});
					}.bind({npcName:this.npcName, npcScript:this.npcScript, npcSpirte:this.npcSpirte})
				);
			}.bind({npcName:npcName, npcScript:npcScript, npcSpirte:npcSpirte}));

			container.addChildAt(npcSpirte, heroIndex+i);
		};


		stage.addChild(container);
		stage.update();	



		function showGoToBossButton(){
			var txt = new createjs.Text("< BOSSへ", "24px Arial", "#FF0");
			var bounds = txt.getBounds();
			txt.x = 10;
			// txt.y = CANVAS_SIZE - 160;
			txt.y = CANVAS_SIZE - 70;
			txt.alpha = 0;
			// txt.outline = true;	
			

			var shape = new createjs.Shape();
	        shape.x = txt.x;
	        shape.y = txt.y;
	        container.addChild(shape);
	        container.addChild(txt);
	        // var shapeColor = "#CCC"
	        var shapeColor = "#000";
	        shape.graphics.beginFill(shapeColor).drawRect(-10, -10, txt.getMeasuredWidth()+20, 24+20);


			stage.update();	
			createjs.Tween.get(txt,{loop:true}).to({ alpha:1}, 800).to({ alpha:0}, 800);
			shape.addEventListener("click", changeState_Boss_TryToClearQuest); 

		}
		//Show Town
		createjs.Tween.get(container,{loop:false}).to({ alpha:0}, 800).to({ alpha:1}, 800).call(
		function(){

			showGoToBossButton();

			if(SCENE_STATUS.shownInformation != true && sceneNumber == 1){
				SCENE_STATUS.shownInformation = true;

				stage.showDialogBox(data.informationName, data.townDefaultScript, function(){});
			}
		});
	}

	function changeState_Boss_TryToClearQuest(){

		clearContainer();

		container = new createjs.Container();
		container.alpha = 0;
		var bgBitmap = new createjs.Bitmap(contentManager.imgBossRoom);
		container.addChild(bgBitmap);

		stage.addChild(container);
		stage.update();	

		//Show Boss Room
		createjs.Tween.get(container,{loop:false}).to({ alpha:0}, 800).to({ alpha:1}, 800).call(
		function(){
			//Show Dialog - Try to clear quest
			stage.showDialogBox(data.bossName, data.bossClearQuestScript, function(){

				var callbacks = [];

				var wrongAnswerCallback = function(){

					stage.showDialogBox(data.bossName, data.questFailScript, changeState_Town);
					
				}

				var rightAnswerCallback = function(){

					stage.showDialogBox(data.bossName, data.questSuccessScript, function(){
						if(data.nextScene > 0){

							container.removeAllEventListeners();
							stage.removeChild(container);
							contentManager.showNextGameScene(data.nextScene);

						}else{
							var overlay = new createjs.Shape();
							overlay.graphics.beginFill("black").drawRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
							container.addChild(overlay);
							stage.addChild(container);

							var txt = new createjs.Text("Congratulations!", 48 +"px Arial", "#FF0");
							var bounds = txt.getBounds();
							txt.x = (CANVAS_SIZE - bounds.width) / 2;
							txt.y = (CANVAS_SIZE - bounds.height) / 3 * 1;
			                container.addChild(txt);
			                createjs.Tween.get(txt,{loop:true}).to({ alpha:0}, 800).to({ alpha:1}, 800);

							txt = new createjs.Text("今回の依頼は以上だ。次の活躍も期待しているぞ！", 24 +"px Arial", "#6a2");
							var bounds = txt.getBounds();
							txt.x = (CANVAS_SIZE - bounds.width) / 2;
							txt.y = (CANVAS_SIZE - bounds.height) / 3 * 2;
			                container.addChild(txt);

						}
					});
				}

				for (var i = 0; i < data.questAnswerList.length; i ++){
					if(i == data.questCorrectAnswerIndex){
						callbacks.push(rightAnswerCallback);
					}else{
						callbacks.push(wrongAnswerCallback);
					}
				};

				stage.showSelectionAlert(data.questAnswerTitle, data.questAnswerList,callbacks);

			}); 

		});
	}
	//Start
	changeState_Boss_GettingQuest();
}}
});