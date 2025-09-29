/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class MeshPhongMaterial extends Object {
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
            emissive: object.mesh.emissive.getHex(),
            specular: object.mesh.specular.getHex(),
            transparent: object.mesh.transparent,
            opacity: object.mesh.opacity,
            shininess: object.mesh.shininess,
            reflectivity: object.mesh.reflectivity,
            refraction_ratio: object.mesh.refractionRatio

        }
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.addColor(params, 'emissive').onChange(function(value) {
            object.mesh.emissive.setHex(value);
        });
        elementFolder.addColor(params, 'specular').onChange(function(value) {
            object.mesh.specular.setHex(value);
        });
        elementFolder.add(params, 'transparent').onChange(function(value) {
            object.mesh.transparent = value;
        });
        elementFolder.add(params, 'opacity', 0, 1, 0.001).onChange(function(value) {
            object.mesh.opacity = value;
        });
        elementFolder.add(params, 'shininess', 0, 100).onChange(function(value) {
            object.mesh.shininess = value;
        });
        elementFolder.add(params, 'reflectivity', 0, 1, 0.01).onChange(function(value) {
            object.mesh.reflectivity = value;
        });
        elementFolder.add(params, 'refraction_ratio', 0, 1, 0.01).onChange(function(value) {
            object.mesh.refractionRation = value;
        });
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }
}