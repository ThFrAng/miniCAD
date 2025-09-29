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
import Stats from 'three/addons/libs/stats.module.js';
import settings from './settings.json' with {type: 'json'};

const statDiv = document.createElement('div');

export function loadOptions(base, collection) {

    if(settings.USE_POINTERSELECTOR == "true") {
        
        const mouseRay = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const infoDiv = document.createElement('div');
        base.guis[2] = infoDiv;

        document.body.appendChild(infoDiv);
        infoDiv.style.position = 'fixed';
        infoDiv.style.display = "flex";
        infoDiv.style.flexDirection = "row";
        infoDiv.style.paddingTop = '5px';
        infoDiv.style.paddingBottom = '5px';
        infoDiv.style.paddingLeft = '15px';
        infoDiv.style.paddingRight = '15px';

        infoDiv.appendChild(statDiv);
        statDiv.style.position = "relative";

        const objectNameDiv = document.createElement('div');
        infoDiv.appendChild(objectNameDiv);

        objectNameDiv.style.position = 'relative';
        objectNameDiv.style.height = '30px';
        objectNameDiv.style.width = 'auto';
        objectNameDiv.style.color = '#000000';
        objectNameDiv.style.fontWeight = 'bold';
        objectNameDiv.style.paddingTop = '8px';
        objectNameDiv.style.paddingBottom = '9px';
        objectNameDiv.style.paddingLeft = '15px';
        objectNameDiv.style.paddingRight = '15px';
        objectNameDiv.style.backgroundColor = 'white';


        document.addEventListener('click', function(event) {

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.x = - (event.clientY / window.innerHeight) * 2 + 1;

            mouseRay.setFromCamera(pointer, base.camera);

            const names = collection.getNames();
            let selectedName;
            const intersected = {};

            let x = 0;

            for(let i = 0; i < names.length; i++) {
                if(collection.getObject(names[i]).type == 'Mesh') {
                    const intersect = mouseRay.intersectObject(collection.getObject(names[i]).mesh, true);
                    if(intersect.length > 0) {
                        intersected[x] = [i, intersect[0].distance];  
                        x++;
                    }
                }
            }

            function findMinDistanceName() {
                let minDistance = 10000;
                let minDistanceId;

                for(let j = 0; j < x; j++) {
                    if(intersected[j][1] < minDistance) {
                        minDistance = intersected[j][1];
                        minDistanceId = intersected[j][0];
                    }
                }
                return minDistanceId
            }
            selectedName = names[findMinDistanceName()];

            objectNameDiv.innerHTML = selectedName

        });
    }

    if(settings.USE_UPDOWNKEYS) {
        document.addEventListener('keydown', function(event) {
            switch (event.code) {
                case settings.UP_KEY:
                    base.camera.position.y += 1;
                    break;
                case settings.DOWN_KEY:
                    base.camera.position.y -= 1;
                    break;
            }
        })
    }

    loadStats();
}

let stats;
function loadStats() {
    if(settings.USE_STATS) {
        stats = new Stats();
        statDiv.appendChild(stats.dom);
        stats.dom.style.position = "relative";
    }
}
export {stats};
