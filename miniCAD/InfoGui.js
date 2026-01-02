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

let guiInfo, params, base;
let opened = false;

export class InfoGui {
    constructor(_base) {
        base = _base;
        this.guiInfo = openGui(base);
    }

    animate() {
        update();
    }

    destroy() {
        opened = false;
        this.guiInfo.destroy();
    }
}


function openGui() {
    opened = true;

    guiInfo = new GUI({title: 'info', width: 250});
    guiInfo.domElement.style.left = (window.innerWidth - 250) / 2 + 'px';
    guiInfo.domElement.style.top = '300px';
    guiInfo.domElement.style.opacity = '55%';

    params = {
        close: function() {
            closeGui();
        },
        calls: "",
        frame: "",
        lines: "",
        points: "",
        triangles: ""
    };

    guiInfo.add(params, 'close');
    guiInfo.add(params, 'calls').disable();
    guiInfo.add(params, 'frame').disable();
    guiInfo.add(params, 'lines').disable();
    guiInfo.add(params, 'points').disable();
    guiInfo.add(params, 'triangles').disable();
}

function update() {
    params.calls = base.renderer.info.render.calls;
    params.frame = base.renderer.info.render.frame;
    params.lines = base.renderer.info.render.lines;
    params.points = base.renderer.info.render.points;
    params.triangles = base.renderer.info.render.triangles;

    guiInfo.controllers[1].updateDisplay();
    guiInfo.controllers[2].updateDisplay();
    guiInfo.controllers[3].updateDisplay();
    guiInfo.controllers[4].updateDisplay();
    guiInfo.controllers[5].updateDisplay();
}

function closeGui() {
        guiInfo.destroy();
        opened = false;
}