# miniCAD
Makes a floating mini CAD to easily edit objects in three.js scenes.<br/>
miniCAD can controls objects of three.js complexe scenes.

powered by georgealways  lil-gui
https://github.com/georgealways/lil-gui/

for three.js
https://threejs.org/
<br/><br/>

<img width="1413" height="721" alt="Screenshot 2025-09-29 105708" src="https://github.com/user-attachments/assets/c0e3f4ff-5b3f-4906-b3e2-349f348cc00b" />



```js
import {MiniCAD} from './miniCAD/miniCAD.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xffffff}));

const miniCAD = new MiniCAD(scene, camera);

miniCAD.add(box, "Box 1");
```
<br/><br/>
CONSTRUCTOR<br/>
**MiniCAD(scene, camera, renderer, controls)**
- scene - three.js scene
- camera - three.js camera
- renderer (optional) - three.js renderer of the scene, need for animation tools, can be add later with a method
- controls (optional) - three.js controls of the scene, need for animation tools, can be add later with a method
<br/><br>

METHODS<br/>
miniCAD.**add(obj, "name");**
<br/><br/>Adds an object to the miniCAD

- obj - the object to add to the miniCAD
- name - name given to the object, this name will be displayed in the miniCAD, if name identical, it will be incremented
<br/><br/>

miniCAD.**controls(controls);**

- controls - three.js controls of the scene
<br/><br/>

miniCAD.**renderer(renderer);**

- renderer - three.js renderer of the scene
<br/>

<br/><br/>
**Options and settings**

Some options can be toggled on and off in the settings.json
- Pointer selector : output the name given to a mesh by miniCAD.add() in the top left corner to easily find a particular mesh.
  A mouse click will select an object. Also works in the pointer lock.
  As for now only works for meshes.
- Up and Down : adds 1 to camera y position with up and down key to quickly reposition the camera.
  up and down keys can be remapped in the **settings.json**, by default they are the up and down arrows
- Tranformation Tools, keys can be remapped

<br><br>
<b>Transformation Tools<br><br>
toolGui is designed to move objects easily using the three.js TransFormControls.<br>
It can be disabled in the settings.<br><br>

To use it the renderer must be pass as an argument in the definition of the miniCAD<br>
It can also be passed using the method .renderer :<br><br>

miniCAD.**renderer(renderer);**<br><br>

In the miniCAD, an object must be selected with the dropdown menu to enable the transformation tools.<br>
Then the transformation tools can be picked up by pressing T (default key) or enabled in the left GUI.<br>
Translate, scale and rotaiton are the three tools available.<br><br>

The "exit" button can helped to relock a pointerLockControls if used.

<br><br>
<b>Animation tools<br><br>
Animation tools are a new and experiemental feature of the miniCAD. It allows you to creates three.js CatmullRomCurve3 paths from a set of points that you
can create.<br>
Renderer and controls are need for those tools. <br><br>

There is three types of paths available :
- BasicPath : is a simple path
- AnimationPath : is a path that objects of the scene can follow around
- CameraTravellingPath : is a set of two paths. One is the path camera follows, the other the trajectory of the point the camera is looking at. This type of path supports only PointerLockControls
<br><br>
Paths can be exported as an array of points. Futur version of the miniCAD will allow user to import paths from an array of points;



