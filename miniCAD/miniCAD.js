/*
        ThFrAng
        2026

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
import {InfoGui} from './InfoGui.js';
import {loadOptions, stats} from './options.js';
import settings from './settings.json' with {type: 'json'};

let objects = [];
let names = [];
let guis = []; // 0: main gui; 1: toolGui; 2: info option; 3: animation gui; 4: info gui 10: pop ups
let toolGui, animationGui, infoGui;

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
            save: {}
        }

        objects.push(object);
        names.push(newName);
    }

    saveObject(object, multiple) {
        const save = guis[0].save();

        if(multiple == 'light' || (multiple == null && save.folders.properties.controllers["light / shadow"] == 'light')) { //if object folder switches from light to shadow or if normal save but its a multiple folder object
            object.save.light = save.folders.properties.controllers;
        }
        else if(multiple == 'shadow' || (multiple == null && save.folders.properties.controllers["light / shadow"] == 'shadow')) {
            object.save.shadow = save.folders.properties.controllers;
        }
        else {
            object.save.main = save.folders.properties.controllers;
        }
    }
}
const collection = new Collection();
base.collection = collection;


export class MiniCAD {
    constructor(scene, camera, controls, renderer) {
        const gui = new GUI({title: 'miniCAD'});
        guis[0] = gui;
        toolGui = new ToolGui(base);
        guis[1] = toolGui;
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
                    guis[1].gui.hide();
                    guis[2].style.display = 'none';
                    guis[3].gui.hide();
                }
                else {
                    shown = true;
                    guis[0].show();
                    guis[1].gui.show();
                    guis[2].style.display = 'flex';
                    guis[3].gui.hide();
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
        functions: "functions",
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

    const functionTab = headerFolder.add(headerParams, 'functions', ['save', 'info', 'animation']).onChange(function(value) {
        headerParams.functions = "functions";
        functionTab.updateDisplay();

        switch(value) {
            case 'save' :
                if(guis[10] != null) {guis[10].destroy();}
                guis[10] = new SaveGui(collection, selectedObject);
                collection.saveObject(selectedObject);
                break;

            case 'info' :
                infoGui = new InfoGui(base);
                guis[4] = infoGui;
                break;

            case 'animation' : 
                animationGui = new AnimationGui(base, guis, importPoints);
                guis[3] = animationGui;
                break; 
        }
    });
    functionTab.domElement.children[0].style.display = "none";
    functionTab.domElement.children[1].children[1].style.width = "100%";

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
            collection.saveObject(selectedObject);
        }

        selectedObject = collection.getObject(value);
        var oldFolder = elementFolder;

        elementFolder = new DataGui(base, gui, selectedObject);
        selectedObject.gui = elementFolder;

        toolGui.attachObject(selectedObject, true);

        if(oldFolder != null) {oldFolder.destroy();}
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
    if(infoGui != null) {infoGui.animate();}
}