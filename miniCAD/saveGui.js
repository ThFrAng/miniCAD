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
import names from './repertory.json' with {type: 'json'};

let guiSave, collection, selectedObject;
let opened = false;

export class SaveGui {
    constructor(_collection, current) {
        collection = _collection;
        selectedObject = current;
        
        this.guiSave = openGui();
    }

    destroy() {
        opened = false;
        this.guiSave.destroy();
    }
}


function openGui() {
    if(opened == false) {
        let confirmation;
        
        guiSave = new GUI({title: 'save', width: 250});
        guiSave.domElement.style.left = (window.innerWidth - 250) / 2 + 'px';
        guiSave.domElement.style.top = '300px';

        guiSave.open();
        opened = true;

        const params = {
                close: function() {
                        closeGui();
                },
                format: 'Choose format',
                include: '',
                save: function() {
                        save(params, confirmation);
                },
                confirmation: function() {}
        }

        guiSave.add(params, 'close');
        guiSave.add(params, 'format', ["Js object", "Code"]);
        guiSave.add(params, 'include', ["Current", "All modified objects"]);
        guiSave.add(params, 'save');
        confirmation = guiSave.add(params, 'confirmation').name("");
        confirmation.disable();

        return guiSave;
    }
}

function closeGui() {
        guiSave.destroy();
        opened = false;
}

function save(params, confirmation) {

    let save = [[],[]];
    const names = collection.getNames();

    for(let i = 0; i < names.length; i++) {

        const selectedObject = collection.getObject(names[i]);

        const object = {
                name: names[i],
                parameters: selectedObject.save,
        }
        if(Object.keys(object.parameters).length > 0) {
                save[0].push(object);
                save[1].push(selectedObject.gui);
        }
    }


    if(params.format == "Js object" && params.include == "All modified objects") {
        console.log(save[0]);
        confirmation.name("Saved as a Js object in the console");
    }
    else if(params.format == "Code" && params.include == "All modified objects") {
        console.log(objToCode(save));
        confirmation.name("Saved as code in the console");
    }
    else if(params.format == "Js object" && params.include == "Current") {
        console.log(selectedObject.name);
        for(let i = 0; i < save[0].length; i++) {
            if(save[0][i].name == selectedObject.name) {
                console.log(save[0][i]);
            }
        }
        confirmation.name("Saved as a Js object in the console");
    }
    else if(params.format == "Code" && params.include == "Current") {

        console.log(objToCode(save, selectedObject.name));
        confirmation.name("Saved as code in the console");
    }
    else {return 0;}

        
}


function objToCode(save, selectedName) {
    let code = "";
    for(let i = 0; i < save[1].length; i++) {
        if(save[0][i] != null) {

            const name = save[0][i].name;
            const parameters = Object.entries(save[0][i].parameters);
            const parametersCode = save[1][i].save;

            if(selectedName == null) {
                code += parametersCode(name, parameters);
            }
            else if(name == selectedName) {
                code += parametersCode(name, parameters);
            }

            code += "\n";
        }
    }
    return code;
}