/* 
This second uses Nayout but no flexbox 
- compute the position of the nodes relative to a parent layout container. 
- this probably the most precise way 

- The two following statements are the same

# FOR ABSOLUTE POSITIONS
  console.log('leftNode absolute position', leftNode().absolutePosition());
  console.log('leftNode absolute position 2', Vector2.zero.transformAsPoint(leftNode().localToWorld()));
# FOR LOCAL POSITIONS = (0,0)
  console.log('leftNode position', Vector2.zero);
  console.log('leftnode position 2 ', leftNode().absolutePosition().transformAsPoint(leftNode().worldToLocal()));
# FOR POSITION RELATIVE TO PARENT
  console.log('leftNode position relative to parent', leftNode().position());
  console.log('leftNode position relative to parent 2', leftNode().absolutePosition().transformAsPoint(leftNode().worldToParent()));
*/

import { Layout, Node, Rect, makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core';
import { all } from '@motion-canvas/core';
import { Vector2 } from '@motion-canvas/core';
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
  let layout_width = view.width() * 4 / 6;
  let layout_height = view.height() * 4 / 6;
  let layout_gap = 50;
  let node_width = layout_width / 2;
  let node_height = layout_height / 2;
  view.add(
    <Layout height={layout_height} width={layout_width} direction={'row'}>
      <Node
        ref={leftNode}
        x={-layout_gap / 2 - node_width / 2}
        y={0}

      >
        <Rect
          ref={leftRect}
          stroke={'#FF0000'} // Red border
          lineWidth={5}
          fill={'black'} // Red fill
          width={30}
          height={30}
        />
      </Node>

      <Node
        ref={rightNode}
        x={layout_gap / 2 + node_width / 2}
        y={0}
      >
        <Rect
          ref={rightRect}
          lineWidth={5}
          fill={'black'} // Red fill
          width={30}
          height={30}
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
      yield* all(...[child.fill('red', 1), child.width(node_width, 1), child.height(node_height, 1)]);
    }
  }

  console.log('leftNode absolute position', leftNode().absolutePosition());
  console.log('leftNode absolute position 2', Vector2.zero.transformAsPoint(leftNode().localToWorld()));
  console.log('leftNode position', Vector2.zero);
  console.log('leftnode position 2 ', leftNode().absolutePosition().transformAsPoint(leftNode().worldToLocal()));
  console.log('leftNode position relative to parent', leftNode().position());
  console.log('leftNode position relative to parent 2', leftNode().absolutePosition().transformAsPoint(leftNode().worldToParent()));
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
