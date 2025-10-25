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
import {Light} from './Light.js';

export class HemisphereLight extends Light {
    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;

        this.elementFolder = gui.addFolder('properties');
        this.open();
    }

    open() {
        const object = this.object;
        const elementFolder = this.elementFolder;
        const moveToCamera = () => {this.moveToCamera();}

        const helper = new THREE.HemisphereLightHelper(object.mesh);        
        this.base.scene.add(helper);
        helper.visible = false;

        let params = {
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
            color: object.mesh.color.getHex(),
            ground_color: object.mesh.groundColor.getHex()
        }

        elementFolder.add(params, 'move_to_camera').name("move to camera");
        const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
            object.mesh.position.x = value;
            helper.update();
        });
        const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
            object.mesh.position.y = value;
            helper.update();
        });
        const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
            object.mesh.position.z = value;
            helper.update();
        });
        elementFolder.add(params, 'intensity').onChange(function(value) {
            object.mesh.intensity = value;
        });
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.addColor(params, 'ground_color').onChange(function(value) {
            object.mesh.groundColor.setHex(value);
        });
        const helperFolder = elementFolder.addFolder('helper');
        helperFolder.add(helper, 'visible').onChange(function() {
        });
    }

    destroy() {
        this.elementFolder.destroy();
    }

    save(name, parameter) {
        let code =
            name + ".position.set(" + parameter[0][1]['position_x'] + ", " + parameter[0][1]['position_y'] + ", " + parameter[0][1]['position_y'] + ");\n" +
            name + ".intensity = " + parameter[0][1]['intensity'] + ";\n" +
            name + ".color.setHex(" + parameter[0][1]['color'].replace("#", "0x") + ");\n" +
            name + ".groundColor.setHex(" + parameter[0][1]['ground_color'].replace("#", "0x") + ");\n";

        return code;
    }
}