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
import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import {Light} from './Light.js';

export class RectAreaLight extends Light {
    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;
        super.hasShadow = true;

        this.elementFolder = gui.addFolder('properties');
        this.folder = this.open();
    }

    open() {
        const object = this.object;
        const elementFolder = this.elementFolder;
        const moveToCamera = () => {this.moveToCamera();}
        
        const helper = new RectAreaLightHelper(object.mesh);        
        this.base.scene.add(helper);
        helper.visible = false;

        let target = new THREE.Vector3(0, 0, 0);
        object.mesh.lookAt(target);
        const params = {
            move_to_camera: function() {
                moveToCamera(object.mesh);
                params.position_x = object.mesh.position.x;
                positionX.updateDisplay();
                params.position_y = object.mesh.position.y;
                positionY.updateDisplay();
                params.position_z = object.mesh.position.z;
                positionZ.updateDisplay();
            },
            position_x: object.mesh.position.x,
            position_y: object.mesh.position.y,
            position_z: object.mesh.position.z,
            intensity: object.mesh.intensity,
            width: object.mesh.width,
            height: object.mesh.height,
            color: object.mesh.color.getHex(),
            target_x: target.x,
            target_y: target.y,
            target_z: target.z
        };

        elementFolder.add(params, 'move_to_camera').name("move to camera");
        const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
            object.mesh.position.x = value;
        });
        const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
            object.mesh.position.y = value;
        });
        const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
            object.mesh.position.z = value;
        }); 
        elementFolder.add(params, 'intensity').onChange(function(value) {
            object.mesh.intensity = value;
        });
        elementFolder.add(params, 'width').onChange(function(value) {
            object.mesh.width = value;
        });
        elementFolder.add(params, 'height').onChange(function(value) {
            object.mesh.height = value;
        });
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.add(params, 'target_x').onChange(function(value) {
            target.x = value;
            object.mesh.lookAt(target);
        });
        elementFolder.add(params, 'target_y').onChange(function(value) {
            target.y = value;
            object.mesh.lookAt(target);
        });
        elementFolder.add(params, 'target_z').onChange(function(value) {
            target.z = value;
            object.mesh.lookAt(target);
        });
        const helperFolder = elementFolder.addFolder('helper');
        helperFolder.add(helper, 'visible');
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code =
            name + ".position.set(" + parameter[0][1]['position_x'] + ", " + parameter[0][1]['position_y'] + ", " + parameter[0][1]['position_z'] + ");\n" +
            name + ".intensity = " + parameter[0][1]['intensity'] + ";\n" +
            name + ".width = " + parameter[0][1]['width'] + ";\n" +
            name + ".height = " + parameter[0][1]['height'] + ";\n" +
            name + ".color.setHex(" + parameter[0][1]['color'].replace("#", "0x") + ");\n" +
            name + ".lookAt(" + parameter[0][1]['target_x'] + ", " + parameter[0][1]['target_y'] + ", " + parameter[0][1]['target_z'] + ");\n";

        return code;
    }
}