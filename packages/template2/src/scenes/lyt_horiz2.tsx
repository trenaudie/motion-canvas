/* 
This second uses flexbox 
- align items center for placing the rectangles in the middle of the cross axis (vertical here) 
- layout for actually using flexbox (not placing the rectangles directly on top of each other)
- DO NOT give extra coordinates
*/

import { Layout, Node, Rect, makeScene2D } from '@motion-canvas/2d';
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
  const targetWidth = view.width() / 4;
  const targetHeight = view.height() / 4;
  view.add(
    <Layout height={view.height() * 4 / 6} width={() => {return view.width() * 4 / 6}} gap={50} direction={'row'}  alignItems={'center'}  justifyContent={'center'} layout>
      <Node
        ref={leftNode}
      >
        <Rect
          ref={leftRect}
          stroke={'#FF0000'} // Red border
          lineWidth={5}
          fill={'black'} // Red fill
          width= {30}
          height= {30}
        />
      </Node>

      <Node
        ref={rightNode}
        >
        <Rect
          ref={rightRect}
          lineWidth={5}
          fill={'black'} // Red fill
          width= {30}
          height= {30}
        />
      </Node>
    </Layout>
  );

  // Keep the scene visible for 1 second
  yield* waitFor(.5);

  // Animate the fill color of the right rectangle
  // adjust the size of the rectange
  logMethods(view);
  console.log('view.children()', view.children());
  for (let child of recurseNodes(view)) {
    if (child instanceof Rect && child.constructor === Rect) {
      yield* all(...[child.fill('red', 1), child.width(targetWidth, 1), child.height(targetHeight, 1)]);
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
