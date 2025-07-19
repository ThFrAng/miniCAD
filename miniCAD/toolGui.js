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
import {GUI} from '../jsm/libs/lil-gui.module.min.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import settings from './settings.json' with {type: 'json'};

let base, gui, guiTools, transformControls, toolFolder;
let transformationButton, translateButton, scaleButton, rotationButton;
let selectedObject = 0;

export class ToolGui {
    constructor(elements, mainGui) {
        base = elements;
        gui = mainGui;
    }

    init() {

        transformControls = new TransformControls(base.camera, base.renderer.domElement);
        
        const gizmo = transformControls.getHelper();

        guiTools = new GUI({title: 'tools', width: 150});

        guiTools.domElement.style.left = 'absolute';
        guiTools.domElement.style.left = '0.5%';
        guiTools.domElement.style.top = '42px';

        guiTools.open();

        const optionsFolder = guiTools.addFolder("options");
        let optionsParams = {
            exit: function() {
                document.body.requestPointerLock();
            },
            transformation: false,
        }
        optionsFolder.add(optionsParams, 'exit')
        .name("exit (" + settings.transformation.EXIT + ")");
        transformationButton = optionsFolder.add(optionsParams, 'transformation')
        .name("transformation (" + settings.transformation.TOGGLE_TRANSFORMATION + ")")
        .onChange(function(value) {
            if(value) {base.scene.add(gizmo);}
            else {base.scene.remove(gizmo);}
        });
        transformationButton.disable();

        document.addEventListener('keydown', function (event) {
            if(event.key == settings.transformation.TOGGLE_TRANSFORMATION) {
                if(optionsParams.transformation == false) {
                    optionsParams.transformation = true;
                    transformationButton.updateDisplay();
                    base.scene.add(gizmo);
                }
                else {
                    optionsParams.transformation = false;
                    transformationButton.updateDisplay();
                    base.scene.remove(gizmo);
                }
            }
            else if(event.key == settings.transformation.EXIT) {
                document.body.requestPointerLock();
            }
        });

        const transformationFolder = guiTools.addFolder("");
        let transformationParams = {
            translate: function() {
                if(optionsParams.transformation == true) {
                    destroyGui(toolFolder);
                    enableTranslate();
                }
            },
            scale: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'mesh') {
                    destroyGui(toolFolder);
                    enableScale();
                }
            },
            rotation: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'mesh') {
                    destroyGui(toolFolder);
                    enableRotate();
                }
            }
        }
        translateButton = transformationFolder.add(transformationParams, 'translate')
        .name("translate (" + settings.transformation.TOGGLE_TRANSLATE + ")");
        scaleButton = transformationFolder.add(transformationParams, 'scale')
        .name("scale (" + settings.transformation.TOGGLE_SCALE + ")");
        rotationButton = transformationFolder.add(transformationParams, 'rotation')
        .name("rotate (" + settings.transformation.TOGGLE_ROTATE + ")");

        document.addEventListener('keydown', function (event) {
            if(event.key == settings.transformation.TOGGLE_TRANSLATE && optionsParams.transformation == true) {
                destroyGui(toolFolder);
                enableTranslate();
            }
            else if(event.key == settings.transformation.TOGGLE_SCALE && optionsParams.transformation == true && selectedObject.type == 'mesh') {
                destroyGui(toolFolder);
                enableScale();
            }
            else if(event.key == settings.transformation.TOGGLE_ROTATE && optionsParams.transformation == true && selectedObject.type == 'mesh') {
                destroyGui(toolFolder);
                enableRotate();
            }
        });

        transformControls.addEventListener( 'dragging-changed', function ( event ) {
            updateObject()
        } );
    }

    attachObject(object) {
        selectedObject = object;
        transformControls.attach(selectedObject.mesh);
        transformationButton.enable();
        enableTranslate();
    }
}

