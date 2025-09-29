/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

import * as THREE from 'three';
import settings from '../settings.json' with {type: 'json'};
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const x = {
    x: 0,
    x0: null,
    play: false
};

export class AutoHeadingGui {
    constructor(path, camera) {
        this.camera = camera;
        this.path = path;

        this.newPoints = [];
        const newPoints = this.newPoints;

        //gui
        const autoHeadingGui = new GUI({title: "Auto Heading", width: 250});
        autoHeadingGui.domElement.style.left = (window.innerWidth - 250) / 2 + "px";
        autoHeadingGui.domElement.style.top = "300px";

        const params = {
            close: function() {
                autoHeadingGui.destroy();
            },
            warning: function() {},
            start: function() {
                x.play = true;
                autoHeadingGui.hide();
            },
            stop: function() {
                stop();
            }
        };

        autoHeadingGui.add(params, 'close');
        const warningCtrl = autoHeadingGui.add(params, 'warning').name("Warning: <br>Can only be used with Lock Controls Camera").disable();
        autoHeadingGui.add(params, 'start');
        autoHeadingGui.add(params, 'stop').name("stop: use shortcut (" + settings.animation.STOPANIMATION_KEY + ")").disable();
    
        warningCtrl.domElement.childNodes[0].children[0].style.height = "40px";
        warningCtrl.domElement.childNodes[0].children[0].style.color = "yellow";
    
        document.addEventListener("keydown", function stopKey(event) {
            if(autoHeadingGui._closed) {
                document.removeEventListener('keydown', stopKey);
            }
            else if(event.key == settings.animation.STOPANIMATION_KEY) {
                stop();
            }
        });


        function stop() {

            x.play = false;
            x.x0 = null;

            autoHeadingGui.show();
            
            path.headingPoints = newPoints;
            path.selectHeadingPath();
            path.update();
        }
    
    }

    animate() {
        if(x.play == false) {return 0;}
        if(x.x0 == null) {x.x0 = x.x;}

        const camera = this.camera;
        const path = this.path;
        const newPoints = this.newPoints;

        x.x += 1;

        const t = ((x.x - x.x0) / 2000) % 1;
        const position = path.cameraPath.getPointAt(t);
        camera.position.copy(position);

        if(x.x % 100 == 0) {
            const target = new THREE.Vector3;
            camera.getWorldDirection(target);
            newPoints.push(new THREE.Vector3(camera.position.x + target.x, camera.position.y + target.y, camera.position.z + target.z));
        }
    }
}