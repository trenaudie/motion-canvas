/* 
Translation animation, using layout (or rect) style positioning
*/

import { Layout, Node, makeScene2D } from '@motion-canvas/2d';
import { createRef } from '@motion-canvas/core';
import { waitFor } from '@motion-canvas/core';
import { all } from '@motion-canvas/core';
import { Vector2 } from '@motion-canvas/core';
import { logMethods } from './utils';
import { Circle, Latex, Line, Rect } from '@motion-canvas/2d/lib/components';

export default makeScene2D(function* (view) {

    const latex_matrix = createRef<Latex>();
    const rect_view = createRef<Rect>();
    const circle_trans = createRef<Circle>();
    const rect_left = createRef<Rect>();
    const circle_pos_local0 = new Vector2(0, 0).add(Vector2.left.scale(150)).add(Vector2.up.scale(150));

    console.log('circle_pos_local0', circle_pos_local0);
    const latex_tex = "A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}"
    const outside_margin = 30
    view.add(
        <Layout height={view.height()} width={view.width()}>
            <Rect ref={rect_view} stroke={'white'} lineWidth={5} width={view.width() - outside_margin * 2} height={view.height() - outside_margin * 2}  >
                    <Rect ref={rect_left} width={500} height={500} position = {() => {return Vector2.zero.add(Vector2.left.scale(rect_view().width()/5))}}>
                        <Circle ref={circle_trans} fill={'blue'} width={100} height={100} position={circle_pos_local0} />
                    </Rect>
                    <Latex ref={latex_matrix} tex={latex_tex} height={250} width={400} fill="white" position = {() => {return Vector2.zero.add(Vector2.right.scale(rect_view().width()/5))}}/>
            </Rect>
        </Layout>

    )
    yield* waitFor(1);
    console.log('circle position final', circle_trans().position());
    yield* all(latex_matrix().width(100, 1), latex_matrix().height(100, 1))
});