function updateObject() {
    for(let i = 0; i < gui.folders[1].controllers.length; i++) {
        
        if(selectedObject.type != 'light') {
            gui.folders[1].controllers[0].object.position_x = selectedObject.mesh.position.x;
            gui.folders[1].controllers[0].object.position_y = selectedObject.mesh.position.y;
            gui.folders[1].controllers[0].object.position_z = selectedObject.mesh.position.z;
            gui.folders[1].controllers[1].updateDisplay();
            gui.folders[1].controllers[2].updateDisplay();
            gui.folders[1].controllers[3].updateDisplay();
        }
        else {
            gui.folders[1].folders[0].controllers[0].object.position_x = selectedObject.mesh.position.x;
            gui.folders[1].folders[0].controllers[0].object.position_y = selectedObject.mesh.position.y;
            gui.folders[1].folders[0].controllers[0].object.position_z = selectedObject.mesh.position.z;
            gui.folders[1].folders[0].controllers[1].updateDisplay();
            gui.folders[1].folders[0].controllers[2].updateDisplay();
            gui.folders[1].folders[0].controllers[3].updateDisplay();
        }
        
        

        if(selectedObject.type == 'mesh') {
            gui.folders[1].controllers[0].object.scale_x = selectedObject.mesh.scale.x;
            gui.folders[1].controllers[0].object.scale_y = selectedObject.mesh.scale.y;
            gui.folders[1].controllers[0].object.scale_z = selectedObject.mesh.scale.z;
            gui.folders[1].controllers[4].updateDisplay();
            gui.folders[1].controllers[5].updateDisplay();
            gui.folders[1].controllers[6].updateDisplay();
            gui.folders[1].controllers[0].object.rotation_x = selectedObject.mesh.rotation.x;
            gui.folders[1].controllers[0].object.rotation_y = selectedObject.mesh.rotation.y;
            gui.folders[1].controllers[0].object.rotation_z = selectedObject.mesh.rotation.z;
            gui.folders[1].controllers[7].updateDisplay();
            gui.folders[1].controllers[8].updateDisplay();
            gui.folders[1].controllers[9].updateDisplay();
        }
    }
}

function enableTranslate() {
    
    transformControls.setMode('translate');
    translateButton.disable();
    rotationButton.enable();
    scaleButton.enable();

    toolFolder = guiTools.addFolder("translate");

    let params = {
        snap: false,
        precision: 0,
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        if(value) {
            transformControls.setTranslationSnap(1 * Math.pow(10, params.precision));
        }
        else {
            transformControls.setTranslationSnap(null);
        }
    });
    toolFolder.add(params, "precision", -5, 5, 1).name("10e").onChange(function(value) {
        transformControls.setTranslationSnap(1 * Math.pow(10, value));
    });

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                transformControls.setTranslationSnap(1 * Math.pow(10, params.precision));
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                transformControls.setTranslationSnap(null);
            }
        }
    });
}

function enableScale() {
    
    transformControls.setMode('scale');
    scaleButton.disable();
    rotationButton.enable();
    translateButton.enable();

    toolFolder = guiTools.addFolder("scale");

    let params = {
        snap: false,
        precision: 0,
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        if(value) {
            transformControls.setScaleSnap(1 * Math.pow(10, params.precision));
        }
        else {
            transformControls.setScaleSnap(null);
        }
    });
    toolFolder.add(params, "precision", -5, 5, 1).name("10e").onChange(function(value) {
        transformControls.setScaleSnap(1 * Math.pow(10, value));
    });

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                transformControls.setScaleSnap(1 * Math.pow(10, params.precision));
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                transformControls.setScaleSnap(null);
            }
        }
    });
}

function enableRotate() {
    
    transformControls.setMode('rotate');
    rotationButton.disable();
    scaleButton.enable();
    translateButton.enable();

    toolFolder = guiTools.addFolder("rotate");

    let params = {
        snap: false
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        if(value) {
            transformControls.setRotationSnap(45 * Math.PI / 180);
        }
        else {
            transformControls.setRotationSnap(null);
        }
    });

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                transformControls.setRotationSnap(45 * Math.PI / 180);
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                transformControls.setRotationSnap(null);
            }
        }
    });
}

function destroyGui(gui) {
    for(let i = 0; i < gui.controllers.length; i++) {
        gui.controllers[i].destroy();
    }
    gui.destroy();
}