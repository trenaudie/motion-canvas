import { Rect, Node, makeScene2D, Circle } from '@motion-canvas/2d';
import { createRef, all, chain, waitFor } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rectRefs = [
    createRef<Rect>(),
    createRef<Rect>(),
    createRef<Rect>(),
    createRef<Rect>(),
  ];

  view.fill('#000000');

  const diamondCenter = new Node();
  view.add(diamondCenter);

  diamondCenter.add(
    <>
      <Rect
        ref={rectRefs[0]}
        x={-100}
        y={0}
        width={100}
        height={100}
        fill="#FF0000" // Red
        opacity={0}
      />
      <Rect
        ref={rectRefs[1]}
        x={0}
        y={-100}
        width={100}
        height={100}
        fill="#00FF00" // Green
        opacity={0}
      />
      <Rect
        ref={rectRefs[2]}
        x={0}
        y={100}
        width={100}
        height={100}
        fill="#0000FF" // Blue
        opacity={0}
      />
      <Rect
        ref={rectRefs[3]}
        x={100}
        y={0}
        width={100}
        height={100}
        fill="#FFFF00" // Yellow
        opacity={0}
      />
    </>
  );

  // Fade in rectangles one by one
  yield* chain(
    rectRefs[0]().opacity(1, 0.5),
    waitFor(0.2),
    rectRefs[1]().opacity(1, 0.5),
    waitFor(0.2),
    rectRefs[2]().opacity(1, 0.5),
    waitFor(0.2),
    rectRefs[3]().opacity(1, 0.5)
  );

  // Wait for a bit before fading out
  yield* waitFor(1);

  // Fade out rectangles one by one
  yield* chain(
    rectRefs[0]().opacity(0, 0.5),
    waitFor(0.2),
    rectRefs[1]().opacity(0, 0.5),
    waitFor(0.2),
    rectRefs[2]().opacity(0, 0.5),
    waitFor(0.2),
    rectRefs[3]().opacity(0, 0.5)
  );
});
