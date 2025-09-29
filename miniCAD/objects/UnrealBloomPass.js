/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class UnrealBloomPass extends Object {
    isMesh = false;
    hasShadow = false;
    isMoveable = false;

    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;

        this.elementFolder = gui.addFolder('properties');
        this.open();

        return this.elementFolder;
    }

    open() {
        const object = this.object;
        const elementFolder = this.elementFolder;

        const params = {
            threshold: object.mesh.threshold,
            strength: object.mesh.strength,
            radius: object.mesh.radius
        };

        elementFolder.add(params, 'threshold').onChange(function(value) {
            object.mesh.threshold = value;
        });
        elementFolder.add(params, 'strength').onChange(function(value) {
            object.mesh.strength = value;
        });
        elementFolder.add(params, 'radius').onChange(function(value) {
            object.mesh.radius = value;
        });
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }
}