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
import {TransformControls} from 'three/addons/controls/TransformControls.js';
import settings from './settings.json' with {type: 'json'};

let base, gui, guiTools, transformControls, toolFolder;
let transformationButton, translateButton, scaleButton, rotationButton;
let selectedObject = 0;
let updatable = true;

let precision = 0;

class History {
    constructor(historySize) {
        this.historySize = historySize;

        if(this.historySize < 0) {this.historySize = 0;}
        else if(this.historySize > 10) {this.historySize = 10;}

        this.historyArray = [];
        this.currentIndex = 0;
    }

    saveHistory(object) {
        
        for(let i = this.historySize * 2; i > 0; i--) {
            this.historyArray[i - this.currentIndex] = this.historyArray[i-1];
        }
        for(let i = this.historySize + 1; i < this.historyArray.length; i++) {
            this.historyArray[i] = null;
        }
        this.currentIndex = 0;

        function pending(historyArray) {
            if(object.type == 'Mesh') {
                historyArray[0] = {
                    object: object,
                    position: new THREE.Vector3(object.mesh.position.x, object.mesh.position.y, object.mesh.position.z),
                    scale: new THREE.Vector3(object.mesh.scale.x, object.mesh.scale.y, object.mesh.scale.z),
                    rotation: new THREE.Euler(object.mesh.rotation.x, object.mesh.rotation.y, object.mesh.rotation.z)
                };
            }
            else if(object.gui.isMesh) {
                historyArray[0] = {
                    object: object,
                    position: new THREE.Vector3(object.mesh.position.x, object.mesh.position.y, object.mesh.position.z)
                };
            }
        }

        pending(this.historyArray);

    }

    undo() {
        if(this.currentIndex < this.historySize) {
            this.currentIndex++;
            if(this.historyArray[this.currentIndex].object.type == 'Mesh') {
                selectedObject.mesh.position.copy(this.historyArray[this.currentIndex].position);
                selectedObject.mesh.scale.copy(this.historyArray[this.currentIndex].scale);
                selectedObject.mesh.rotation.copy(this.historyArray[this.currentIndex].rotation);
            }
            else {
                selectedObject.mesh.position.copy(this.historyArray[this.currentIndex].position);
            }
            updateObject();
        }
    }

    redo() {
        if(this.currentIndex > 0) {
            this.currentIndex--;
            if(this.historyArray[this.currentIndex].object.type == 'Mesh') {
                this.historyArray[this.currentIndex].object.mesh.position.copy(this.historyArray[this.currentIndex].position);
                this.historyArray[this.currentIndex].object.mesh.scale.copy(this.historyArray[this.currentIndex].scale);
                this.historyArray[this.currentIndex].object.mesh.rotation.copy(this.historyArray[this.currentIndex].rotation);
            }
            else {
                selectedObject.mesh.position.copy(this.historyArray[this.currentIndex].position);
            }
            updateObject();
        }
    }

    reset() {
        this.historyArray = [];
        this.currentIndex = 0;
    }
}
const history = new History(settings.transformation.HISTORYSIZE);


export class ToolGui {
    gui = new GUI({title: 'tools', width: 75});
    
    constructor(elements) {
        base = elements;
        gui = base.guis[0];

        this.gui.hide();
        guiTools = this.gui;
    }

    init() {

        transformControls = new TransformControls(base.camera, base.renderer.domElement);
        
        const gizmo = transformControls.getHelper();
        
        guiTools.show();

        guiTools.domElement.style.left = 'absolute';
        guiTools.domElement.style.left = '0.5%';
        guiTools.domElement.style.top = '52px';

        guiTools.open();

        const optionsFolder = guiTools.addFolder("options");
        optionsFolder.domElement.style.display = "flex";
        optionsFolder.domElement.style.flexDirection = "column";

        let optionsParams = {
            undo: function() {
                history.undo();
            },
            redo: function() {
                history.redo();
            },
            lock: function() {
                document.body.requestPointerLock();
            },
            transformation: false,
        }
        const undoArrow = optionsFolder.add(optionsParams, 'undo').name("↶");
        undoArrow.domElement.style.position = "relative";

        const redoArrow = optionsFolder.add(optionsParams, 'redo').name("↷");
        redoArrow.domElement.style.position = "relative";

        optionsFolder.add(optionsParams, 'lock')
        .name("📷🔒 (" + settings.transformation.LOCK + ")");
        transformationButton = optionsFolder.add(optionsParams, 'transformation')
        .name("🔧 (" + settings.transformation.TOGGLE_TRANSFORMATION + ")")
        .onChange(function(value) {
            if(value) {base.scene.add(gizmo);}
            else {base.scene.remove(gizmo);}
        });
        transformationButton.disable();

        optionsFolder.domElement.children[1].style.display = "flex";
        optionsFolder.domElement.children[1].style.flexWrap = "wrap";
        optionsFolder.controllers[0].domElement.style.flex = "1 0 50%";
        optionsFolder.controllers[1].domElement.style.flex = "1 0 50%";
        optionsFolder.controllers[2].domElement.style.flex = "1 0 100%";
        optionsFolder.controllers[3].domElement.style.flex = "1 0 100%";

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
            else if(event.key == settings.transformation.LOCK) {
                document.body.requestPointerLock();
            }
        });
        transformControls.addEventListener( 'dragging-changed', function (event) {
            if(base.controls == null) {return 0;}
            base.controls.enabled = !event.value;
        } );

        const transformationFolder = guiTools.addFolder("");
        let transformationParams = {
            translate: function() {
                if(optionsParams.transformation == true) {
                    destroyGui(toolFolder);
                    enableTranslate();
                }
            },
            scale: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'Mesh') {
                    destroyGui(toolFolder);
                    enableScale();
                }
            },
            rotation: function() {
                if(optionsParams.transformation == true && selectedObject.type == 'Mesh') {
                    destroyGui(toolFolder);
                    enableRotate();
                }
            }
        }
        translateButton = transformationFolder.add(transformationParams, 'translate')
        .name("✥ (" + settings.transformation.TOGGLE_TRANSLATE + ")");
        scaleButton = transformationFolder.add(transformationParams, 'scale')
        .name("⤢ (" + settings.transformation.TOGGLE_SCALE + ")");
        rotationButton = transformationFolder.add(transformationParams, 'rotation')
        .name("⟳ (" + settings.transformation.TOGGLE_ROTATE + ")");

        document.addEventListener('keydown', function (event) {
            if(event.key == settings.transformation.TOGGLE_TRANSLATE && optionsParams.transformation == true) {
                destroyGui(toolFolder);
                enableTranslate();
            }
            else if(event.key == settings.transformation.TOGGLE_SCALE && optionsParams.transformation == true && selectedObject.type == 'Mesh') {
                destroyGui(toolFolder);
                enableScale();
            }
            else if(event.key == settings.transformation.TOGGLE_ROTATE && optionsParams.transformation == true && selectedObject.type == 'Mesh') {
                destroyGui(toolFolder);
                enableRotate();
            }
        });

        transformControls.addEventListener( 'mouseUp', function ( event ) {
            updateObject();
            history.saveHistory(selectedObject);
        } );

        document.addEventListener('keydown', function (event) {
            switch(event.key) {
                case settings.transformation.UNDO_KEY: 
                    history.undo();
                    break;
                
                case settings.transformation.REDO_KEY:
                    history.redo();
                    break;
            }
        })
    }

    attachObject(object, update) {
        if(object != null) {
            if(object.gui.isMoveable) {
                selectedObject = object;
                if(update != null) {updatable = update;}

                destroyGui(toolFolder);
            
                transformControls.attach(selectedObject.mesh);
                transformationButton.enable();
                enableTranslate();
                history.saveHistory(selectedObject);
            }
        }
        else {
            transformControls.detach();
            transformationButton.disable();
        }
    }
}

