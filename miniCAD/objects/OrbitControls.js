/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/


export class OrbitControls {
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
        const object = this.object.mesh;

        const elementFolder = this.gui.addFolder('properties');
        const params = {
            max_azimuth_angle: object.maxAzimuthAngle,
            min_azimuth_angle: object.minAzimuthAngle,
            max_polar_angle: object.maxPolarAngle,
            min_polar_angle: object.minPolarAngle

        };
        
        elementFolder.add(params, 'max_azimuth_angle', 0, 2 * Math.PI, 0.01).onChange(function(value) {
            object.maxAzimuthAngle = value;
        });
        elementFolder.add(params, 'min_azimuth_angle', 0, 2 * Math.PI, 0.01).onChange(function(value) {
            object.minAzimuthAngle = value;
        });
        elementFolder.add(params, 'max_polar_angle', 0, 2 * Math.PI, 0.01).onChange(function(value) {
            object.maxPolarAngle = value;
        });
        elementFolder.add(params, 'max_polar_angle', 0, 2 * Math.PI, 0.01).onChange(function(value) {
            object.minPolarAngle = value;
        });
        

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code = 
            name + ".maxAzimuthAngle = " + parameter[0][1]['max_azimuth_angle'] + ";\n" +
            name + ".minAzimuthAngle = " + parameter[0][1]['min_azimuth_angle'] + ";\n" +
            name + ".maxPolarAngle = " + parameter[0][1]['max_polar_angle'] + ";\n" +
            name + ".minPolarAngle = " + parameter[0][1]['min_polar_angle'] + ";\n";

        return code;
    }
}