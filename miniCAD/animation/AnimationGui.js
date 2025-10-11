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
import {BasicPath, BasicPathGui} from './BasicPath.js';
import {AnimationPath, AnimationPathGui} from './AnimationPath.js';
import {CameraTravellingPath, CameraTravellingPathGui} from './CameraTravellingPath.js';
import {AddPathGui} from './AddPathGui.js';

const folder = [];
let opened = false;

const paths = {name: [], path: []};
let toolGui, collection, camera;
let animationGui;
let selectedPath;
let pathGui;
let pathPicker, pathName, pathType;

export class AnimationGui {
    constructor(base, _toolGui, importPoints) {
        const scene = base.scene;
        camera = base.camera;
        toolGui = _toolGui;
        collection = base.collection

        openGui(scene);
        if(importPoints != null) {importPath(importPoints, scene);}
    }

    animate() {
        if(selectedPath != null) {pathGui.animate();}
     }
}


function openGui(scene) {

    const width = [window.innerWidth * 0.099, window.innerWidth * 0.201, window.innerWidth * 0.099, 
        window.innerWidth * 0.201, window.innerWidth * 0.055, window.innerWidth * 0.245]


    //main
    animationGui = new GUI({title: '', width: window.innerWidth * 0.1});
    animationGui.domElement.style.left = window.innerWidth * 0.05 + 'px';
    animationGui.domElement.style.top = window.innerHeight * 0.8 + 'px';
    opened = true;

    //0
    folder[0] = animationGui.addFolder("animation");
    folderLayout(0);
    
    const params0 = {
        close: function() {
            closeGui();
        },
        add_path: function() {
            new AddPathGui(scene, paths, updatePathPicker);
        },
        export: function () {
            exportPaths();
        }
    };
    folder[0].add(params0, 'close');
    folder[0].add(params0, 'add_path');
    folder[0].add(params0, 'export');

    //1
    folder[1] = animationGui.addFolder("");
    folderLayout(1);

    const params1 = {
        name: "untitled",
        type: function() {},
        path: 'Select path'
    };
    pathName = folder[1].add(params1, 'name').onFinishChange(function(value) {
        rename(value);
    });
    pathType = folder[1].add(params1, 'type').disable();
    pathPicker = folder[1].add(params1, 'path', paths.name).onFinishChange(function(value) {
        pickPath(value);
    });

    //2
    folder[2] = animationGui.addFolder("points");
    folderLayout(2);
    folder[2].hide();

    //3
    folder[3] = animationGui.addFolder("point Position");
    folderLayout(3);
    folder[3].hide();

    //4
    folder[4] = animationGui.addFolder("");
    folderLayout(4);
    folder[4].hide();

    //5
    folder[5] = animationGui.addFolder("path");
    folderLayout(5);
    folder[5].hide();


    function folderLayout(id) {
        folder[id].domElement.style.position = "absolute";
        folder[id].domElement.style.width = width[id] + "px";
        
        let left = 0;
        for(let i = 0; i < id; i++) {
            left += width[i];
        }
        folder[id].domElement.style.left = left + "px";
        folder[id].domElement.style.top = "0px";
    }
}

//0
function closeGui() {
    animationGui.destroy();
    opened = false;
}

function updatePathPicker() {
    
    pathPicker = pathPicker.options(paths.name);
    pathPicker.onChange(function(value) {
        pickPath(value);
    });
}

function exportPaths() {

    console.log(paths.name);
    for(let i = 0; i < paths.name.length; i++) {
        console.log(paths.name[i] + " :\n");
        
        if(paths.path[i].type == "Camera Travelling Path") {
            console.log("Camera Path:\n");
            
            let save = "const points = [\n";
            const cameraPoints = paths.path[i].cameraPoints;
            
            for(let i = 0; i < cameraPoints.length; i++) {
                save += "   new THREE.Vector3(" + cameraPoints[i].x + ", " + cameraPoints[i].y + ", " + cameraPoints[i].z + "),\n";
            }
            save += "];"
            console.log(save);

            console.log("Heading Path:\n");
            
            save = "const points = [\n";
            const headingPoints = paths.path[i].headingPoints;
            
            for(let i = 0; i < headingPoints.length; i++) {
                save += "   new THREE.Vector3(" + headingPoints[i].x + ", " + headingPoints[i].y + ", " + headingPoints[i].z + "),\n";
            }
            save += "];"
            console.log(save);
        }
        else {
            let save = "const points = [\n";
            const points = paths.path[i].points;
            
            for(let i = 0; i < points.length; i++) {
                save += "   new THREE.Vector3(" + points[i].x + ", " + points[i].y + ", " + points[i].z + "),\n";
            }
            save += "];"
            console.log(save);
        }
    }
}

//1
function rename(value) {
    paths.name[selectedPath[1]] = value;
    updatePathPicker();
}

function pickPath(value) {

    function emptyFolder(folder) {
        
        if(folder.controllers.length != 0) {

            const length = folder.controllers.length;
            
            for(let i = 0; i < length; i++) {
                folder.controllers[0].destroy();
            }
        }
    }
    emptyFolder(folder[2]);
    emptyFolder(folder[3]);
    emptyFolder(folder[4]);
    emptyFolder(folder[5]);
    
    const id = paths.name.indexOf(value);
    selectedPath = [paths.path[id], id]; //[0] is the path [1] is the path’s name

    pathName.object.name = value;
    pathName.updateDisplay();

    pathType.name(selectedPath[0].type);
    pathType.updateDisplay();

    if(selectedPath[0].type == "Basic Path") {
        pathGui = new BasicPathGui(folder, selectedPath[0], toolGui);
    }
    else if(selectedPath[0].type == "Animation Path") {
        pathGui = new AnimationPathGui(folder, selectedPath[0], toolGui, collection);
    }
    else if(selectedPath[0].type == "Camera Travelling Path") {
        pathGui = new CameraTravellingPathGui(folder, selectedPath[0], toolGui, collection, camera);
    }
}


function importPath(importPoints, scene) {
    for(let i = 0; i < importPoints.length; i++) {

        let idName = 0;
        let name = importPoints[i].type;
        let newName = name;

        while(paths.name.includes(newName)) {
            idName ++;
            newName = name + idName;
        }
            
        if(importPoints[i].type == "Basic Path") {
            paths.path.push(new BasicPath(scene, importPoints[i].points));
            paths.name.push(newName);
        }
        else if(importPoints[i].type == "Animation Path") {
            paths.path.push(new AnimationPath(scene, importPoints[i].points));
            paths.name.push(newName);
        }
        else if(importPoints[i].type == "Camera Travelling Path") {
            paths.path.push(new CameraTravellingPath(scene, importPoints[i].points, importPoints[i].secondaryPoints));
            paths.name.push(newName);
        }
    }
    updatePathPicker();
}