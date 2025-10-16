/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class MeshPhysicalMaterial extends Object {
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
            transparent: object.mesh.transparent,
            opacity: object.mesh.opacity,
            roughness: object.mesh.roughness,
            metalness: object.mesh.metalness,
            ior: object.mesh.ior,
            reflectivity: object.mesh.reflectivity,
            iridescence: object.mesh.iridescence,
            iridescence_ior: object.mesh.iridescenceIOR,
            sheen: object.mesh.sheen,
            sheen_roughness: object.mesh.sheenRoughness,
            sheen_color: object.mesh.sheenColor.getHex(),
            clearcoat: object.mesh.clearcoat,
            clearcoat_roughness: object.mesh.clearcoatRoughness,
            specular_intensity: object.mesh.specularIntensity,
            specular_color: object.mesh.specularColor.getHex(),
            thickness: object.mesh.thickness,
            transmission: object.mesh.transmission
        }
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.addColor(params, 'emissive').onChange(function(value) {
            object.mesh.emissive.setHex(value);
        });
        elementFolder.add(params, 'transparent').onChange(function(value) {
            object.mesh.transparent = value;
        });
        elementFolder.add(params, 'opacity', 0, 1, 0.001).onChange(function(value) {
            object.mesh.opacity = value;
        });
        elementFolder.add(params, 'roughness', 0, 1, 0.001).onChange(function(value) {
            object.mesh.roughness = value;
        });
        elementFolder.add(params, 'metalness', 0, 1, 0.001).onChange(function(value) {
            object.mesh.metalness = value;
        });
        elementFolder.add(params, 'ior', 0, 2.33, 0.001).onChange(function(value) {
            object.mesh.ior = value;
        });
        elementFolder.add(params, 'reflectivity', 0, 1, 0.001).onChange(function(value) {
            object.mesh.reflectivity = value;
        });
        elementFolder.add(params, 'iridescence', 0, 1, 0.001).onChange(function(value) {
            object.mesh.iridescence = value;
        });
        elementFolder.add(params, 'iridescence_ior', 0, 1, 0.001).onChange(function(value) {
            object.mesh.iridescenceIOR = value;
        });
        elementFolder.add(params, 'sheen', 0, 1, 0.001).onChange(function(value) {
            object.mesh.sheen = value;
        });
        elementFolder.add(params, 'sheen_roughness', 0, 1, 0.001).onChange(function(value) {
            object.mesh.sheenRoughness = value;
        });
        elementFolder.addColor(params, 'sheen_color').onChange(function(value) {
            object.mesh.sheenColor.setHex();
        });
        elementFolder.add(params, 'clearcoat', 0, 1, 0.001).onChange(function(value) {
            object.mesh.clearcoat = value;
        });
        elementFolder.add(params, 'clearcoat_roughness', 0, 1, 0.001).onChange(function(value) {
            object.mesh.clearcoatRoughness = value;
        });
        elementFolder.add(params, 'specular_intensity', 0, 1, 0.001).onChange(function(value) {
            object.mesh.specularIntensity = value;
        });
        elementFolder.addColor(params, 'specular_color').onChange(function(value) {
            object.mesh.specularColor.setHex();
        });
        elementFolder.add(params, 'thickness', 0, 1, 0.001).onChange(function(value) {
            object.mesh.thickness = value;
        });
        elementFolder.add(params, 'transmission', 0, 1, 0.001).onChange(function(value) {
            object.mesh.transmission = value;
        });
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code = 
            name + ".color.setHex('" + parameter[0][1]['color'] + "');\n" +
            name + ".emissive.setHex('" + parameter[0][1]['emissive'] + "');\n" +
            name + ".transparent = " + parameter[0][1]['transparent'] + ";\n" +
            name + ".opacity = " + parameter[0][1]['opacity'] + ";\n" +
            name + ".roughtness = " + parameter[0][1]['roughtness'] + ";\n" +
            name + ".metalness = " + parameter[0][1]['metalness'] + ";\n" +
            name + ".ior = " + parameter[0][1]['ior'] + ";\n" +
            name + ".reflectivity = " + parameter[0][1]['reflectivity'] + ";\n" +
            name + ".iridescence = " + parameter[0][1]['iridescence'] + ";\n" +
            name + ".iridescenceIOR = " + parameter[0][1]['iridescence_ior'] + ";\n" +
            name + ".sheen = " + parameter[0][1]['sheen'] + ";\n" +
            name + ".sheenRoughtness = " + parameter[0][1]['sheen_roughtness'] + ";\n" +
            name + ".sheenColor.setHex('" + parameter[0][1]['sheen_color'] + "');\n" +
            name + ".clearcoat = " + parameter[0][1]['clearcoat'] + ";\n" +
            name + ".clearcoatRoughtness = " + parameter[0][1]['clearcoat_roughtness'] + ";\n" +
            name + ".specularIntensity = " + parameter[0][1]['specular_intensity'] + ";\n" +
            name + ".specularColor.setHex('" + parameter[0][1]['specular_color'] + ";\n" +
            name + ".thickness = " + parameter[0][1]['thickness'] + ";\n" +
            name + ".transission = " + parameter[0][1]['transmission'] + ";\n";

        return code;
    }
}