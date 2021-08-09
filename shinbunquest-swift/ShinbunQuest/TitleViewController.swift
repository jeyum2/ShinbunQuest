//
//  TitleViewController.swift
//  ShinbunQuest
//
//  Created by je on 6/7/14.
//  Copyright (c) 2014 mulodo. All rights reserved.
//

import Foundation

import UIKit


class TitleViewController: UIViewController {
    

    @IBOutlet var startButton : UIButton
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
                
        self.startButton.alpha = 1.0;
        UIView.animateWithDuration(0.5,
            delay:0.0,
            options:
            UIViewAnimationOptions.CurveEaseInOut | UIViewAnimationOptions.Autoreverse | UIViewAnimationOptions.Repeat | UIViewAnimationOptions.AllowUserInteraction
            , animations:{
                self.startButton.alpha = 0.1;
            }, completion: { complete in
            });
    }

    @IBAction func startButtonAction(sender : AnyObject) {
        println("Start Button Action");
        UIView.animateWithDuration(0.5,
            delay:0.0,
            options:
            UIViewAnimationOptions.CurveEaseInOut | UIViewAnimationOptions.BeginFromCurrentState
            , animations:{
                self.startButton.alpha = 1.0;
            }, completion: { complete in });
        self.performSegueWithIdentifier("startGame", sender: self);
    }
}
