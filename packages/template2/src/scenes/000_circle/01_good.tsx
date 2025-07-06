import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { Circle } from '@motion-canvas/2d/lib/components';
import { all, createRef } from '@motion-canvas/core';
import { Color } from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();

  view.add(
    <Circle
      ref={myCircle}
      x={() => 0}
      y={() => 0}
      width={() => 100}   // width = diameter (2 * radius)
      height={() => 100}  // height = diameter (2 * radius)
      fill={() => new Color('#FF0000')}
    />
  );

  yield* all(
    myCircle().width(200, 1).to(100, 1),   // animate width from 100 to 200 then back to 100
    myCircle().height(200, 1).to(100, 1),  // animate height from 100 to 200 then back to 100
    myCircle().fill(new Color('#0000FF'), 1).to(new Color('#FF0000'), 1),
  );

  yield* all(
    myCircle().width(40, 1),   // animate width to 40
    myCircle().height(40, 1),  // animate height to 40
    myCircle().fill(new Color('#00FF00'), 1),
  );
});
