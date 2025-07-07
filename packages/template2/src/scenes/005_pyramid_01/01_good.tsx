import {makeScene2D, Rect, Node} from '@motion-canvas/2d';
import {createRef, createComputed} from '@motion-canvas/core';
import {logMethods, recurse_parent_with_width_height} from '../utils';

export default makeScene2D(function* (view) {
    // Refs
    const bg = createRef<Rect>();
    const container = createRef<Node>();
    const rectCount = 5;
    const rectRefs = Array.from({length: rectCount}, () => createRef<Rect>());

    // Scene dimensions
    const sceneWidth  = createComputed(() => view.width());
    const sceneHeight = createComputed(() => view.height());

    // Computed sizes & positions
    const rectHeight = createComputed(() => sceneHeight() * 0.1);
    const vGap       = createComputed(() => rectHeight() * 0.2);
    const xCenter    = createComputed(() => 0);
    const initialOpacity = createComputed(() => 0);

    const widths = rectRefs.map((_, i) =>
    createComputed(() => sceneWidth() * ((rectCount - i) / rectCount))
    );
    const ys = rectRefs.map((_, i) =>
    createComputed(() =>
        sceneHeight() / 2
        - rectHeight() / 2
        - i * (rectHeight() + vGap())
    )
    );

    // Build scene
    view.add(
    <>
        <Rect
        ref={bg}
        width={sceneWidth}
        height={sceneHeight}
        fill={() => '#000'}
        />
        <Node ref={container}>
        {rectRefs.map((ref, i) => (
            <Rect
            ref={ref}
            width={widths[i]}
            height={rectHeight}
            x={xCenter}
            y={ys[i]}
            fill={() => '#fff'}
            opacity={initialOpacity}
            />
        ))}
        </Node>
    </>
    );


    // Animate fade-in from bottom to top
    for (const rect of rectRefs) {
    yield* rect().opacity(1, 0.5);
    }
});