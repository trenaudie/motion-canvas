/* 
This third is very similar to the first, but will create a central node as anchor
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
    const centralnode = createRef<Node>();

    // Set the background of the entire view to black
    view.fill('#000000');

    // Log the view dimensions for debugging (useful, but doesn't affect rendering)
    console.log('View dimensions:', view.width(), view.height());
    const centralnode_position = Vector2.zero;
    const rect_size = 700
    const gap = 100
    view.add(
        <Node ref={centralnode} position={centralnode_position}>
            <Node
                ref={leftNode}
                position = {() => {
                     return new Vector2(-rect_size/2 - gap/2 , 0);
                }}
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
                position = {() => {
                    return new Vector2(rect_size/2 + gap/2, 0);
               }}
            >
                <Rect
                    ref={rightRect}
                    lineWidth={5}
                    fill={'black'} // Red fill
                    width={30}
                    height={30}
                />
            </Node>
        </Node>
    );

    // Keep the scene visible for 1 second
    yield* waitFor(.5);

    // Animate the fill color of the right rectangle
    // adjust the size of the rectange
    logMethods(view);
    console.log('view.children()', view.children());
    for (let child of recurseNodes(view)) {
        if (child instanceof Rect && child.constructor === Rect) {
            yield* all(...[child.fill('red', 1), child.width(rect_size, 1), child.height(rect_size, 1)]);
        }
    }

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
