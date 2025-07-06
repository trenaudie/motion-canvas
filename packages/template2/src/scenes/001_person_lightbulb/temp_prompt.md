
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

  
## Positioning
**Precise Point Anchors using Nodes**
Invisible Anchors: Use plain Node components (leftNode, rightNode, bottomNode) as invisible spatial anchors.
Parent-Relative Positioning for leftNode and rightNode
leftNode and rightNode are direct children of the topRect.
leftNode is given x={-view.width() / 4}.
rightNode is given x={view.width() / 4}.

**Dynamic Positioning**

The bottomNode's x position is dynamically computed using a lambda function:

```typescript
x={() => {
  const pos_leftNode = leftNode().absolutePosition().transformAsPoint(topRect().worldToLocal())
  console.log(`computed x position for bottomNode: ${pos_leftNode.x}`)
  return pos_leftNode.x
}}
```
Excluding Parent Node in Iteration

When animating the Rect children, use:

if (child instanceof Rect && child != topRect())

This prevents the main container topRect fromeing accidentally animated along with its children.

This format uses Markdown syntax to structure the document with headings, subheadings, code blocks, and bold text for emphasis.

## SVG handling
This example shows how to use SVGs in Motion Canvas. They must be imported as a raw string using "?raw" (see below), then their paths must be filled in before or at animation runtime. The code must therefore iterate through the Path children of the SVG object to fill in the paths with the desired color ("white").

**SVG Raw Import and Component Usage**

Import SVG content as raw strings:

```javascript
import mySVG from '/svg_assets/person-wave-svgrepo-com.svg?raw';
import SVG_bulb from '/svg_assets/light-bulb-line-drawing-svgrepo-com.svg?raw'
```

These raw strings are passed to the <SVG> component:

<SVG svg={mySVG} ... />

**Targeting Specific SVG Paths for filling in color**

Iterate through the children of the SVG's internal wrapper node:

svgRef().children()[0].children()

Check if (child instanceof Path) to ensure only the actual drawing paths within the SVG are targeted for fill and opacity animations.

This allows Motion Canvas to parse and render them efficiently.

## "Reveal" Animation Through Combined Property Changes

The "reveal" animation for SVGs is achieved by combining multiple property animations.

```ts
// Scale the SVG from scale=0 to scale=1 over 0.5 seconds
svg_object.scale(1, 0.5);

// Make the individual paths within the SVG visible
child.opacity(1, 0.5);

// Set the fill color of the SVG paths to white
child.fill('white');
```

Each line represents a separate animation applied to either the full SVG (`svg_object`) or its individual paths (`child`).



## Animations

### Batching animations with `all()`

To run multiple animations concurrently, use `all()` with the `yield *` syntax:

```ts
yield * all(...pathAnimations);
```

This will execute all animations in the `pathAnimations` array simultaneously, creating a unified visual effect.




# EXAMPLE TASK 
INPUT: 
This Motion Canvas scene begins with a black background.

---

### Initial Setup

* **Two main nodes** are set up: `leftNode` and `rightNode`, positioned horizontally symmetrical from the center of the view.
* A **`targetRect`** (a red-stroked rectangle) is associated with the `rightNode`.
* A **`centerLine`** (a white spline with an end arrow) and a **`bulbNode`** (initially positioned above `leftNode`) are also created.
* Two SVG assets, a **person waving** (`personSVG`) and a **light bulb** (`bulbSVG`), are loaded but initially invisible and scaled to zero within their respective nodes.

---

### Animations

The scene's animation unfolds in two main phases:

1.  **SVG Introduction:**
    * After a brief half-second delay, both the person and light bulb SVGs **scale up** to full size and **fade in** simultaneously over 0.5 seconds.
    * Concurrently, all `Path` elements within both SVGs are **filled with white**, making them visible against the black background.

2.  **Target Rectangle Animation:**
    * Following the SVG animations, the `targetRect` (associated with the `rightNode`) animates.
    * It **fills with red**, and its **width and height expand** to one-third of the view's total width and height, respectively. This animation takes 1 second to complete.

In essence, the scene reveals two main icons (a person and a light bulb) and then highlights a red target rectangle on the right side of the screen.

