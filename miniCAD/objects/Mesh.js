/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

import {Object} from './Object.js';


export class Mesh extends Object {
    isMesh = true;
    hasShadow = false;
    isMoveable = true;

    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;

        this.folder = this.open();
    }

    open() {
        const object = this.object;
        const moveToCamera = () => {
            this.moveToCamera();
        };
        
        const elementFolder = this.gui.addFolder('properties');
        const params = {
            move_to_camera: function() {
                moveToCamera()
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
            scale_x: object.mesh.scale.x,
            scale_y: object.mesh.scale.y,
            scale_z: object.mesh.scale.z,
            rotation_x: object.mesh.rotation.x,
            rotation_y: object.mesh.rotation.y,
            rotation_z: object.mesh.rotation.z,
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
        elementFolder.add(params, 'scale_x').onChange(function(value) {
            object.mesh.scale.x = value;
        });
        elementFolder.add(params, 'scale_y').onChange(function(value) {
            object.mesh.scale.y = value;
        });
        elementFolder.add(params, 'scale_z').onChange(function(value) {
            object.mesh.scale.z = value;
        });
        elementFolder.add(params, 'rotation_x', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.x = value;
        });
        elementFolder.add(params, 'rotation_y', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.y = value;
        });
        elementFolder.add(params, 'rotation_z', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.z = value;
        });

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    names = {
        "position_x": "position.x",
        "position_y": "position.y",
        "position_z": "position.z",
        "scale_x": "scale.x",
        "scale_y": "scale.y",
        "scale_z": "scale.z",
        "rotation_x": "rotation.x",
        "rotation_y": "rotation.y",
        "rotation_z": "rotation.z"
    };
}
