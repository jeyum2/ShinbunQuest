//
//  ViewController.swift
//  ShinbunQuest
//
//  Created by je on 6/7/14.
//  Copyright (c) 2014 mulodo. All rights reserved.
//

import UIKit


class TownViewController: UIViewController {
    
    enum GameState{
        case GetQuest,
        InTown,
        QuestComplete
    }
                            
    @IBOutlet var sceneBackgroundImageView : UIImageView
    
    @IBOutlet var charNameLabel : UILabel
    @IBOutlet var scriptTextView : UITextView


    @IBOutlet var goToTownButton : UIButton
    @IBOutlet var clearQuestButton : UIButton
    
    var worldWidth:Int = 0;
    var worldHeight:Int = 0;
    var npcModels:Dictionary<Int, NPCModel> = [:];
    var heroModel:HEROModel?;
    let fadeAnimationInterval:Float = 0.5;
    var currentGameState:GameState = GameState.GetQuest;
    var shinBunData:ShinBunData?
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        self.scriptTextView.textColor = UIColor.whiteColor();

        self.worldWidth = Int(self.sceneBackgroundImageView.frame.size.width);
        self.worldHeight = Int(self.sceneBackgroundImageView.frame.size.height);
                
        self.shinBunData = ShinBunData();
        
        
        println("World Width : \(self.worldWidth) Height : \(self.worldHeight)");

        
        //Start With GetQuest(Welcome script)
        var tapGestureRecognizer:UITapGestureRecognizer = UITapGestureRecognizer(target: self, action:Selector("handleBackgroundTap:"));
        self.sceneBackgroundImageView.addGestureRecognizer(tapGestureRecognizer);
        
        self.currentGameState = GameState.GetQuest;
        self.clearQuestButton.hidden = true;
        self.goToTownButton.hidden = true;
        
        self.sceneBackgroundImageView.image = UIImage(named: "boss_room");
        
        self.changeScript(self.shinBunData!.welcomeScript, name: "");
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func positionValidator(position:Int) -> Int{
        if position > 100 || position < 0 {
            return 0;
        }
        return position;
    }
    
    func addNPC(id:Int, name:String, script:String, locationPercentX:Int, locationPercentY:Int) {
        
        let npcImage:UIImage = UIImage(named: "NPC");
        let npcSprite:UIImageView = UIImageView(image: npcImage);
        npcSprite.tag = id;
        npcSprite.userInteractionEnabled = true;
        
        var tapGestureRecognizer:UITapGestureRecognizer = UITapGestureRecognizer(target: self, action:Selector("handleTap:"));
        npcSprite.addGestureRecognizer(tapGestureRecognizer);

        
        var positionX = self.worldWidth * positionValidator(locationPercentX) / 100;
        var positionY = self.worldHeight * positionValidator(locationPercentY) / 100;
        
        var frame = npcSprite.frame;
        frame.origin.x = CGFloat(positionX);
        frame.origin.y = CGFloat(positionY);
        npcSprite.frame = frame;
        self.sceneBackgroundImageView.insertSubview(npcSprite, belowSubview: self.heroModel!.sprite);

        var model:NPCModel = NPCModel(name: name, sprite: npcSprite, script: script);
        
        self.npcModels[id] = model;
        
    }
    
    func addHERO(){
        
        if self.heroModel != nil {
            return;
        }
        
        let heroImage:UIImage = UIImage(named: "HERO");
        let heroSprite:UIImageView = UIImageView(image: heroImage);
        
        var positionX = self.worldWidth * 50 / 100; //Center X
        var positionY = self.worldHeight * 50 / 100; //Center Y
        
        var frame = heroSprite.frame;
        frame.origin.x = CGFloat(positionX);
        frame.origin.y = CGFloat(positionY);
        heroSprite.frame = frame;
        
        self.sceneBackgroundImageView.insertSubview(heroSprite, atIndex: 10);
        var model:HEROModel = HEROModel(name: self.shinBunData!.heroName, sprite: heroSprite);
        
        self.heroModel = model;
        
    }
    func handleBackgroundTap(recognizer:UITapGestureRecognizer){
        switch self.currentGameState{
            case .GetQuest:
                self.goToTownButton.hidden = false;
                self.clearQuestButton.hidden = true;
                changeScript(self.shinBunData!.bossGettingQuestScript, name: self.shinBunData!.bossName);
            case .QuestComplete:
                
                self.showQuestAlert();
            
            default:
                println("Nothing To Do")
        }
        
    }
    
