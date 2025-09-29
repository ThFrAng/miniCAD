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
import settings from '../settings.json' with {type: 'json'};

export class BasicPath {
   type = "Basic Path";

    constructor(
        scene, 
        points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2, 0)], 
        color = new THREE.Color({color: 0xffffff})) {

        this.scene = scene;
        if(color != null) 
        this.color = color;
        if(points != null) {this.points = points;}
        else {this.points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];}

        this.selectedPoint = 0;
        
        this.path;
        this.pathObject = new THREE.Line;
        this.scene.add(this.pathObject);
        this.cubePoint = new THREE.Mesh;

        this.update();
    }

    update() {
        this.path = new THREE.CatmullRomCurve3(this.points, false);
        
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(this.path.getPoints(this.points.length * 20));
        const pathMaterial = new THREE.LineBasicMaterial({color: this.color});
        this.pathObject.geometry = pathGeometry;
        this.pathObject.material = pathMaterial;

        this.cubePoint.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        this.cubePoint.material = new THREE.MeshBasicMaterial({color: this.color});
        this.cubePoint.position.copy(this.points[this.selectedPoint]);
        this.scene.add(this.cubePoint);
    }

    setSelectedPoint(id) {
        if(id != null) {
            if(id >= 0 && id < this.points.length) {
                this.selectedPoint = id;
            }
        }
        return this.selectedPoint;
    }

    addPoint() {
        const newPoint = new THREE.Vector3(this.points[this.selectedPoint].x, this.points[this.selectedPoint].y, this.points[this.selectedPoint].z);
        this.selectedPoint++;

        this.points.splice(this.selectedPoint, 0, newPoint);
    }

    removePoint() {
        this.points.splice(this.selectedPoint, 1);
        this.selectedPoint--;
    }
}








const base = {};
const ctrl3 = {};


export class BasicPathGui {
    constructor(folder, path, toolGui) {
        openFolder2(folder[2], path, toolGui);
        openFolder3(folder[3], path);
        folder[4].hide();
        folder[5].hide();

        let opened = true;
        
        shortcuts(path, folder[2], opened);

        base.path = path;
        base.folder = folder;
    }

    animate() {}
}


//2
function openFolder2(folder, path, toolGui) {

    let pointMoving = false;

    folder.show();
    const params = {
        addPoint: function() {
            addPoint(path);
            moveCtrl.name("move " + path.setSelectedPoint());
        },
        removePoint: function() {
            removePoint(path);
            moveCtrl.name("move " + path.setSelectedPoint());
        },
        previousPoint: function() {
            previousPoint(path);
            moveCtrl.name("move " + path.setSelectedPoint());
        },
        nextPoint: function() {
            nextPoint(path);
            moveCtrl.name("move " + path.setSelectedPoint());
        },
        move: function() {
            if(pointMoving == false) {
                const object = { //structure is the same as normal objects
                    mesh: path.cubePoint,
                    type: "Point",
                    gui: {
                        isMesh: true,
                        hasShadow: false,
                        isMoveable: true
                    }
                };
                toolGui.attachObject(object, false);
                moveCtrl.name("confirm");
                pointMoving = true;
            }
            else {
                const point  = new THREE.Vector3(path.cubePoint.position.x, path.cubePoint.position.y, path.cubePoint.position.z);
                path.getPoints()[path.setSelectedPoint()] = point;

                toolGui.attachObject(null);
                
                const points = base.path.path.points;
                ctrl3.params.position_x = points[base.path.setSelectedPoint()].x;
                ctrl3.params.position_y = points[base.path.setSelectedPoint()].y;
                ctrl3.params.position_z = points[base.path.setSelectedPoint()].z;

                ctrl3.ctrlPositionX.updateDisplay();
                ctrl3.ctrlPositionY.updateDisplay();
                ctrl3.ctrlPositionZ.updateDisplay();

                base.path.update();

                moveCtrl.name("move " + path.setSelectedPoint());
                pointMoving = false;
            }
        }
    };

    folder.add(params, 'addPoint').name("+");
    folder.add(params, 'removePoint').name("-");
    folder.add(params, 'previousPoint').name("<<");
    folder.add(params, 'nextPoint').name(">>");
    const moveCtrl = folder.add(params, 'move').name("move " + path.setSelectedPoint());

    folder.domElement.children[1].style.display = "flex";
    folder.domElement.children[1].style.flexWrap = "wrap";
    folder.controllers[0].domElement.style.flex = "1 0 50%";
    folder.controllers[1].domElement.style.flex = "1 0 50%";
    folder.controllers[2].domElement.style.flex = "1 0 50%";
    folder.controllers[3].domElement.style.flex = "1 0 50%";
    folder.controllers[4].domElement.style.flex = "1 0 100%";
}

//3
function openFolder3(folder, path) {

    folder.show();
    const params = {
        position_x: path.points[path.setSelectedPoint()].x,
        position_y: path.points[path.setSelectedPoint()].y,
        position_z: path.points[path.setSelectedPoint()].z
    };

    folder.add(params, 'position_x').onChange(function(value) {
        path.points[path.setSelectedPoint()].x = value;
        path.update();
    });
    folder.add(params, 'position_y').onChange(function(value) {
        path.points[path.setSelectedPoint()].y = value;
        path.update();
    });
    folder.add(params, 'position_z').onChange(function(value) {
        path.points[path.setSelectedPoint()].z = value;
        path.update();
    });
}



//2
function addPoint(path) {
    path.addPoint();
    path.update();
    updatePosition();
}

function removePoint(path) {
    path.removePoint();
    path.update();
    updatePosition();
}

function previousPoint(path) {
    path.setSelectedPoint(path.setSelectedPoint() - 1);
    path.update();
    updatePosition();
}

function nextPoint(path) {
    path.setSelectedPoint(path.setSelectedPoint() + 1);
    path.update();
    updatePosition();
}


//3
function updatePosition() {

    base.folder[3].controllers[0].object.position_x = base.path.points[base.path.setSelectedPoint()].x;
    base.folder[3].controllers[0].object.position_y = base.path.points[base.path.setSelectedPoint()].y;
    base.folder[3].controllers[0].object.position_z = base.path.points[base.path.setSelectedPoint()].z;

    for(let i = 0; i < base.folder[3].controllers.length; i++) {
        base.folder[3].controllers[i].updateDisplay();
    }
}

//shortcuts
function shortcuts(path, folder2, opened) {
        document.addEventListener('keydown', function shortcut(event) {
        if(!opened) {
            document.removeEventListener('keydown', shortcut);
        }
        else if(event.key == settings.animation.PREVIOUS_KEY) {
            previousPoint(path);
            updateFolder2()
        }
        else if(event.key == settings.animation.NEXT_KEY) {
            nextPoint(path);
            updateFolder2();
        }
    });

    function updateFolder2() {
        for(let i = 0; i < folder2.controllers.length; i++) {
            if(folder2.controllers[i].property == "move") {
                folder2.controllers[i].name("move " + path.setSelectedPoint());
            }
        }
    }
}