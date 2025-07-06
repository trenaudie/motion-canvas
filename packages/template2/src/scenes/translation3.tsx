import {
    Layout, Node, makeScene2D,
    Circle, Latex, Line, Rect, Spline,
  } from '@motion-canvas/2d';
  import {
    createRef, waitUntil, all,
    Vector2, createComputed
  } from '@motion-canvas/core';
  import { logMethods, recurse_parent_with_width_height } from './utils';
  
 export default  makeScene2D(function* (view) {
    const outside_margin = 30;
  
    // Component References
    const rect_view = createRef<Rect>();
    const node_view = createRef<Node>();
    const circle_trans = createRef<Circle>();
    const line_trans = createRef<Line>();
    const latex_matrix = createRef<Latex>();
  
    // Translation Logic

  
    // Scene Setup
    view.add(
      <Rect
        ref={rect_view}
        stroke={'white'}
        lineWidth={5}
        width={view.width() - outside_margin * 2}
        height={view.height() - outside_margin * 2}
      >
        <Node
          ref={node_view}
          x={()=>{return -rect_view().width() / 4}}
          y={0}
        >
          <Circle
            ref={circle_trans}
            fill={'blue'}
            width={100}
            height={100}
            x={() => {
                if (recurse_parent_with_width_height(circle_trans())){
                    return -recurse_parent_with_width_height(circle_trans())!.width() / 7
                }
                return 0
            }}
            y={0}
          />
          <Spline
                    ref={line_trans}
                    endArrow={true}
                lineWidth={6}
                stroke={'lightseagreen'}
                end={0}
                start={0}
            />
        </Node>
        <Latex
          ref={latex_matrix}
          tex={`A = \\begin{bmatrix} 1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9 \\end{bmatrix}`}
          x={() => {return rect_view().width() / 4}}
          y={0}
          width={400}
          height={250}
          fill={'white'}
          opacity={0} // Initialize opacity to 0 for fade-in
        />
      </Rect>
    );


    // Animation Sequence
    const end_pos = circle_trans().position().add(new Vector2(500, -200))
    const duration = 1; // Animation duration
    line_trans().points(createComputed(() => {
        // Assuming end_pos is a createComputed function that returns a Vector2 or null
        const currentEndPos = end_pos;
        if (currentEndPos === null) return []; // Check if the *value* is null

        const start = circle_trans().position();
        const end = currentEndPos; // Use the current value

        // Calculate a control point for the curve.
        // This creates a gentle curve to the right and slightly down/up
        const controlPoint = new Vector2(
          start.x + (end.x - start.x) * 0.7,
          start.y + (end.y - start.y) * 0.6 + 100 // Adjust this value for more or less curve
        );
        return [start , controlPoint, end];
      }))
  
    yield* all(
      latex_matrix().width(400, duration),
      latex_matrix().height(250, duration),
      latex_matrix().opacity(1, duration)
    );
  
    yield* waitUntil('translation ready');
    yield* line_trans().end(1, 2),
    yield* line_trans().start(1, 2),
    yield* all(
      circle_trans().position(end_pos, 1)
    );
  });