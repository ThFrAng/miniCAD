/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class Object {
    constructor(base, gui, object) {
        this.base = base;
        this.gui = gui;
        this.object = object;
    }

    moveToCamera() {
        this.object.mesh.position.set(this.base.camera.position.x, this.base.camera.position.y, this.base.camera.position.z);
    }
}