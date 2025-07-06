
import { makeScene2D, Rect, Node } from '@motion-canvas/2d';
import { createRef, waitFor } from '@motion-canvas/core';
import { all, chain } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const topRight = createRef<Rect>();
  const topLeft = createRef<Rect>();
  const bottomRight = createRef<Rect>();
  const bottomLeft = createRef<Rect>();

  // Set the background color
  view.fill('#000000');

  // Calculate relative positions for diamond shape
  const spacing = view.width() / 8;
  const rectSize = view.height() / 4;

  view.add(
    <>
      {/* Top Right */}
      <Rect
        ref={topRight}
        x={view.width() / 2 - spacing}
        y={-view.height() / 2 + spacing}
        width={rectSize}
        height={rectSize}
        fill="red"
        opacity={0}
      />

      {/* Top Left */}
      <Rect
        ref={topLeft}
        x={-view.width() / 2 + spacing}
        y={-view.height() / 2 + spacing}
        width={rectSize}
        height={rectSize}
        fill="blue"
        opacity={0}
      />

      {/* Bottom Right */}
      <Rect
        ref={bottomRight}
        x={view.width() / 2 - spacing}
        y={view.height() / 2 - spacing}
        width={rectSize}
        height={rectSize}
        fill="yellow"
        opacity={0}
      />

      {/* Bottom Left */}
      <Rect
        ref={bottomLeft}
        x={-view.width() / 2 + spacing}
        y={view.height() / 2 - spacing}
        width={rectSize}
        height={rectSize}
        fill="green"
        opacity={0}
      />
    </>
  );

  // Fade in sequence
  yield* chain(
    topRight().opacity(1, 0.5),
    waitFor(0.2),
    topLeft().opacity(1, 0.5),
    waitFor(0.2),
    bottomRight().opacity(1, 0.5),
    waitFor(0.2),
    bottomLeft().opacity(1, 0.5),
    waitFor(1),
    all(
      topRight().opacity(0, 0.5),
      topLeft().opacity(0, 0.5),
      bottomRight().opacity(0, 0.5),
      bottomLeft().opacity(0, 0.5)
    ),
    waitFor(0.5)
  );

  // Loop the animation (optional)
  yield* waitFor(1);
  yield* chain(...[
    topRight().opacity(1, 0.5),
    waitFor(0.2),
    topLeft().opacity(1, 0.5),
    waitFor(0.2),
    bottomRight().opacity(1, 0.5),
    waitFor(0.2),
    bottomLeft().opacity(1, 0.5),
    waitFor(1),
    all(
      topRight().opacity(0, 0.5),
      topLeft().opacity(0, 0.5),
      bottomRight().opacity(0, 0.5),
      bottomLeft().opacity(0, 0.5)
    ),
    waitFor(0.5)
  ]);
});
