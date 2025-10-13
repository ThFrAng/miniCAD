/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class FogExp2 extends Object {
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
            color: object.mesh.color.getHex(),
            density: object.mesh.density
        }
        
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.add(params, 'density').onChange(function(value) {
            object.mesh.density = value;
        });
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }
}