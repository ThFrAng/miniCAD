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

import {ToolGui} from './toolGui.js';
import {loadOptions} from './options.js';
import settings from './settings.json' with {type: 'json'};

import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import {MeshBVHHelper} from 'https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.7.3/build/index.module.js';
import {CSMHelper} from 'three/addons/csm/CSMHelper.js';

let objects = [];
let names = [];
let customFolder = [];
let toolGui;

let bufferCameraPosition = new THREE.Vector3(0, 0, 0);

let id = 0;

let base = {};

class Collection {

    getObject(name) {
        const object = objects.find((object) => object.name === name);
        return object;
    }

    getNames() {
        return names;
    }

    add(mesh, type, name) {
        let nameId = 0;
        let newName = name;

        while(names.includes(newName)) {
            nameId += 1;
            newName = name + nameId;
        }
        
        const object = {
            mesh: mesh,
            type: type,
            name: newName,
            id: 0,
            save: 0
        }

        objects.push(object);
        names.push(newName);
    }

    saveObject(object, gui) {
        const save = gui.save();
        object.save = save.folders.properties.controllers;
    }
}
const collection = new Collection();


export class MiniCAD {
    constructor(scene, camera, renderer) {
        const gui = new GUI({title: 'miniCAD'});
        toolGui = new ToolGui(base, gui);
        base.camera = camera;
        base.scene = scene;
        base.renderer = renderer;

        const initFolder = gui.addFolder('init');
        const initParams = {
            open: function () {
                load(gui, base);
                initFolder.destroy();
                
                if(settings.transformation.USE_TRANSFORMATION_TOOLS == "true") {toolGui.init()}
            }
        }
        initFolder.add(initParams, 'open');
        loadOptions(base.camera, collection);

        gui.open();
    }

    add(mesh, type, name) {
        id++;
        collection.add(mesh, type, name, id);
    }

    addCustom(object, name) {
        id++;
        name = "Custom " + name;
        collection.add(object, 'custom', name);
        customFolder[id] = gui;
    }
}

