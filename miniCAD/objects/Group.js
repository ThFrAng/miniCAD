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


export class Group {
    isMesh = true;
    hasShadow = false;
    isMoveable = true;

    constructor(base, gui, object) {
        this.base = base;
        this.gui = gui;
        this.object = object;

        this.folder = this.open();
    }

    open() {        
        const elementFolder = this.gui.addFolder('properties');
        const object = this.object;

        const params = {
            position_x: object.mesh.position.x,
            position_y: object.mesh.position.y,
            position_z: object.mesh.position.z,
            scale_x: object.mesh.scale.x,
            scale_y: object.mesh.scale.y,
            scale_z: object.mesh.scale.z,
            rotation_x: object.mesh.rotation.x,
            rotation_y: object.mesh.rotation.y,
            rotation_z: object.mesh.rotation.z
        };

        elementFolder.add(params, 'position_x').onChange(function(value) {
            object.mesh.position.x = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'position_y').onChange(function(value) {
            object.mesh.position.y = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'position_z').onChange(function(value) {
            object.mesh.position.z = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'scale_x').onChange(function(value) {
            object.mesh.scale.x = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'scale_y').onChange(function(value) {
            object.mesh.scale.y = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'scale_z').onChange(function(value) {
            object.mesh.scale.z = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'rotation_x', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.x = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'rotation_y', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.y = value;
            object.mesh.updateMatrix();
        });
        elementFolder.add(params, 'rotation_z', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.z = value;
            object.mesh.updateMatrix();
        });
        
        return elementFolder;
    }
    
    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        const code =
            name + ".position.set(" + parameter[0][1]['position_x'] + ", " + parameter[0][1]['position_y'] + ", " + parameter[0][1]['position_z'] + ");\n" +
            name + ".scale.set(" + parameter[0][1]['scale_x'] + ", " + parameter[0][1]['scale_y'] + ", " + parameter[0][1]['scale_z'] + ");\n" +
            name + ".rotation.set(" + parameter[0][1]['rotation_x'] + ", " + parameter[0][1]['rotation_y'] + ", " + parameter[0][1]['rotation_z'] + ");\n";
        
        
        return code;
    }
}
