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

export class PointerLockControls {
    isMesh = false;
    hasShadow = false;
    isMoveable = false;

    constructor(base, gui, object) {
        this.base = base;
        this.gui = gui;
        this.object = object;

        this.folder = this.open();
    }

    open() {
        const object = this.object.mesh;

        const elementFolder = this.gui.addFolder('properties');
        const params = {
            get_direction: function() {
                const direction = new THREE.Vector3();
                object.getDirection(direction);

                this.direction_x = direction.x;
                directionX.updateDisplay();

                this.direction_y = direction.y;
                directionY.updateDisplay();

                this.direction_z = direction.z;
                directionZ.updateDisplay();
            },
            direction_x: 0,
            direction_y: 0,
            direction_z: 0,

        };
        
        elementFolder.add(params, 'get_direction');
        const directionX = elementFolder.add(params, 'direction_x').disable();
        const directionY = elementFolder.add(params, 'direction_y').disable();
        const directionZ = elementFolder.add(params, 'direction_z').disable();    

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }
}