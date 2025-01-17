/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui

for three.js
https://threejs.org/

*/

import * as THREE from 'three';
import {GUI} from './jsm/libs/lil-gui.module.min.js';

import {RectAreaLightHelper} from 'three/addons/helpers/RectAreaLightHelper.js';
import {MeshBVHHelper} from 'https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.7.3/build/index.module.js';

let objects = [];
let names = [];


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
    constructor(scene) {
        const gui = new GUI({title: 'miniCAD'});

        const initFolder = gui.addFolder('init');
        const initParams = {
            open: function () {
                load(gui, scene);
                initFolder.destroy();
            }
        }
        initFolder.add(initParams, 'open');

        gui.open();
    }

    add(mesh, type, name) {
        collection.add(mesh, type, name);
    }
}

function load(gui, scene) {
    const headerFolder = gui.addFolder('header');
    var elementFolder;
    var selectedObject = 0;


    const headerParams = {
        save: function() {
            collection.saveObject(selectedObject, gui);
            save();
        },
        object: 'Select object',
        locate: function () {
            if(selectedObject != 0) {
                locateObject(selectedObject, locateButton);
            }
        }
    }

    headerFolder.add(headerParams, 'save');
    headerFolder.add(headerParams, 'object', collection.getNames()).name('object').onChange(function(value) {
        
        if(selectedObject != 0) {
            collection.saveObject(selectedObject, gui);
        }

        selectedObject = collection.getObject(value);
        var oldFolder = elementFolder;

        elementFolder = toolGui(gui, selectedObject.mesh, selectedObject.type, scene);
        oldFolder.destroy();
    });
    const locateButton = headerFolder.add(headerParams, 'locate').name('locate');
}



function toolGui(gui, object, type, scene) {
    const elementFolder = gui.addFolder('properties');
    if (type == 'mesh') {
        const params = {
            position_x: object.position.x,
            position_y: object.position.y,
            position_z: object.position.z,
            scale_x: object.scale.x,
            scale_y: object.scale.y,
            scale_z: object.scale.z,
            rotation_x: object.rotation.x,
            rotation_y: object.rotation.y,
            rotation_z: object.rotation.z
        };

        elementFolder.add(params, 'position_x').onChange(function(value) {
            object.position.x = value;
        });
        elementFolder.add(params, 'position_y').onChange(function(value) {
            object.position.y = value;
        });
        elementFolder.add(params, 'position_z').onChange(function(value) {
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
            lightElements = directionalGui();

            function spotGui(lightFolder) {
                let params = {
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

                lightFolder.add(params, 'position_x').onChange(function(value) {
                    object.position.x = value;
                    helper.update();
                });
                lightFolder.add(params, 'position_y').onChange(function(value) {
                    object.position.y = value;
                    helper.update();
                });
                lightFolder.add(params, 'position_z').onChange(function(value) {
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
            }
        }
        else if(object.isRectAreaLight) {
            const helper = new RectAreaLightHelper(object);
            scene.add(helper);
            helper.visible = false;
            
            let target = new THREE.Vector3(0, 0, 0);
            object.lookAt(target);
            let params = {
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
                    position_x: object.position.x,
                    position_y: object.position.y,
                    position_z: object.position.z,
                    intensity: object.intensity,
                    color: object.color.getHex(),
                    target_x: object.target.position.x,
                    target_y: object.target.position.y,
                    target_z: object.target.position.z
                };

                lightFolder.add(params, 'position_x').onChange(function(value) {
                    object.position.x = value;
                    helper.update();
                });
                lightFolder.add(params, 'position_y').onChange(function(value) {
                    object.position.y = value;
                    helper.update();
                });
                lightFolder.add(params, 'position_z').onChange(function(value) {
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
                blur_samples: object.shadow.blurSamples
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
    return elementFolder;
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


export function pos(camera) {
    let position = "x: " + camera.position.x + "  y: " + camera.position.y + "  z: " + camera.position.z;
    console.log(position);
}




function heading(camera) {
    var vector = new THREE.Vector3();
    camera.getWorldDirection(vector);
    let heading = "x: " + vector.x + "  y: " + vector.y + "  z: " + vector.z;
    console.log(heading);

    var angle = Math.atan(Math.abs(vector.z) / Math.abs(vector.x));
    //console.log(angle);

}