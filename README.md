# miniCAD
Makes a floating mini CAD to easily edit objects in three.js scenes.<br/>
miniCAD can controls objects of three.js complexe scenes.

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/
<br/><br/>

![Screenshot miniCAD](https://github.com/user-attachments/assets/6f457069-228d-4f4b-b8f6-b74c5619d8ca)

```js
import {MiniCAD} from 'miniCAD.js';

const scene = new THREE.Scene();
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));

const miniCAD = new MiniCAD(scene);

miniCAD.add(box, 'mesh', "Box 1");
```
<br/><br/>
miniCAD.**add(obj, 'type', "name");**
<br/><br/>Adds an object to the miniCAD

- obj - the object to add to the miniCAD
- type - type of the object : 'mesh', 'light', 'fog', 'color', 'bvh', 'csm'
  (other types will be added in the futur, you can request types you need)

- name - name given to the object, this name will be displayed in the miniCAD, if name identical, it will be incremented 
