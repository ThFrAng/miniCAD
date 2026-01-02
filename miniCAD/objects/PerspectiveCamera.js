/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/


export class PerspectiveCamera {
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
                this.aspect = window.innerWidth / window.innerHeight;
                object.mesh.aspect = this.aspect;
                
                aspectCtrl.updateDisplay();
                object.mesh.updateProjectionMatrix();
            },
            fov: object.mesh.fov,
            aspect: object.mesh.aspect,
            near: object.mesh.near,
            far: object.mesh.far,
        };

        elementFolder.add(params, 'screen_size');
        elementFolder.add(params, 'fov').onChange(function(value) {
            object.mesh.fov = value;
            object.mesh.updateProjectionMatrix();
        }).min(0);
        const aspectCtrl = elementFolder.add(params, 'aspect', -2, 2, 0.01).onChange(function(value) {
            object.mesh.aspect = value;
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

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code =
            name + " = new THREE.PerspectiveCamera(" + parameter[0][1]['fov'] + ", " + parameter[0][1]['aspect'] + ", "
            + parameter[0][1]['near'] + ", " + parameter[0][1]['far'] + ");\n";

        return code;
    }
}