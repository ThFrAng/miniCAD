/*
        ThFrAng
        2025

https://github.com/ThFrAng/miniCAD/

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/

*/

import {Mesh} from './objects/Mesh.js';
import {SpotLight} from './objects/SpotLight.js';
import {DirectionalLight} from './objects/DirectionalLight.js';
import {RectAreaLight} from './objects/RectLightArea.js';
import {AmbientLight} from './objects/AmbientLight.js';
import {HemisphereLight} from './objects/HemisphereLight.js';
import {PointLight} from './objects/PointLight.js';
import {Fog} from './objects/Fog.js';
import {FogExp2} from './objects/FogExp2.js';
import {UnrealBloomPass} from './objects/UnrealBloomPass.js';
import {MeshPhysicalMaterial} from './objects/MeshPhysicalMaterial.js';
import {MeshPhongMaterial} from './objects/MeshPhongMaterial.js'
import {Group} from './objects/Group.js';
import {PointerLockControls} from './objects/PointerLockControls.js';
import {OrbitControls} from './objects/OrbitControls.js';
import {OrthographicCamera} from './objects/OrthographicCamera.js';
import {PerspectiveCamera} from './objects/PerspectiveCamera.js';


export class DataGui {
    constructor(base, gui, object) {
        switch(object.type) {
            case 'Mesh': return new Mesh(base, gui, object);
            case 'SpotLight': return new SpotLight(base, gui, object);
            case 'DirectionalLight': return new DirectionalLight(base, gui, object);
            case 'RectLightArea': return new RectAreaLight(base, gui, object);
            case 'AmbientLight': return new AmbientLight(base, gui, object);
            case 'HemisphereLight': return new HemisphereLight(base, gui, object);
            case 'PointLight': return new PointLight(base, gui, object);
            case 'Fog': return new Fog(base, gui, object);
            case 'FogExp2': return new FogExp2(base, gui, object);
            case 'UnrealBloomPass': return new UnrealBloomPass(base, gui, object);
            case 'MeshPhysicalMaterial': return new MeshPhysicalMaterial(base, gui, object);
            case 'MeshPhongMaterial': return new MeshPhongMaterial(base, gui, object);
            case 'Group': return new Group(base, gui, object);
            case 'PointerLockControls': return new PointerLockControls(base, gui, object);
            case 'OrbitControls': return new OrbitControls(base, gui, object);
            case 'OrthographicCamera': return new OrthographicCamera(base, gui, object);
            case 'PerspectiveCamera': return new PerspectiveCamera(base, gui, object);
        }
    }
}