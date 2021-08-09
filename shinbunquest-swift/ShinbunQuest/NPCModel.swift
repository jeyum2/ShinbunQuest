//
//  NPCModel.swift
//  ShinbunQuest
//
//  Created by je on 6/7/14.
//  Copyright (c) 2014 mulodo. All rights reserved.
//

import Foundation
import UIKit

class NPCModel:CharModel{
    
    var script:String?
    
    init(name:String, sprite:UIImageView, script:String){
        super.init(name: name, sprite: sprite);
        self.script = script;
    }
    
}