/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

export class Fog extends Object {
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
            near: object.mesh.near,
            far: object.mesh.far
        };
        
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.mesh.color.setHex(value);
        });
        elementFolder.add(params, 'near').onChange(function(value) {
            object.mesh.near = value;
        });
        elementFolder.add(params, 'far').onChange(function(value) {
            object.mesh.far = value;
        });
    
        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code =
            name + ".color.setHex(" + parameter[0][1]['color'].replace("#", "0x") + ");\n" +
            name + ".near = " + parameter[0][1]['near'] + ";\n" +
            name + ".far = " + parameter[0][1]['far'] + ";\n";
            
        return code;

    }
}