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
import names from './repertory.json' with {type: 'json'};

let guiSave, collection, selectedObject;
let opened = false;

export class SaveGui {
    constructor(objects, current) {
        collection = objects;
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

        confirmation.domElement.childNodes[0].children[0].style.color = "white";

        return guiSave;
    }
}

function closeGui() {
        guiSave.destroy();
        opened = false;
}

function save(params, confirmation) {

    let save = [];
    const names = collection.getNames()

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

    if(params.format == "Js object" && params.include == "All modified objects") {
        console.log(save);
        confirmation.name("Saved as a Js object in the console");
    }
    else if(params.format == "Code" && params.include == "All modified objects") {
        console.log(objToCode(save));
        confirmation.name("Saved as code in the console");
    }
    else if(params.format == "Js object" && params.include == "Current") {
        console.log(selectedObject.name);
        console.log(save[selectedObject.name]);
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
    for(let i = 0; i < save.length; i++) { //faire les save vide ne pas apparaitre
        if(save[i] != null) {
            
            const name = save[i].name;
            const parameters = Object.entries(save[i].parameters);

            for(let i = 0; i < parameters.length; i++) {
                
                const rawName = parameters[i][0];

                if(selectedName == null) {
                    code += name + "." + names[rawName] + " = " + parameters[i][1] + ";\n";
                }
                else if(name == selectedName) {
                    code += name + "." + names[rawName] + " = " + parameters[i][1] + ";\n";
                }
            }
            code += "\n";
        }
    }
    return code;
}