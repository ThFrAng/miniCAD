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


export class Group {
    isMesh = false;
    hasShadow = false;
    isMoveable = false;

    constructor(base, gui, object) {
        this.base = base;
        this.gui = gui;
        this.object = object;

        return this.open();
    }

    open() {        
        const elementFolder = this.gui.addFolder('properties');
        const params = {
            off: function() {}
        };

        elementFolder.add(params, 'off').name("Object is a group, not adjustable").disable();

        return elementFolder;
    }
}
