import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle } from '@motion-canvas/2d/lib/components';
import { all
 } from '@motion-canvas/core';
import { Color } from '@motion-canvas/core';
import { createRef } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();

  view.add(
    <Circle
      ref={myCircle}
      x={() => 0}
      y={() => 0}
      radius={() => 50}
      fill={() => new Color('#FF0000')}
    />
  );

  yield* all(
    myCircle().radius(100, 1).to(50, 1, easeInOutCubic),
    myCircle().fill(new Color('#0000FF'), 1).to(new Color('#FF0000'), 1, easeInOutCubic),
  );

  yield* all(
    myCircle().radius(20, 1, easeInOutCubic),
    myCircle().fill(new Color('#00FF00'), 1, easeInOutCubic),
  );
});