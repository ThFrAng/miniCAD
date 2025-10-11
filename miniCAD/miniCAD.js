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
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

import {DataGui} from './DataGui.js';
import {ToolGui} from './toolGui.js';
import {AnimationGui} from './animation/AnimationGui.js';
import {SaveGui} from './saveGui.js';
import {loadOptions, stats} from './options.js';
import settings from './settings.json' with {type: 'json'};

let objects = [];
let names = [];
let guis = []; // 0: main gui; 1: toolGui; 2: info option;
let toolGui, animationGui;

let bufferCameraPosition = new THREE.Vector3(0, 0, 0);

let id = 0;

let base = {guis: guis};

let importPoints = [];


class Collection {

    getObject(name) {
        const object = objects.find((object) => object.name === name);
        return object;
    }

    getNames() {
        return names;
    }

    add(mesh, name) {
        let nameId = 0;
        let newName = name;

        while(names.includes(newName)) {
            nameId += 1;
            newName = name + nameId;
        }
        
        const object = {
            mesh: mesh,
            type: mesh.constructor.name,
            name: newName,
            save: 0
        }

        objects.push(object);
        names.push(newName);
    }

    saveObject(object, gui) {
        const save = gui.save();
        if(save.folders.properties.folders.Controls != null) {
            object.save = save.folders.properties.folders.Controls.controllers;
        }
        else {
            object.save = save.folders.properties.controllers;
        }
    }
}
const collection = new Collection();


export class MiniCAD {
    constructor(scene, camera, renderer, controls) {
        const gui = new GUI({title: 'miniCAD'});
        guis[0] = gui;
        toolGui = new ToolGui(base);
        guis[1] = toolGui.gui;
        animate();
        
        base.camera = camera;
        base.scene = scene;
        base.renderer = renderer;
        base.controls = controls;
        base.collection = collection;

        let shown = true;
        document.addEventListener('keydown', function(event) {
            if(event.key == settings.HIDE_GUI) {
                if(shown == true) {
                    shown = false;
                    guis[0].hide();
                    guis[1].hide();
                    guis[2].style.display = 'none';
                }
                else {
                    shown = true;
                    guis[0].show();
                    guis[1].show();
                    guis[2].style.display = 'flex';
                }
            }
        })

        const initFolder = gui.addFolder('init');
        const initParams = {
            open: function () {
                load(gui, base);
                initFolder.destroy();
                
                if(settings.transformation.USE_TRANSFORMATION_TOOLS == "true") {toolGui.init()}
            }
        }
        initFolder.add(initParams, 'open');
        loadOptions(base, collection);

        gui.open();
    }

    add(mesh, name) {
        id++;
        collection.add(mesh, name);
    }

    renderer(renderer) {
        base.renderer = renderer;
    }

    controls(controls) {
        base.controls = controls;
    }
    
    addPath(type, points, secondaryPoints) {
        if(type == 'Basic Path') {importPoints.push({type, points});}
        else if(type == 'Animation Path') {importPoints.push({type, points});}
        else if(type == 'Camera Travelling Path') {importPoints.push({type, points, secondaryPoints});}
        else {console.error("unknown path type");}
    }
}

function load(gui, base) {
    const headerFolder = gui.addFolder('header');
    var elementFolder;
    var selectedObject = 0;

    const headerParams = {
        animation: function() {
            animationGui = new AnimationGui(base, toolGui, importPoints);
            gui[3] = animationGui;
        },
        save: function() {
            const saveGui = new SaveGui(collection, selectedObject);
            gui[4] = saveGui;
            collection.saveObject(selectedObject, gui);
        },
        camera_x: base.camera.position.x,
        camera_y: base.camera.position.y,
        camera_z: base.camera.position.z,
        get: function() {
            headerParams.camera_x = base.camera.position.x;
            controllerX.updateDisplay();
            headerParams.camera_y = base.camera.position.y;
            controllerY.updateDisplay();
            headerParams.camera_z = base.camera.position.z;
            controllerZ.updateDisplay();
        },
        object: 'Select object',
        locate: function () {
            if(selectedObject != 0) {
                locateObject(selectedObject, locateButton);
            }
        }
    }

    headerFolder.add(headerParams, 'animation');
    headerFolder.add(headerParams, 'save');
    const controllerX = headerFolder.add(headerParams, 'camera_x').onChange(function(value) {
        bufferCameraPosition.copy(base.camera.position);
        bufferCameraPosition.x = value;
        base.camera.position.copy(bufferCameraPosition);
    });
    const controllerY = headerFolder.add(headerParams, 'camera_y').onChange(function(value) {
        bufferCameraPosition.copy(base.camera.position);
        bufferCameraPosition.y = value;
        base.camera.position.copy(bufferCameraPosition);
    });
    const controllerZ = headerFolder.add(headerParams, 'camera_z').onChange(function(value) {
        bufferCameraPosition.copy(base.camera.position);
        bufferCameraPosition.z = value;
        base.camera.position.copy(bufferCameraPosition);
    });
    headerFolder.add(headerParams, 'get').name("get camera position");
    headerFolder.add(headerParams, 'object', collection.getNames()).name('object').onChange(function(value) {
        
        if(selectedObject != 0) {
            collection.saveObject(selectedObject, gui);
        }

        selectedObject = collection.getObject(value);
        var oldFolder = elementFolder;

        elementFolder = new DataGui(base, gui, selectedObject);
        selectedObject.gui = elementFolder;

        toolGui.attachObject(selectedObject, true);

        oldFolder.destroy();
    });
    const locateButton = headerFolder.add(headerParams, 'locate').name('locate');
}


function locateObject(object, locateButton) {
    object.mesh.traverse((o) => {
        if(o.isMesh) {
            locateButton.disable();
            const material = o.material;
            o.material = new THREE.MeshBasicMaterial({color: 0xff0000});

            setTimeout(function() {
                o.material = material;
                locateButton.enable();
            }, 1000);
        }
    });
}


function animate() {
    requestAnimationFrame(animate);
    if(stats != null) {stats.update();}
    if(animationGui != null) {animationGui.animate();}
}