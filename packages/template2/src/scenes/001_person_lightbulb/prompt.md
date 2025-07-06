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

