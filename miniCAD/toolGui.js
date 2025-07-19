import * as THREE from 'three';
import {GUI} from '../jsm/libs/lil-gui.module.min.js';
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import settings from './settings.json' with {type: 'json'};

let base, gui, transformControls, transformationButton, translateButton, scaleButton, rotationButton;
let selectedObject = 0;

export class ToolGui {
    constructor(elements, mainGui) {
        base = elements;
        gui = mainGui;
    }

    init() {

        transformControls = new TransformControls(base.camera, base.renderer.domElement);
        
        const gizmo = transformControls.getHelper();

        const guiTools = new GUI({title: 'tools', width: 100});

        guiTools.domElement.style.left = 'absolute';
        guiTools.domElement.style.left = '0.5%';
        guiTools.domElement.style.top = '42px';

        guiTools.open();

        const optionsFolder = guiTools.addFolder("options");
        let optionsParams = {
            transformation: false,
        }
        transformationButton = optionsFolder.add(optionsParams, 'transformation').onChange(function(value) {
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
        })

        const transformationFolder = guiTools.addFolder("");
        let transformationParams = {
            translate: function() {
                if(optionsParams.transformation == true) {
                    transformControls.setMode('translate');
                    translateButton.disable();
                    rotationButton.enable();
                    scaleButton.enable();
                }
            },
            scale: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'mesh') {
                    transformControls.setMode('scale');
                    scaleButton.disable();
                    translateButton.enable();
                    rotationButton.enable();
                }
            },
            rotation: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'mesh') {
                    transformControls.setMode('rotate');
                    rotationButton.disable();
                    translateButton.enable();
                    scaleButton.enable();
                }
            }
        }
        translateButton = transformationFolder.add(transformationParams, 'translate');
        scaleButton = transformationFolder.add(transformationParams, 'scale');
        rotationButton = transformationFolder.add(transformationParams, 'rotation');

        transformControls.addEventListener( 'dragging-changed', function ( event ) {
            updateObject()
        } );
    }

    attachObject(object) {
        selectedObject = object;
        transformControls.attach(selectedObject.mesh);
        transformControls.setMode('translate');
        
        transformationButton.enable();
        translateButton.disable();
        scaleButton.enable();
        rotationButton.enable();
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