# miniCAD
Makes a floating mini CAD to easily edit objects in three.js scenes.<br/>
miniCAD can controls objects of three.js complexe scenes.

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/
<br/><br/>

![Screenshot miniCAD](https://github.com/user-attachments/assets/6f457069-228d-4f4b-b8f6-b74c5619d8ca)

<b>NEW</b><br>
toolGui is design to move objects easily using the three.js TransFormControls.<br>
It can be disabled in the settings.<br><br>

To use it the renderer must be pass as an argument in the definition of the miniCAD<br>
It can also be passed using the method .renderer :<br><br>

miniCAD.**renderer(renderer);**<br><br>

In the miniCAD, an object must be selected with the dropdown menu to enable the transformation tools.<br>
Then the transformation tools can be picked up by pressing T (default key) or enabled in the left GUI.<br>
Translate, scale and rotaiton are the three tools available.<br><br>

WARNING<br> it is still a beta functionnality


```js
import {MiniCAD} from './miniCAD/miniCAD.js';

const scene = new THREE.Scene();
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));

const miniCAD = new MiniCAD(scene);

miniCAD.add(box, 'mesh', "Box 1");
```
<br/><br/>
miniCAD.**add(obj, 'type', "name");**
<br/><br/>Adds an object to the miniCAD

- obj - the object to add to the miniCAD
- type - type of the object : 'mesh', 'material', 'phongMaterial', 'light', 'fog', 'color', 'bvh', 'csm'
  (other types will be added in the futur, requests can be made to support new types)

- name - name given to the object, this name will be displayed in the miniCAD, if name identical, it will be incremented

<br/><br/>
**Controls**

Once miniCAD is open, position of camera can be changed.<br/>
Arrow up and down can move the camera up and down by one any time
Can be disabled in the settings. Up and down keys can be remapped.

<br/><br/>
**Types**

- **'mesh' :** basic controls for meshes
  
- **'material' :** basic controls for all materials, for exemple MeshStandardMaterial
  
- **'phongMaterial' :** adjust MeshPhongMaterial settings
  
- **'light' :** settings for any king of light. It can also adjusts the settings of the shadow for lights that can cast shadows. Supports spotLight, rectAreaLight directionalLight, ambientLight, hemisphereLight

- **'fog' :** basic controls for fog or fogExp2

- **'color' :** adjust color of an element. must provide the color as obj
```js
    miniCAD.add(material.color, 'color', "Color of the material");
```

- **'bvh' :** basic controls for bvh **work in progress**

- **'csm' :** basic controls for csm **work in progress**

<br/><br/>
**Options and settings**

Some options can be toggled on and off in the settings.json
- Pointer selector : output the name given to a mesh by miniCAD.add() in the top left corner to easily find a particular mesh.
  A mouse click will select an object. Also works in the pointer lock.
  As for now only works with type 'mesh' objects.
- Up and Down : adds 1 to camera y position with up and down key to quickly reposition the camera.
  up and down keys can be remapped in the settings
