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


export class Light extends Object {
    isMesh = true;
    hasShadow = false;
    isMoveable = true;

    constructor(base, gui, object) {
        super();
        super.base = base;
        super.gui = gui;
        super.object = object;
    }

    moveToCamera() {
        super.moveToCamera();
    }

    shadowFolder(elementFolder) {
        const object = this.object;
        const emptyFolder = (elementFolder) => {this.emptyFolder(elementFolder);}

        let params = {
            shadow: object.mesh.castShadow,
            near: object.mesh.shadow.camera.near,
            far: object.mesh.shadow.camera.far,
            left: object.mesh.shadow.camera.left,
            right: object.mesh.shadow.camera.right,
            top: object.mesh.shadow.camera.top,
            bottom: object.mesh.shadow.camera.bottom,
            blur_samples: object.mesh.shadow.blurSamples,
            bias: object.mesh.shadow.bias
        };

        elementFolder.add(params, 'shadow').onChange(function(value) {
            object.mesh.castShadow = value;
        });
        elementFolder.add(params, 'near').onChange(function(value) {
            object.mesh.shadow.camera.near = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'far').onChange(function(value) {
            object.mesh.shadow.camera.far = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'left').onChange(function(value) {
            object.mesh.shadow.camera.left = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'right').onChange(function(value) {
            object.mesh.shadow.camera.right = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'top').onChange(function(value) {
            object.mesh.shadow.camera.top = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'bottom').onChange(function(value) {
            object.mesh.shadow.camera.bottom = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'blur_samples').onChange(function(value) {
            object.mesh.shadow.blurSamples = value;
            object.mesh.shadow.camera.updateProjectionMatrix();
        });
        elementFolder.add(params, 'bias').onChange(function(value) {
            object.mesh.shadow.bias = value;
        })
    }

    emptyFolder(folder) {
        const controllers = folder.controllersRecursive();
        for(let i = 0; i < controllers.length; i++) {
            if(controllers[i].property != 'lightShadow') {
                controllers[i].destroy();
            }
        }
        const folders = folder.foldersRecursive();
        for(let i = 0; i < folders.length; i++) {
            folders[i].destroy();
        }
    }
}