function updateObject() {
    if(updatable == true) {
        for(let i = 0; i < gui.folders[1].controllers.length; i++) {

            gui.folders[1].controllers[0].object.position_x = selectedObject.mesh.position.x;
            gui.folders[1].controllers[0].object.position_y = selectedObject.mesh.position.y;
            gui.folders[1].controllers[0].object.position_z = selectedObject.mesh.position.z;
            gui.folders[1].controllers[1].updateDisplay();
            gui.folders[1].controllers[2].updateDisplay();
            gui.folders[1].controllers[3].updateDisplay();
            

            if(selectedObject.type == 'Mesh') {
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
}

function enableTranslate() {
    
    transformControls.setMode('translate');
    translateButton.disable();
    rotationButton.enable();
    scaleButton.enable();

    toolFolder = guiTools.addFolder("translate");

    let params = {
        snap: true,
        precision: precision,
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        setSnap(value);
    });
    toolFolder.add(params, "precision").name("10e").onChange(function(value) {
        precision = value;
        transformControls.setTranslationSnap(1 * Math.pow(10, value));
    });

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                setSnap(true);
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                setSnap(false);
            }
        }
    });

    function setSnap(value) {
        if(value) {
            transformControls.setTranslationSnap(1 * Math.pow(10, params.precision));
        }
        else {
            transformControls.setTranslationSnap(null);
        }
    }
    setSnap(true);
}

function enableScale() {
    
    let ratio;

    transformControls.setMode('scale');
    scaleButton.disable();
    rotationButton.enable();
    translateButton.enable();

    toolFolder = guiTools.addFolder("scale");

    let params = {
        snap: true,
        precision: precision,
        constrain: true,
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        setSnap(value);
    });
    toolFolder.add(params, "precision", -5, 5, 1).name("10e").onChange(function(value) {
        precision = value;
        transformControls.setScaleSnap(1 * Math.pow(10, value));
    });
    toolFolder.add(params, "constrain").onChange(function() {
        setConstrain();
    })

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                setSnap(true);
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                setSnap(false);
            }
        }
    });

    function setSnap(value) {
        if(value) {
            transformControls.setScaleSnap(1 * Math.pow(10, params.precision));
        }
        else {
            transformControls.setScaleSnap(null);
        }
    }
    setSnap(true);

    function setConstrain() {
        //constrain on size changes (all size change at once)
    }
    setConstrain();
}

function enableRotate() {
    
    transformControls.setMode('rotate');
    rotationButton.disable();
    scaleButton.enable();
    translateButton.enable();

    toolFolder = guiTools.addFolder("rotate");

    let params = {
        snap: true
    }

    const snap = toolFolder.add(params, "snap")
    .name("snap (" + settings.transformation.TOGGLE_SNAP + ")")
    .onChange(function(value) {
        setSnap(value);
    });

    document.addEventListener('keydown', function (event) {
        if(event.key == settings.transformation.TOGGLE_SNAP) {
            if(params.snap == false) {
                params.snap = true;
                snap.updateDisplay();
                setSnap(true);
            }
            else {
                params.snap = false;
                snap.updateDisplay();
                setSnap(false);
            }
        }
    });
    
    function setSnap(value) {
        if(value) {
            transformControls.setRotationSnap(45 * Math.PI / 180);
        }
        else {
            transformControls.setRotationSnap(null);
        }
    }
    setSnap(true);
}

function destroyGui(gui) {
    if(gui != null) {
        for(let i = 0; i < gui.controllers.length; i++) {
            gui.controllers[i].destroy();
        }
        gui.destroy();
    }
}