function load(gui, base) {
    const headerFolder = gui.addFolder('header');
    var elementFolder;
    var selectedObject = 0;

    const headerParams = {
        save: function() {
            collection.saveObject(selectedObject, gui);
            save();
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

        elementFolder = paramsGui(gui, selectedObject.mesh, selectedObject.type, base.scene);
        toolGui.attachObject(selectedObject);
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


function save() {
    let save = [];

    for(let i = 0; i < names.length; i++) {
        
        const selectedObject = collection.getObject(names[i]);
        
        const object = {
            name: names[i],
            parameters: selectedObject.save
        }
        if(object.parameters != 0) {
            save[i] = object;
        }
    }
    console.log(save);
    alert("Saved as an array in the console");
}

function moveToCamera(object) {
    object.position.set(base.camera.position.x, base.camera.position.y, base.camera.position.z);
}


export function paramsGui(gui, object, type, scene) {
    const elementFolder = gui.addFolder('properties');
    if (type == 'mesh') {
        
        const params = {
            move_to_camera: function() {
                moveToCamera(object);
                params.position_x = object.position.x;
                positionX.updateDisplay();
                params.position_y = object.position.y;
                positionY.updateDisplay();
                params.position_z = object.position.z;
                positionZ.updateDisplay();
            },
            position_x: object.position.x,
            position_y: object.position.y,
            position_z: object.position.z,
            scale_x: object.scale.x,
            scale_y: object.scale.y,
            scale_z: object.scale.z,
            rotation_x: object.rotation.x,
            rotation_y: object.rotation.y,
            rotation_z: object.rotation.z,
        };

        elementFolder.add(params, 'move_to_camera').name("move to camera");
        const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
            object.position.x = value;
        });
        const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
            object.position.y = value;
        });
        const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
            object.position.z = value;
        }); 
        elementFolder.add(params, 'scale_x').onChange(function(value) {
            object.scale.x = value;
        });
        elementFolder.add(params, 'scale_y').onChange(function(value) {
            object.scale.y = value;
        });
        elementFolder.add(params, 'scale_z').onChange(function(value) {
            object.scale.z = value;
        });
        elementFolder.add(params, 'rotation_x', 0, 2*Math.PI).onChange(function(value) {
            object.rotation.x = value;
        });
        elementFolder.add(params, 'rotation_y', 0, 2*Math.PI).onChange(function(value) {
            object.rotation.y = value;
        });
        elementFolder.add(params, 'rotation_z', 0, 2*Math.PI).onChange(function(value) {
            object.rotation.z = value;
        });
        console.log(positionX);
    }
    if(type == 'material') {
        if(object.isMaterial) {
            const params = {
                color: object.color.getHex(),
                transparent: object.transparent,
                opacity: object.opacity
            }
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
            elementFolder.add(params, 'transparent').onChange(function(value) {
                object.transparent = value;
            });
            elementFolder.add(params, 'opacity', 0, 1, 0.001).onChange(function(value) {
                object.opacity = value;
            });
        }
    }
    if(type == 'physicalMaterial') {
        const params = {
            color: object.color.getHex(),
            emissive: object.emissive.getHex(),
            transparent: object.transparent,
            opacity: object.opacity,
            roughness: object.roughness,
            metalness: object.metalness,
            ior: object.ior,
            reflectivity: object.reflectivity,
            iridescence: object.iridescence,
            iridescence_ior: object.iridescenceIOR,
            sheen: object.sheen,
            sheen_roughness: object.sheenRoughness,
            sheen_color: object.sheenColor.getHex(),
            clearcoat: object.clearcoat,
            clearcoat_roughness: object.clearcoatRoughness,
            specular_intensity: object.specularIntensity,
            specular_color: object.specularColor.getHex(),
            thickness: object.thickness,
            transmission: object.transmission
        }
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.color.setHex(value);
        });
        elementFolder.addColor(params, 'emissive').onChange(function(value) {
            object.emissive.setHex(value);
        });
        elementFolder.add(params, 'transparent').onChange(function(value) {
            object.transparent = value;
        });
        elementFolder.add(params, 'opacity', 0, 1, 0.001).onChange(function(value) {
            object.opacity = value;
        });
        elementFolder.add(params, 'roughness', 0, 1, 0.001).onChange(function(value) {
            object.roughness = value;
        });
        elementFolder.add(params, 'metalness', 0, 1, 0.001).onChange(function(value) {
            object.metalness = value;
        });
        elementFolder.add(params, 'ior', 0, 2.33, 0.001).onChange(function(value) {
            object.ior = value;
        });
        elementFolder.add(params, 'reflectivity', 0, 1, 0.001).onChange(function(value) {
            object.reflectivity = value;
        });
        elementFolder.add(params, 'iridescence', 0, 1, 0.001).onChange(function(value) {
            object.iridescence = value;
        });
        elementFolder.add(params, 'iridescence_ior', 0, 1, 0.001).onChange(function(value) {
            object.iridescenceIOR = value;
        });
        elementFolder.add(params, 'sheen', 0, 1, 0.001).onChange(function(value) {
            object.sheen = value;
        });
        elementFolder.add(params, 'sheen_roughness', 0, 1, 0.001).onChange(function(value) {
            object.sheenRoughness = value;
        });
        elementFolder.addColor(params, 'sheen_color').onChange(function(value) {
            object.sheenColor.setHex();
        });
        elementFolder.add(params, 'clearcoat', 0, 1, 0.001).onChange(function(value) {
            object.clearcoat = value;
        });
        elementFolder.add(params, 'clearcoat_roughness', 0, 1, 0.001).onChange(function(value) {
            object.clearcoatRoughness = value;
        });
        elementFolder.add(params, 'specular_intensity', 0, 1, 0.001).onChange(function(value) {
            object.specularIntensity = value;
        });
        elementFolder.addColor(params, 'specular_color').onChange(function(value) {
            object.specularColor.setHex();
        });
        elementFolder.add(params, 'thickness', 0, 1, 0.001).onChange(function(value) {
            object.thickness = value;
        });
        elementFolder.add(params, 'transmission', 0, 1, 0.001).onChange(function(value) {
            object.transmission = value;
        });
    }
    if(type == 'phongMaterial') {
        const params = {
            color: object.color.getHex(),
            emissive: object.emissive.getHex(),
            specular: object.specular.getHex(),
            transparent: object.transparent,
            opacity: object.opacity,
            shininess: object.shininess,
            reflectivity: object.reflectivity,
            refraction_ratio: object.refractionRatio

        }
        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.color.setHex(value);
        });
        elementFolder.addColor(params, 'emissive').onChange(function(value) {
            object.emissive.setHex(value);
        });
        elementFolder.addColor(params, 'specular').onChange(function(value) {
            object.specular.setHex(value);
        });
        elementFolder.add(params, 'transparent').onChange(function(value) {
            object.transparent = value;
        });
        elementFolder.add(params, 'opacity', 0, 1, 0.001).onChange(function(value) {
            object.opacity = value;
        });
        elementFolder.add(params, 'shininess', 0, 100).onChange(function(value) {
            object.shininess = value;
        });
        elementFolder.add(params, 'reflectivity', 0, 1, 0.01).onChange(function(value) {
            object.reflectivity = value;
        });
        elementFolder.add(params, 'refraction_ratio', 0, 1, 0.01).onChange(function(value) {
            object.refractionRation = value;
        });
    }
    if (type == 'light') {
        if(object.isSpotLight) {
            const helper = new THREE.SpotLightHelper(object);        
            scene.add(helper);
            helper.visible = false;
            
            var lightElements;

            const lightShadowParams = {
                lightShadow: 'light'
            };
            elementFolder.add(lightShadowParams, 'lightShadow', ['light', 'shadow']).name('light / shadow').onChange(function(value) {
                if(value == 'light') {
                    var oldElements = lightElements;
                    lightElements = spotGui();
                    oldElements.destroy();
                }
                else if(value == 'shadow') {
                    lightElements.destroy();
                    lightElements = shadowGui();
                }
            });
            lightElements = spotGui();

            function spotGui() {
                const lightFolder = elementFolder.addFolder();
                let params = {
                    move_to_camera: function() {
                        moveToCamera(object);
                        params.position_x = object.position.x;
                        positionX.updateDisplay();
                        params.position_y = object.position.y;
                        positionY.updateDisplay();
                        params.position_z = object.position.z;
                        positionZ.updateDisplay();
                    },
                    position_x: object.position.x,
                    position_y: object.position.y,
                    position_z: object.position.z,
                    intensity: object.intensity,
                    decay: object.decay,
                    distance: object.distance,
                    penumbra: object.penumbra,
                    angle: object.angle,
                    color: object.color.getHex(),
                    target_x: object.target.position.x,
                    target_y: object.target.position.y,
                    target_z: object.target.position.z
                };

                lightFolder.add(params, 'move_to_camera').name("move to camera");
                const positionX = lightFolder.add(params, 'position_x').onChange(function(value) {
                    object.position.x = value;
                    helper.update();
                });
                const positionY = lightFolder.add(params, 'position_y').onChange(function(value) {
                    object.position.y = value;
                    helper.update();
                });
                const positionZ = lightFolder.add(params, 'position_z').onChange(function(value) {
                    object.position.z = value;
                    helper.update();
                }); 
                lightFolder.add(params, 'intensity').onChange(function(value) {
                    object.intensity = value;
                });
                lightFolder.add(params, 'decay', 0, 1).onChange(function(value) {
                    object.decay = value;
                    helper.update();
                });
                lightFolder.add(params, 'distance').onChange(function(value) {
                    object.distance = value;
                    helper.update();
                });
                lightFolder.add(params, 'penumbra', 0, 1).onChange(function(value) {
                    object.penumbra = value;
                    helper.update();
                });
                lightFolder.add(params, 'angle', 0, Math.PI/2).onChange(function(value) {
                    object.angle = value;
                    helper.update();
                });
                lightFolder.addColor(params, 'color').onChange(function(value) {
                    object.color.setHex(value);
                });
                lightFolder.add(params, 'target_x').onChange(function(value) {
                    object.target.position.x = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                lightFolder.add(params, 'target_y').onChange(function(value) {
                    object.target.position.y = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                lightFolder.add(params, 'target_z').onChange(function(value) {
                    object.target.position.z = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                const helperFolder = lightFolder.addFolder('helper');
                helperFolder.add(helper, 'visible').onChange(function() {
                    helper.updateVisibility();
                });

                return lightFolder;
            }
        }
        else if(object.isRectAreaLight) {
            const helper = new RectAreaLightHelper(object);
            scene.add(helper);
            helper.visible = false;
            
            let target = new THREE.Vector3(0, 0, 0);
            object.lookAt(target);
            let params = {
                move_to_camera: function() {
                    moveToCamera(object);
                    params.position_x = object.position.x;
                    positionX.updateDisplay();
                    params.position_y = object.position.y;
                    positionY.updateDisplay();
                    params.position_z = object.position.z;
                    positionZ.updateDisplay();
                },
                position_x: object.position.x,
                position_y: object.position.y,
                position_z: object.position.z,
                intensity: object.intensity,
                width: object.width,
                height: object.height,
                color: object.color.getHex(),
                target_x: target.x,
                target_y: target.y,
                target_z: target.z
            };

            elementFolder.add(params, 'move_to_camera').name("move to camera");
            const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
                object.position.x = value;
            });
            const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
                object.position.y = value;
            });
            const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
                object.position.z = value;
            }); 
            elementFolder.add(params, 'intensity').onChange(function(value) {
                object.intensity = value;
            });
            elementFolder.add(params, 'width').onChange(function(value) {
                object.width = value;
            });
            elementFolder.add(params, 'height').onChange(function(value) {
                object.height = value;
            });
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
            elementFolder.add(params, 'target_x').onChange(function(value) {
                target.x = value;
                object.lookAt(target);
            });
            elementFolder.add(params, 'target_y').onChange(function(value) {
                target.y = value;
                object.lookAt(target);
            });
            elementFolder.add(params, 'target_z').onChange(function(value) {
                target.z = value;
                object.lookAt(target);
            });
            const helperFolder = elementFolder.addFolder('helper');
            helperFolder.add(helper, 'visible').onChange(function() {
                helper.updateVisibility();
            });
        }
        else if(object.isDirectionalLight) {
            const helper = new THREE.DirectionalLightHelper(object);        
            scene.add(helper);
            helper.visible = false;
            
            var lightElements;

            const lightShadowParams = {
                lightShadow: 'light'
            };
            elementFolder.add(lightShadowParams, 'lightShadow', ['light', 'shadow']).name('light / shadow').onChange(function(value) {
                if(value == 'light') {
                    var oldElements = lightElements;
                    lightElements = directionalGui();
                    oldElements.destroy();
                }
                else if(value == 'shadow') {
                    lightElements.destroy();
                    lightElements = shadowGui();
                }
            });
            lightElements = directionalGui();

            function directionalGui() {
                const lightFolder = elementFolder.addFolder();
                let params = {
                    move_to_camera: function() {
                        moveToCamera(object);
                        params.position_x = object.position.x;
                        positionX.updateDisplay();
                        params.position_y = object.position.y;
                        positionY.updateDisplay();
                        params.position_z = object.position.z;
                        positionZ.updateDisplay();
                    },
                    position_x: object.position.x,
                    position_y: object.position.y,
                    position_z: object.position.z,
                    intensity: object.intensity,
                    color: object.color.getHex(),
                    target_x: object.target.position.x,
                    target_y: object.target.position.y,
                    target_z: object.target.position.z
                };

                lightFolder.add(params, 'move_to_camera').name("move to camera");
                const positionX = lightFolder.add(params, 'position_x').onChange(function(value) {
                    object.position.x = value;
                    helper.update();
                });
                const positionY = lightFolder.add(params, 'position_y').onChange(function(value) {
                    object.position.y = value;
                    helper.update();
                });
                const positionZ = lightFolder.add(params, 'position_z').onChange(function(value) {
                    object.position.z = value;
                    helper.update();
                }); 
                lightFolder.add(params, 'intensity').onChange(function(value) {
                    object.intensity = value;
                });
                lightFolder.addColor(params, 'color').onChange(function(value) {
                    object.color.setHex(value);
                });
                lightFolder.add(params, 'target_x').onChange(function(value) {
                    object.target.position.x = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                lightFolder.add(params, 'target_y').onChange(function(value) {
                    object.target.position.y = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                lightFolder.add(params, 'target_z').onChange(function(value) {
                    object.target.position.z = value;
                    object.target.updateMatrixWorld();
                    helper.update();
                });
                const helperFolder = lightFolder.addFolder('helper');
                helperFolder.add(helper, 'visible').onChange(function() {
                    helper.updateVisibility();
                });

                return lightFolder;
            }
        }
        else if(object.isAmbientLight) {
            let params = {
                intensity: object.intensity,
                color: object.color.getHex()
            }
            elementFolder.add(params, 'intensity').onChange(function(value) {
                object.intensity = value;
            });
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
        }
        else if(object.isHemisphereLight) {
            const helper = new THREE.HemisphereLightHelper(object);        
            scene.add(helper);
            helper.visible = false;

            let params = {
                move_to_camera: function() {
                    moveToCamera(object);
                    params.position_x = object.position.x;
                    positionX.updateDisplay();
                    params.position_y = object.position.y;
                    positionY.updateDisplay();
                    params.position_z = object.position.z;
                    positionZ.updateDisplay();
                },
                position_x: object.position.x,
                position_y: object.position.y,
                position_z: object.position.z,
                intensity: object.intensity,
                color: object.color.getHex(),
                ground_color: object.groundColor.getHex()
            }

            elementFolder.add(params, 'move_to_camera').name("move to camera");
            const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
                object.position.x = value;
                helper.update();
            });
            const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
                object.position.y = value;
                helper.update();
            });
            const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
                object.position.z = value;
                helper.update();
            });
            elementFolder.add(params, 'intensity').onChange(function(value) {
                object.intensity = value;
            });
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
            elementFolder.addColor(params, 'ground_color').onChange(function(value) {
                object.groundColor.setHex(value);
            });
            const helperFolder = elementFolder.addFolder('helper');
            helperFolder.add(helper, 'visible').onChange(function() {
            });
        }
        else if(object.isPointLight) {
            const helper = new THREE.PointLightHelper(object);
            scene.add(helper);
            helper.visible = false;

            let params = {
                move_to_camera: function() {
                    moveToCamera(object);
                    params.position_x = object.position.x;
                    positionX.updateDisplay();
                    params.position_y = object.position.y;
                    positionY.updateDisplay();
                    params.position_z = object.position.z;
                    positionZ.updateDisplay();
                },
                position_x: object.position.x,
                position_y: object.position.y,
                position_z: object.position.z,
                intensity: object.intensity,
                color: object.color.getHex(),
                decay: object.decay,
                distance: object.distance
            }

            elementFolder.add(params, 'move_to_camera').name("move to camera");
            const positionX = elementFolder.add(params, 'position_x').onChange(function(value) {
                object.position.x = value;
                helper.update();
            });
            const positionY = elementFolder.add(params, 'position_y').onChange(function(value) {
                object.position.y = value;
                helper.update();
            });
            const positionZ = elementFolder.add(params, 'position_z').onChange(function(value) {
                object.position.z = value;
                helper.update();
            });
            elementFolder.add(params, 'intensity').onChange(function(value) {
                object.intensity = value;
            });
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex() = value;
            });
            elementFolder.add(params, 'decay').onChange(function(value) {
                object.decay = value;
            });
            elementFolder.add(params, 'distance').onChange(function(value) {
                object.distance = value;
                helper.update();
            });
            const helperFolder = elementFolder.addFolder('helper');
            helperFolder.add(helper, 'visible').onChange(function() {
                helper.updateVisibility();
            });
        }
        else {
            let params = {
                position_x: object.position.x,
                position_y: object.position.y,
                position_z: object.position.z,
                intensity: object.intensity
            }
    
            elementFolder.add(params, 'position_x').onChange(function(value) {
                object.position.x = value;
            });
            elementFolder.add(params, 'position_y').onChange(function(value) {
                object.position.y = value;
            });
            elementFolder.add(params, 'position_z').onChange(function(value) {
                object.position.z = value;
            }); 
            elementFolder.add(params, 'intensity').onChange(function(value) {
                object.intensity = value;
            });
        }

        function shadowGui() {
            const shadowFolder = elementFolder.addFolder();
            let params = {
                shadow: object.castShadow,
                near: object.shadow.camera.near,
                far: object.shadow.camera.far,
                left: object.shadow.camera.left,
                right: object.shadow.camera.right,
                top: object.shadow.camera.top,
                bottom: object.shadow.camera.bottom,
                blur_samples: object.shadow.blurSamples,
                bias: object.shadow.bias
            };

            shadowFolder.add(params, 'shadow').onChange(function(value) {
                object.castShadow = value;
            });
            shadowFolder.add(params, 'near').onChange(function(value) {
                object.shadow.camera.near = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'far').onChange(function(value) {
                object.shadow.camera.far = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'left').onChange(function(value) {
                object.shadow.camera.left = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'right').onChange(function(value) {
                object.shadow.camera.right = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'top').onChange(function(value) {
                object.shadow.camera.top = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'bottom').onChange(function(value) {
                object.shadow.camera.bottom = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'blur_samples').onChange(function(value) {
                object.shadow.blurSamples = value;
                object.shadow.camera.updateProjectionMatrix();
            });
            shadowFolder.add(params, 'bias').onChange(function(value) {
                object.shadow.bias = value;
            })
            
            return shadowFolder;
        }
    }
    if(type == 'fog') {
        if(object.isFog) {
            let params = {
                color: object.color.getHex(),
                near: object.near,
                far: object.far
            };
            
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
            elementFolder.add(params, 'near').onChange(function(value) {
                object.near = value;
            });
            elementFolder.add(params, 'far').onChange(function(value) {
                object.far = value;
            });
        }
        if(object.isFogExp2) {
            let params = {
                color: object.color.getHex(),
                density: object.density
            }
            
            elementFolder.addColor(params, 'color').onChange(function(value) {
                object.color.setHex(value);
            });
            elementFolder.add(params, 'density').onChange(function(value) {
                object.density = value;
            });
        }
    }
    if(type == 'color') {
        let params = {
            color: object.getHex()
        };

        elementFolder.addColor(params, 'color').onChange(function(value) {
            object.setHex(value);
        });
    }
    if(type == 'bvh') {
        const helper = new MeshBVHHelper(object);
        helper.color.set(0xE91E63);
        scene.add(helper);

        let params = {
            depth: helper.depth
        };

        elementFolder.add(params, 'depth', 1, 20, 1).onChange(function(value) {
            helper.depth = value;
            helper.update();
        })
    }
    if(type == 'csm') {
        let params = {
            intensity: object.lightIntensity,
            max_far: object.maxFar,
            bias: object.shadowBias,
            cascades: object.cascades,
            light_direction_x: object.lightDirection.x,
            light_direction_y: object.lightDirection.y,
            light_direction_z: object.lightDirection.z,
        }

        elementFolder.add(params, 'intensity').onChange(function(value) {
            object.lightIntensity = value;
        });
        elementFolder.add(params, 'max_far').onChange(function(value) {
            object.maxFar = value;
        })
        elementFolder.add(params, 'bias').onChange(function(value) {
            object.shadowBias = value;
        });
        elementFolder.add(params, 'cascades').onChange(function(value) {
            object.cascades = value;
        });
        elementFolder.add(params, 'light_direction_x', -1, 1).onChange(function(value) {
            object.lightDirection.x = value;
        });
        elementFolder.add(params, 'light_direction_y', -1, 1).onChange(function(value) {
            object.lightDirection.y = value;
        });
        elementFolder.add(params, 'light_direction_z', -1, 1).onChange(function(value) {
            object.lightDirection.z = value;
        });
    }
    if(type == 'custom') {
        customFolder[object.id].parent(elementFolder);
    }
    return elementFolder;
}