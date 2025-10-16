/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

import {Light} from './Light.js';

export class AmbientLight extends Light {
    isMoveable = false;

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

        const params = {
            intensity: object.mesh.intensity,
            color: object.mesh.color.getHex()
        }
        elementFolder.add(params, 'intensity').onChange(function(value) {
            object.mesh.intensity = value;
        });
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
    
        return elementFolder;
    }

    destroy() {
        this.elementFolder.destroy();
    }

    save(name, parameter) {
        let code =
            name + ".intensity = " + parameter[0][1]['intensity'] + ";\n" +
            name + ".color.setHex('" + parameter[0][1]['color'] + "');\n";

        return code;
    }
}