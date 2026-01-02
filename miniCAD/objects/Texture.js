/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/


export class Texture {
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
            info: function(){},
            needs_update: object.mesh.needsUpdate,
            repeat_x: object.mesh.repeat.x,
            repeat_y: object.mesh.repeat.y,
            center_x: object.mesh.center.x,
            center_y: object.mesh.center.y,
            

            
        };

        elementFolder.add(params, 'info').name("needs_update should be enable here and on the material as well");
        elementFolder.add(params, 'move_to_camera').name("move to camera");
        const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
            object.mesh.position.x = value;
        });
        const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
            object.mesh.position.y = value;
        });
        const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
            object.mesh.position.z = value;
        }); 
        elementFolder.add(params, 'scale_x').onChange(function(value) {
            object.mesh.scale.x = value;
        });
        elementFolder.add(params, 'scale_y').onChange(function(value) {
            object.mesh.scale.y = value;
        });
        elementFolder.add(params, 'scale_z').onChange(function(value) {
            object.mesh.scale.z = value;
        });
        elementFolder.add(params, 'rotation_x', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.x = value;
        });
        elementFolder.add(params, 'rotation_y', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.y = value;
        });
        elementFolder.add(params, 'rotation_z', 0, 2*Math.PI).onChange(function(value) {
            object.mesh.rotation.z = value;
        });

        return elementFolder;
    }

    destroy() {
        this.folder.destroy();
    }

    save(name, parameter) {
        let code =
            name + ".position.set(" + parameter[0][1]['position_x'] + ", " + parameter[0][1]['position_y'] + ", " + parameter[0][1]['position_z'] + ");\n" +
            name + ".scale.set(" + parameter[0][1]['scale_x'] + ", " + parameter[0][1]['scale_y'] + ", " + parameter[0][1]['scale_z'] + ");\n" +
            name + ".rotation.set(" + parameter[0][1]['rotation_x'] + ", " + parameter[0][1]['rotation_y'] + ", " + parameter[0][1]['rotation_z'] + ");\n";
        
        return code;
    }
}
