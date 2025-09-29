/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import {BasicPath} from './BasicPath.js';
import {AnimationPath} from './AnimationPath.js';
import {CameraTravellingPath} from './CameraTravellingPath.js';


export class AddPathGui {
    constructor(scene, paths, updatePathPicker) {
        const newPath = {};
        
        //gui
        const newPathGui = new GUI({title: "New Path", width: 250});
        newPathGui.domElement.style.left = (window.innerWidth - 250) / 2 + "px";
        newPathGui.domElement.style.top = "300px";

        const basicPathDescription = "Basic Path: Three.js path composed of points";
        const animationPathDescription = "Animation Path: Path that can be linked to an object that will follow the path";
        const cameraTravellingPathDescription = "Camera Travelling Path: Path follow by the camera to make travelling and second path can be recorded to follow the camera heading for more precise travellings";

        const params = {
            close: function() {
                newPathGui.destroy();
            },
            type: "Select Path Type",
            description: function() {},
            confirm: async function() {
                newPathGui.destroy();
                switch(newPath.name) {
                    case "Basic Path":
                        newPath.path = new BasicPath(scene);
                        break;
                    case "Animation Path":
                        newPath.path = new AnimationPath(scene);
                        break;
                    case "Camera Travelling Path":
                        newPath.path = new CameraTravellingPath(scene);
                        break;
                }
                pushPath();
            }
        }
        newPathGui.add(params, 'close');
        newPathGui.add(params, 'type', ["Basic Path", "Animation Path", "Camera Travelling Path"]).onChange(function(value) {
            switch(value) {
                case "Basic Path":
                    newPath.name = value;
                    descriptionCtrl.name(basicPathDescription);
                    break;
                case "Animation Path":
                    newPath.name = value;
                    descriptionCtrl.name(animationPathDescription);
                    break;
                case "Camera Travelling Path":
                    newPath.name = value;
                    descriptionCtrl.name(cameraTravellingPathDescription);
                    break;
            }
            confirmCtrl.enable();

        });
        const descriptionCtrl = newPathGui.add(params, 'description').disable();
        const confirmCtrl = newPathGui.add(params, 'confirm').onChange(function() {}).disable();

        descriptionCtrl.domElement.childNodes[0].children[0].style.height = "75px";




        //add path to pick path controller
        function pushPath() {
            
            paths.path.push(newPath.path);

            let idName = 0;
            let name = newPath.name;
            let newName = name;

            while(paths.name.includes(newName)) {
                idName ++;
                newName = name + idName;
            }

            paths.name.push(newName);
            
            //update pick path controller from animation gui
            updatePathPicker();
        }
    }
}