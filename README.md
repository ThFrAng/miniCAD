# miniCAD
Makes a floating mini CAD to easily edit objects in three.js scenes.<br/>
miniCAD can controls objects of three.js complexe scenes.

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/
<br/><br/>
```js
import {MiniCAD} from 'miniCAD.js';

const scene = new THREE.Scene();

const miniCAD = new MiniCAD(scene);

const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));

miniCAD.add(box, 'mesh', "Box 1");
```
<br/><br/>
miniCAD.**add(obj, 'type', "name");**
<br/><br/>Adds an object to the miniCAD

- obj - the object to add to the miniCAD
- type - type of the object : 'mesh', 'light', 'fog', 'color', 'bvh'
  (other types will be added in the futur, you can request types you need)

- name - name given to the object, this name will be displayed in the miniCAD, if name identical, it will be incremented 