    func handleTap(recognizer:UITapGestureRecognizer){
        
        var sprite:UIImageView = recognizer.view as UIImageView;
        if sprite == nil {
            println("No UIImageView");
            return;
        }
        
        var heroSprite = self.heroModel!.sprite;
        if heroSprite == nil{
            println("No HERO");
            return;
        }
        
        var spriteX = Int(sprite.frame.origin.x)
        var positionDeltaX = Int(sprite.frame.size.width) / 2
        if spriteX > (self.worldWidth / 2){
            positionDeltaX *= -1
        }
        
        var spriteY = Int(sprite.frame.origin.y);
//        var positionDeltaY = Int(sprite.frame.size.height) / 2
//        if spriteY > (self.worldHeight / 2){
//            positionDeltaY *= -1
//        }
        
        var heroPositionX = spriteX + positionDeltaX;
//        var heroPositionY = spriteY + positionDeltaY;
        var heroPositionY = spriteY;
        
        var heroFrame = heroSprite!.frame;
        heroFrame.origin.x = CGFloat(heroPositionX);
        heroFrame.origin.y = CGFloat(heroPositionY);
        
        clearScript();
        UIView.animateWithDuration(CGFloat(self.fadeAnimationInterval), animations: {
            heroSprite!.frame = heroFrame;
        }, completion: { complete in
            
            var npcId = sprite.tag;
            var npcModel:NPCModel = self.npcModels[npcId]!;
            self.changeScript(npcModel.script!, name: npcModel.name!);
            
        });

    }
    
    func clearAllChar(){
        //Remove
        for (id, model) in self.npcModels {
            var sprite:UIImageView = model.sprite!;
            sprite.removeFromSuperview();
        }
        self.npcModels = [:];
        
        if self.heroModel == nil{
            return;
        }
        self.heroModel!.sprite!.removeFromSuperview();
        self.heroModel = nil;
    }

    @IBAction func randomAction(sender : AnyObject) {
        
        if self.heroModel == nil{
            addHERO();
            
        }
        
        //Remove
        for (id, model) in self.npcModels {
            var sprite:UIImageView = model.sprite!;
            sprite.removeFromSuperview();
        }
        self.npcModels = [:];
        for i in 0..5 {
            var randomX = Int(arc4random_uniform(80)) + 0;
            var randomY = Int(arc4random_uniform(80)) + 0;
            addNPC(i, name:"Dummy\(i)", script: "Script\(i)", locationPercentX: randomX, locationPercentY: randomY)
            
        }
        
        
    }
    func clearScript(){
        self.scriptTextView.alpha = 0;
        self.charNameLabel.alpha = 0;
    }
    
    func changeScript(script:String , name:String){
        
        clearScript();
        self.scriptTextView.text = script;
        println("New Name : "+name);
        self.charNameLabel.text = name;
        println("New Script : "+script);
        
        
        UIView.animateWithDuration(CGFloat(self.fadeAnimationInterval), animations: {
            
                self.charNameLabel.alpha = 1.0;
            
            }, completion: { complete in
                
                UIView.animateWithDuration(CGFloat(self.fadeAnimationInterval), animations: {
                            self.scriptTextView.textColor = UIColor.whiteColor();
                            self.scriptTextView.alpha = 1.0;
                    });
                
            });
        
    }

    @IBAction func goToTownAction(sender : AnyObject) {
        self.goToTownButton.hidden = true;
        self.clearQuestButton.hidden = false;
        
        self.currentGameState = GameState.InTown;
        addHERO();
        
        var npcs = self.shinBunData!.npcs;
        
        var idIter:Int = 0;
        for ar in npcs{
            var npc = ar as AnyObject[]
            
            // name, script, percentX, percentY
            var id = idIter;
            var name = npc[0] as String;
            var script = npc[1] as String;
            var x = npc[2] as Int;
            var y = npc[3] as Int;
            addNPC(idIter, name: name, script:script, locationPercentX: x, locationPercentY: y);
            idIter++;
        }
        
        changeScript(self.shinBunData!.townDefaultScript, name: "")
        
        UIView.animateWithDuration(CGFloat(self.fadeAnimationInterval), animations: {
            
                    self.sceneBackgroundImageView.image = UIImage(named: "town");
        });


        
    }
    
    @IBAction func clearQuestAction(sender : AnyObject) {
        self.goToTownButton.hidden = false;
        self.clearQuestButton.hidden = true;
        
        self.currentGameState = GameState.QuestComplete;
        self.clearAllChar();
        
        
        UIView.animateWithDuration(CGFloat(self.fadeAnimationInterval), animations: {
            
            self.sceneBackgroundImageView.image = UIImage(named: "boss_room");
            });

        
        changeScript(self.shinBunData!.bossClearQuestScript, name: self.shinBunData!.bossName);
        
    }
    func showQuestAlert(){
        
        var myActionSheet =  UIAlertController(title: nil, message: nil, preferredStyle: UIAlertControllerStyle.ActionSheet)
        myActionSheet.addAction(UIAlertAction(title: self.shinBunData!.questAnswer0, style: UIAlertActionStyle.Default, handler: { (ACTION :UIAlertAction!)in
                self.changeScript(self.shinBunData!.questFail, name: self.shinBunData!.bossName);
            }))
        
        myActionSheet.addAction(UIAlertAction(title: self.shinBunData!.questAnswer1, style: UIAlertActionStyle.Default, handler: { (ACTION :UIAlertAction!)in
            self.changeScript(self.shinBunData!.questSuccess, name: self.shinBunData!.bossName);
            }))
        myActionSheet.addAction(UIAlertAction(title: self.shinBunData!.questAnswer2, style: UIAlertActionStyle.Default, handler: { (ACTION :UIAlertAction!)in
            self.changeScript(self.shinBunData!.questFail, name: self.shinBunData!.bossName);
            }))

        self.presentViewController(myActionSheet, animated: true, completion: nil)

    }
}

