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

export class SpotLight extends Light {
    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;
        this.hasShadow = true;

        this.elementFolder = gui.addFolder('properties');
        this.init(base, object);
        this.open();
    }

    init(base, object) {
        const elementFolder = this.elementFolder;
        const shadowFolder = (elementFolder) => {this.shadowFolder(elementFolder);}
        const emptyFolder = (folder) => {this.emptyFolder(folder);}
        const open = () => {this.open();}

        const lightShadowParams = {
            lightShadow: 'light'
        };

        elementFolder.add(lightShadowParams, 'lightShadow', ['light', 'shadow']).name('light / shadow')
        .onChange(function(value) {
            if(value == 'shadow') {
                base.collection.saveObject(object, 'light');
            }
            else if(value == 'light') {
                base.collection.saveObject(object, 'shadow');
            }
        })
        .onFinishChange(function(value) {
            if(value == 'shadow') {
                emptyFolder(elementFolder);
                shadowFolder(elementFolder);
            }
            else if(value == 'light') {
                emptyFolder(elementFolder);
                open();
            }
        });
    }

    open() {
        const object = this.object;
        const elementFolder = this.elementFolder;
        const moveToCamera = () => {this.moveToCamera();}
        
        const helper = new THREE.SpotLightHelper(object.mesh);        
        this.base.scene.add(helper);
        helper.visible = false;

        const params = {
            move_to_camera: function() {
                moveToCamera(object);
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
            decay: object.mesh.decay,
            distance: object.mesh.distance,
            penumbra: object.mesh.penumbra,
            angle: object.mesh.angle,
            color: object.mesh.color.getHex(),
            target_x: object.mesh.target.position.x,
            target_y: object.mesh.target.position.y,
            target_z: object.mesh.target.position.z
        };
        
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
        elementFolder.add(params, 'decay').onChange(function(value) {
            object.mesh.decay = value;
            helper.update();
        });
        elementFolder.add(params, 'distance').onChange(function(value) {
            object.mesh.distance = value;
            helper.update();
        });
        elementFolder.add(params, 'penumbra', 0, 1).onChange(function(value) {
            object.mesh.penumbra = value;
            helper.update();
        });
        elementFolder.add(params, 'angle', 0, Math.PI/2).onChange(function(value) {
            object.mesh.angle = value;
            helper.update();
        });
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.add(params, 'target_x').onChange(function(value) {
            object.mesh.target.position.x = value;
            object.mesh.target.updateMatrixWorld();
            helper.update();
        });
        elementFolder.add(params, 'target_y').onChange(function(value) {
            object.mesh.target.position.y = value;
            object.mesh.target.updateMatrixWorld();
            helper.update();
        });
        elementFolder.add(params, 'target_z').onChange(function(value) {
            object.mesh.target.position.z = value;
            object.mesh.target.updateMatrixWorld();
            helper.update();
        });
        const helperFolder = elementFolder.addFolder('helper');
        helperFolder.add(helper, 'visible');
    }
    
    destroy() {
        this.elementFolder.destroy();
    }

    save(name, parameter) {
        const saveShadow = (name, parameter) => {return super.saveShadow(name, parameter);}

        let code =
            name + ".position.set(" + parameter[0][1]['position_x'] + ", " + parameter[0][1]['position_y'] + ", " + parameter[0][1]['position_z'] + ");\n" +
            name + ".intensity = " + parameter[0][1]['intensity'] + ";\n" +
            name + ".decay = " + parameter[0][1]['decay'] + ";\n" +
            name + ".distance = " + parameter[0][1]['distance'] + ";\n" +
            name + ".penumbra = " + parameter[0][1]['penumbra'] + ";\n" +
            name + ".angle = " + parameter[0][1]['angle'] + ";\n" +
            name + ".color.setHex(" + parameter[0][1]['color'].replace("#", "0x") + ");\n" +
            name + ".target.position.set(" + parameter[0][1]['target_x'] + ", " + parameter[0][1]['target_y'] + ", " + parameter[0][1]['target_z'] + ");\n" +
            name + ".target.updateMatrixWorld();\n";

        if(parameter[1] != null) {code += saveShadow(name, parameter);}
        
        return code;
    }
}