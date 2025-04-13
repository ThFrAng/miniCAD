import * as THREE from 'three';

import settings from './settings.json' with { type: 'json' };
//const USE_POINTERSELECTOR = true;

export function loadOptions(camera, collection) {
    
    if(settings.USE_POINTERSELECTOR) {
        
        const mouseRay = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const objectNameDiv = document.createElement('div');
        document.body.appendChild(objectNameDiv);

        objectNameDiv.style.position = 'fixed';
        objectNameDiv.style.height = '30px';
        objectNameDiv.style.width = 'auto';
        objectNameDiv.style.color = '#000000';
        objectNameDiv.style.fontWeight = 'bold';
        objectNameDiv.style.paddingTop = '5px';
        objectNameDiv.style.paddingBottom = '5px';
        objectNameDiv.style.paddingLeft = '15px';
        objectNameDiv.style.paddingRight = '15px';
        objectNameDiv.style.backgroundColor = 'white';


        document.addEventListener('click', function(event) {

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.x = - (event.clientY / window.innerHeight) * 2 + 1;

            mouseRay.setFromCamera(pointer, camera);

            const names = collection.getNames();
            let selectedName;
            const intersected = {};

            let x = 0;

            for(let i = 0; i < names.length; i++) {
                const intersect = mouseRay.intersectObject(collection.getObject(names[i]).mesh);
                if(intersect.length > 0) {
                    intersected[x] = [i, intersect[0].distance];  
                    x++;
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
}
