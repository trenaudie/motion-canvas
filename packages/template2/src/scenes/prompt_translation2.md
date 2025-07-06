
# 🎯 Objective
Generate a **Motion Canvas 2D animation script** (`.tsx` file) demonstrating a **translation animation** of a **circle**, a **static LaTeX matrix**, and a **line**, adhering to strict developer style guidelines.

# 🧑‍💻 Developer Style Guidelines (CRITICAL)

## 🔢 Dynamic Value Initialization & Dependencies
- Leverage **functions as values** and **`createComputed`** for numeric properties (`x`, `y`, `width`, `height`, `points`) to establish **dynamic, reactive dependencies** between elements. This ensures:
  - **Lazy Evaluation:** Values compute only when needed.
  - **Automatic Updates:** Changes in a parent or linked property automatically re-evaluate dependents.
  - **Dependency Chain Handling:** Explicitly define how positions (e.g., `line_trans`'s `points` based on `circle_trans`'s `position`) and dimensions relate using **references (`createRef`)** and computed properties.

## 🧱 Layout Paradigm (**NO FLEXBOX**)
- ❌ Avoid `Layout` objects.
- ✅ Use **`Rect` as primary, center-anchored containers**.
- 📍 Use **`Node` for precise relative positioning**.
- 📐 Maintain **direct hierarchy** (children directly in parent `Rect` or `Node`).

## 📌 Relative Positioning
- Position all objects (`x`, `y`) **relative to parent dimensions** using `.width()` and `.height()` (e.g., `/ 2` for centering).
- ❌ Avoid hardcoded pixel values.

## 🛠️ External Utilities (`utils.ts`)
- Import and use `recurse_parent_with_width_height(child_node)` to find a parent with dimensions.
  ```ts
  import { logMethods, recurse_parent_with_width_height } from './utils';
  ```
  
🎞️ Animation Sequencing
Place all animation calls at the end of makeScene2D(...).
Use yield* all(...) and yield* component().property(value, duration).
Prefer waitUntil over waitFor for synchronization.
🧱 Overall Visual Structure
Wrap everything in a single Rect serving as the main border:
stroke: 'white', lineWidth: 5
Size: view.width() - outside_margin * 2, view.height() - outside_margin * 2
Use outside_margin = 30.
🔧 Specific Code Requirements
📥 Imports

import { Layout, Node, makeScene2D, Circle, Latex, Line, Rect } from '@motion-canvas/2d';
import { createRef, waitUntil, all, Vector2, createComputed } from '@motion-canvas/core';
import { logMethods, recurse_parent_with_width_height } from './utils';
📌 Component References
Create createRef for rect_view, node_view, circle_trans, line_trans, and latex_matrix.
🔧 Scene Setup (makeScene2D)
Define the scene: makeScene2D(function* (view) { ... });
🧱 Root Border Rect
Add to view, ref: rect_view.
stroke: 'white', lineWidth: 5.
Width/Height: view.width() - outside_margin * 2, view.height() - outside_margin * 2.
📦 Node Container for Translation
Inside rect_view, add a Node:
ref: node_view
x: -rect_view().width() / 4, y: 0
🔵 Translating Circle
Inside node_view, add a Circle:
ref: circle_trans
fill: 'blue', width, height: 100
x: -recurse_parent_with_width_height(circle_trans()).width() / 7
y: 0
🔴 Translation Line
Inside node_view, add a Line:
ref: line_trans
endArrow: true, stroke: 'red', lineWidth: 5
points: createComputed(() => [...]) with start: circle_trans().position() and end: end_pos (Vector2).
📐 Static LaTeX Matrix
Inside rect_view, add Latex:
ref: latex_matrix
tex: A = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}
x: rect_view().width() / 4, y: 0
width: 400, height: 250, fill: 'white'
➕ Translation Logic
circle_pos_local0: initial local Vector2 position of circle_trans.
end_pos: circle_pos_local0.add(new Vector2(500, -200)).
🎬 Animation Sequence (at End)
LaTeX Fade-In: Animate latex_matrix().width, height, and opacity to 1.
Wait for Sync: yield* waitUntil('translation ready');
Animate Line Draw + Circle Move: yield* all(line_trans().end(1, 3), circle_trans().position(end_pos, 1));
📁 Example utils.ts
Copy
import { Node } from "@motion-canvas/2d";
function logMethods(obj: Node, levels = 3) { /* ... */ }
function recurse_parent_with_width_height(node: Node): Node | null { /* ... */ }
export { logMethods, recurse_parent_with_width_height };