/* 
Trying to build a translation animation but using nodes instead of layout.
*/

import { Layout, Node, makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';
import { waitUntil } from '@motion-canvas/core';
import { all } from '@motion-canvas/core';
import { Vector2 } from '@motion-canvas/core';
import { logMethods, recurse_parent_with_width_height } from './utils';
import { Circle, Latex, Line, Rect } from '@motion-canvas/2d/lib/components';
import { createComputed } from '@motion-canvas/core';


export default makeScene2D(function* (view) {

    const latex_matrix = createRef<Latex>();
    const rect_view = createRef<Rect>();
    const circle_trans = createRef<Circle>();
    const node_view = createRef<Node>();

    const latex_tex = "A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}"
    const outside_margin = 30
    // lets compute the end point using a translation 
    const circle_pos_local0 = new Vector2(0, 0).add(Vector2.left.scale(200)).add(Vector2.down.scale(0));
    // end_pos: target point for the first circle (and starting for the second)
    const end_pos = circle_pos_local0.add(new Vector2(500, -200));

    const line_trans = createRef<Line>();
    const line_points = createComputed(() => [
        circle_trans().position(),
        end_pos
    ])


    const end_pos_circle = createRef<Circle>();
    view.add(
            <Rect ref={rect_view} stroke={'white'} lineWidth={5} width={view.width() - outside_margin * 2} height={view.height() - outside_margin * 2}  >
                <Node ref={node_view} x={() => { return -rect_view().width() / 4 }} y={0} >
                    <Circle ref={circle_trans} fill={'blue'} width={100} height={100} y={0} />
                    <Line ref={line_trans} endArrow={true} stroke={'red'} lineWidth={5} start={0} end={0} />
                </Node>
                <Latex ref={latex_matrix} tex={latex_tex} x={() => { return rect_view().width() / 4 }} y={0} height={250} width={400} fill="white" />
            </Rect>
    )
    if (recurse_parent_with_width_height(circle_trans())){
        circle_trans().x(() => { return -recurse_parent_with_width_height(circle_trans()).width() / 7 })
    }
    line_trans().points(line_points);
    yield* all(
        latex_matrix().width(0, 1),
        latex_matrix().height(0, 1),
        latex_matrix().opacity(0, 1)
    );

    yield* waitUntil('translation ready');
    yield* line_trans().end(1, 1.5);
    yield* all(circle_trans().position(end_pos, 1));
});


