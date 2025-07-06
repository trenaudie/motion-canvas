/* 
This first attempt uses absolute value coordinates, using the view height and width as info 
*/

import { Node, Rect, makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core';
import { all } from '@motion-canvas/core';
import { logMethods } from './utils';

export default makeScene2D(function* (view) {
  const leftNode = createRef<Node>();
  const rightNode = createRef<Node>();
  const leftRect = createRef<Rect>();
  const rightRect = createRef<Rect>();

  // Set the background of the entire view to black
  view.fill('#000000');

  // Log the view dimensions for debugging (useful, but doesn't affect rendering)
  console.log('View dimensions:', view.width(), view.height());
const targetWidth = view.width()/3;
const targetHeight = view.height()/3;
  view.add(
    <>
      {/* Left Node: Acts as a container for the left rectangle */}
      <Node
        ref={leftNode}
        // Position the node to the left of the center.
        // The default view width is 1920, so -480 places it to the left.
        x={-view.width()/4}
        // These width/height define the node's coordinate space,
        // but not the size of its children automatically.

      >
        {/* Left Rectangle: This is the actual visible shape */}
        <Rect
          ref={leftRect}
          // IMPORTANT: Set the width and height for the rectangle to be visible.
          // We're making it fill its parent Node's dimensions.

          stroke={'#FF0000'} // Red border
          lineWidth={5}
          fill={'black'} // Red fill
        />
      </Node>

      {/* Right Node: Acts as a container for the right rectangle */}
      <Node
        ref={rightNode}
        x={view.width()/4}
      >
        {/* Right Rectangle: This is the actual visible shape */}
        <Rect
          ref={rightRect}
          // IMPORTANT: Set the width and height for the rectangle to be visible.
          // We're making it fill its parent Node's dimensions.
        //   stroke={'red'} // Blue border
          lineWidth={5}
          fill={'black'} // Red fill
        />
      </Node>
    </>
  );

  // Keep the scene visible for 1 second
  yield* waitFor(.5 );

  // Animate the fill color of the right rectangle
  // adjust the size of the rectange
  logMethods(view);
  console.log('view.children()', view.children());
  for( let child of recurseNodes(view)) {
    if (child instanceof Rect && child.constructor === Rect) {
        yield* all(...[child.fill('red', 1), child.width(targetWidth,1), child.height(targetHeight,1)]);
    }
  }

  // Animate the fill color of the right rectangle
  // adjust the size of the rectange
//   yield* rightRect().fill('green', 2);
});


function* recurseNodes(node: Node): Generator<Node> {
    // Yield the current node first
    yield node;
  
    // Then, iterate over its children and recursively call recurseNodes
    // node.children() returns a NodeList, which is iterable.
    for (let child of node.children()) {
      // Check if the child is an instance of Node before recursing
      if (child instanceof Node) {
        // Use 'yield*' to delegate to the sub-generator, effectively flattening the results.
        yield* recurseNodes(child);
      }
    }
  }
