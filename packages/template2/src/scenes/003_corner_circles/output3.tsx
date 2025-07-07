import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Rect } from '@motion-canvas/2d/lib/components';
import { all, createRef, createComputed, waitFor, waitUntil } from '@motion-canvas/core';
import { Color } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const squareTopLeft = createRef<Rect>();
  const squareTopRight = createRef<Rect>();
  const squareBottomLeft = createRef<Rect>();
  const squareBottomRight = createRef<Rect>();

  const squareSize = 50;

  view.add(
    <>
      <Rect
        ref={squareTopLeft}
        x={() => -view.width() / 2 + squareSize / 2}
        y={() => -view.height() / 2 + squareSize / 2}
        width={() => squareSize}
        height={() => squareSize}
        fill={() => new Color('#FF0000')}
      />
      <Rect
        ref={squareTopRight}
        x={() => view.width() / 2 - squareSize / 2}
        y={() => -view.height() / 2 + squareSize / 2}
        width={() => squareSize}
        height={() => squareSize}
        fill={() => new Color('#FF0000')}
      />
      <Rect
        ref={squareBottomLeft}
        x={() => -view.width() / 2 + squareSize / 2}
        y={() => view.height() / 2 - squareSize / 2}
        width={() => squareSize}
        height={() => squareSize}
        fill={() => new Color('#FF0000')}
      />
      <Rect
        ref={squareBottomRight}
        x={() => view.width() / 2 - squareSize / 2}
        y={() => view.height() / 2 - squareSize / 2}
        width={() => squareSize}
        height={() => squareSize}
        fill={() => new Color('#FF0000')}
      />
    </>
  );

  yield* waitUntil('move to center');
  yield* all(
    squareTopLeft().position(() => [0, 0], 1),
    squareTopRight().position(() => [0, 0], 1),
    squareBottomLeft().position(() => [0, 0], 1),
    squareBottomRight().position(() => [0, 0], 1),
  );

  yield* waitUntil('shrink to zero');
  yield* all(
    squareTopLeft().width(0, 1),
    squareTopLeft().height(0, 1),
    squareTopRight().width(0, 1),
    squareTopRight().height(0, 1),
    squareBottomLeft().width(0, 1),
    squareBottomLeft().height(0, 1),
    squareBottomRight().width(0, 1),
    squareBottomRight().height(0, 1),
  );
});