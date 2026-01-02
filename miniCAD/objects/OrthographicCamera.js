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

export class OrthographicCamera {
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
        const object = this.object;
        const elementFolder = this.gui.addFolder('properties');
        const params = {
            screen_size: function() {
                const screenSize = new THREE.Vector4(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2);
                screenSize.normalize();
                
                this.left = screenSize.x;
                object.mesh.left = screenSize.x;
                this.right = screenSize.y;
                object.mesh.right = screenSize.y;
                this.top = screenSize.z;
                object.mesh.top = screenSize.z;
                this.bottom = screenSize.w;
                object.mesh.bottom = screenSize.w;

                leftCtrl.updateDisplay();
                rightCtrl.updateDisplay();
                topCtrl.updateDisplay();
                bottomCtrl.updateDisplay();

                object.mesh.updateProjectionMatrix();
            },
            left: object.mesh.left,
            right: object.mesh.right,
            top: object.mesh.top,
            bottom: object.mesh.bottom,
            near: object.mesh.near,
            far: object.mesh.far,
            zoom: object.mesh.zoom
        };

        elementFolder.add(params, 'screen_size');
        const leftCtrl = elementFolder.add(params, 'left').onChange(function(value) {
            object.mesh.left = value;
            object.mesh.updateProjectionMatrix();
        });
        const rightCtrl = elementFolder.add(params, 'right').onChange(function(value) {
            object.mesh.right = value;
            object.mesh.updateProjectionMatrix();
        });
        const topCtrl = elementFolder.add(params, 'top').onChange(function(value) {
            object.mesh.top = value;
            object.mesh.updateProjectionMatrix();
        });
        const bottomCtrl = elementFolder.add(params, 'bottom').onChange(function(value) {
            object.mesh.bottom = value;
            object.mesh.updateProjectionMatrix();
        });
        const nearCtrl = elementFolder.add(params, 'near').onChange(function(value) {
            object.mesh.near = value;
            object.mesh.updateProjectionMatrix();

            farCtrl.min(params.near);
        }).min(0).max(params.far);

        const farCtrl = elementFolder.add(params, 'far').onChange(function(value) {
            object.mesh.far = value;
            object.mesh.updateProjectionMatrix();

            nearCtrl.max(params.far);
            nearCtrl.updateDisplay();
        }).min(params.near);

        elementFolder.add(params, 'zoom').onChange(function(value) {
            object.mesh.zoom = value;
            object.mesh.updateProjectionMatrix();
        });

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code =
            name + " = new THREE.OrthographicCamera(" + parameter[0][1]['left'] + ", " + parameter[0][1]['right'] + ", "
            + parameter[0][1]['top'] + ", " + parameter[0][1]['bottom'] + ", "
            + parameter[0][1]['near'] + ", " + parameter[0][1]['far'] + ");\n" +
            name + ".zoom = " + parameter[0][1]['zoom'] + ";\n" +
            name + ".updateProjectionMatrix();";


        return code;
    }
}