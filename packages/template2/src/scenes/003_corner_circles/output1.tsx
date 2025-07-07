import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
      import { Rect } from '@motion-canvas/2d/lib/components';
      import { all, createRef } from '@motion-canvas/core';

      export default makeScene2D(function* (view) {
        const squareTopLeft = createRef<Rect>();
        const squareTopRight = createRef<Rect>();
        const squareBottomLeft = createRef<Rect>();
        const squareBottomRight = createRef<Rect>();

        view.add(
            <>
            <Rect
            ref={squareTopLeft}
            x={() => -view.width() / 2 + 20}
            y={() => -view.height() / 2 + 20}
            width={() => 40}
            height={() => 40}
            fill={() => 'red'}
          />
          <Rect
            ref={squareTopRight}
            x={() => view.width() / 2 - 20}
            y={() => -view.height() / 2 + 20}
            width={() => 40}
            height={() => 40}
            fill={() => 'red'}
          />
          <Rect
            ref={squareBottomLeft}
            x={() => -view.width() / 2 + 20}
            y={() => view.height() / 2 - 20}
            width={() => 40}
            height={() => 40}
            fill={() => 'red'}
          />
          <Rect
            ref={squareBottomRight}
            x={() => view.width() / 2 - 20}
            y={() => view.height() / 2 - 20}
            width={() => 40}
            height={() => 40}
            fill={() => 'red'}
          />
            </>
          
        );

        // All squares move to the center and shrink to zero size
        yield* all(
          squareTopLeft().x(0, 2),
          squareTopLeft().y(0, 2),
          squareTopLeft().width(0, 2),
          squareTopLeft().height(0, 2),
          squareTopRight().x(0, 2),
          squareTopRight().y(0, 2),
          squareTopRight().width(0, 2),
          squareTopRight().height(0, 2),
          squareBottomLeft().x(0, 2),
          squareBottomLeft().y(0, 2),
          squareBottomLeft().width(0, 2),
          squareBottomLeft().height(0, 2),
          squareBottomRight().x(0, 2),
          squareBottomRight().y(0, 2),
          squareBottomRight().width(0, 2),
          squareBottomRight().height(0, 2),
        );
      });