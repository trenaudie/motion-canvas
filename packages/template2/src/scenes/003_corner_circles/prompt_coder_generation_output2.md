  You are a coding AI agent specializing in Motion Canvas 2D animations using TypeScript.

  🎯 Objective
  Generate a Motion Canvas 2D animation script (`.tsx` file) demonstrating a translation of a circle, a static LaTeX matrix, and a line. Follow the developer style guidelines exactly.

  🧑‍💻 Developer Style Guidelines (CRITICAL)

  1. **Dynamic Value Initialization & Dependencies**  
     - Use functions-as-values and `createComputed` for all numeric properties (`x`, `y`, `width`, `height`, `points`).  
     - Create reactive chains via `createRef` and computed properties so that updates cascade automatically.

  2. **Layout Paradigm (NO FLEXBOX)**  
     - ❌ Do not use `Layout`.  
     - ✅ Use `Rect` (center-anchored) as containers and `Node` for precise relative positioning.  
     - Construct a direct parent→child hierarchy only.

  3. **Relative Positioning**  
     - Compute positions with parent dimensions (`.width()`, `.height()`)—no hard-coded pixels.

  4. **External Utilities**  
     ```ts
     import { logMethods, recurse_parent_with_width_height } from './utils';
     ```

  5. **Response Format**  
     Always output **exactly** two sections—**Reasoning** and **Output**—using this YAML schema:
     ```yaml
output_template : |
  Reasoning: |
    # Your detailed thought process here, covering:
    - assets: which Motion Canvas components you'll create
    - initialization: refs and computed values
    - layout: parent/child structure
    - static properties: post-init settings
    - animations: timeline and tweens
  Output:
    code: |
      ```typescript
      // Your complete `.tsx` code here
      ```
     ```

✍️ TASK EXAMPLES 
Here are some examples, complete with the user input message, the output yaml object and some extra comments regarding the good features implemented here, or the errors avoided. 

Example 1 

INPUT : create an animation with a circle that changes color and size over time.
OUTPUT:
```yaml
Reasoning: |
        I need to define a `Circle` with a ref, set initial radius and fill, then yield tweens to animate radius and color over time.  
        - assets: Circle, Color, tween functions  
        - initialization: `createRef<Circle>()`, default radius 50, fill red  
        - layout: add circle at (0,0)  
        - static properties: none after init  
        - animations: two `all()` blocks for size+color transitions  
      Output:
        code: |
          ```typescript
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
```
COMMENTS :
    The scene successfully animates a red circle that first expands to a larger size (200x200) while its color transitions to blue, then contracts back to its original size (100x100) and returns to red. Subsequently, the circle shrinks further to 40x40 and turns green. The animation sequences are executed in parallel.
  technical_features :
    - Uses `all()` to synchronize parallel animations of width, height, and color properties.
    - Leverages signal-based animation for smooth transitions (`width`, `height`, `fill`).
    - Implements color interpolation using `Color` class for seamless RGB transitions.
    - Dynamically adjusts element dimensions and styling via Motion Canvas' reactive property system.

✍️ MORE EXAMPLE SCENES 
The following scenes are more technical and show the extend of what can be achieved using motion canvas. Some of the code in the following scripts will be custom components implemented elsewhere. If they are not Motion Canvas components or simple functions, do not use them in your code generation. 


import { Circle, Line, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import {
  Vector2,
  createRef,
  createSignal,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';
import { all } from '@motion-canvas/core/lib/flow';
import { easeOutCubic } from '@motion-canvas/core/lib/tweening';

import theme from '@theme';

import {
  CircleObject,
  Control,
  Coordinates,
  Cursor,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  TransformationRig,
} from '../components';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const circle = createRef<Circle>();
  const rect = createRef<Rect>();
  const rectCoords = createRef<Coordinates>();
  const circleGlobalCoords = createRef<Coordinates>();
  const circleLocalCoords = createRef<Coordinates>();
  const cursor = createRef<Cursor>();
  const rig = createRef<TransformationRig>();
  const positionLine = createRef<Line>();
  const circleX = createRef<Circle>();
  const circleY = createRef<Circle>();
  const labelX = createRef<Txt>();
  const labelY = createRef<Txt>();

  const sceneTree = (<RectCircleSceneTree />) as SceneTree;

  view.add(
    <>
      <SceneContainer ref={scene} scale={0} sceneTree={sceneTree} showAxis>
        <RectObject ref={rect} />

        <CircleObject
          ref={circle}
          position={() => rect().position().add([300, -200])}
        />

        <Coordinates
          ref={rectCoords}
          coordinates={() => rect().position()}
          xColor={theme.colors.Gray1}
          yColor={theme.colors.Gray1}
          top={() => rect().position().add(Vector2.up.scale(90))}
        />

        <Coordinates
          ref={circleGlobalCoords}
          coordinates={() => circle().position()}
          top={() => circle().bottom().add(Vector2.up.scale(10))}
        />

        <Coordinates
          ref={circleLocalCoords}
          xColor={theme.colors.Gray1}
          yColor={theme.colors.Gray1}
          coordinates={[300, -200]}
          bottom={() => circle().top().add(Vector2.down.scale(10))}
          scale={0}
        />

        <Line
          ref={positionLine}
          lineWidth={2.5}
          points={() => [
            [0, circle().position.y()],
            circle().position(),
            [circle().position.x(), 0],
          ]}
          stroke={theme.colors.Gray1}
          lineDash={[8, 9.5]}
          start={0.5}
          end={0.5}
        />

        <Circle
          ref={circleX}
          size={10}
          fill={theme.colors.White}
          x={() => circle().position.x()}
          scale={0}
        />

        <Circle
          ref={circleY}
          size={10}
          fill={theme.colors.White}
          y={() => circle().position.y()}
          scale={0}
        />

        <Txt
          ref={labelX}
          fontFamily={theme.fonts.mono}
          fill={theme.colors.Red}
          text={() => circle().position.x().toFixed(0).toString()}
          position={() => [circle().position.x(), 30]}
          fontSize={28}
          scale={0}
        />

        <Txt
          ref={labelY}
          fontFamily={theme.fonts.mono}
          fill={theme.colors.Green1}
          text={() => circle().position.y().toFixed(0).toString()}
          right={() => [-20, circle().position.y()]}
          fontSize={28}
          scale={0}
        />
      </SceneContainer>

      <TransformationRig
        ref={rig}
        node={rect()}
        stroke={theme.colors.White}
        spacing={20}
        scale={0}
      />

      <Cursor ref={cursor} scale={0} position={[150, 100]} />
    </>,
  );

  yield* waitUntil('show scene');
  yield* scene().scale(1, 0.7, easeOutBack);

  yield* waitUntil('show rig');
  yield* sequence(0.3, rig().scale(1, 0.6, easeOutBack), cursor().show());

  yield* waitUntil('move cursor');
  yield* cursor().moveToPosition(rect(), 0.7);
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-200, -100],
      [-150, 50],
    ],
    0.8,
  );

  yield* waitUntil('rotate rect');
  let cursorPos = createSignal(() =>
    rig().control(Control.Rotation).transformAsPoint(rig().localToWorld()),
  );
  yield* cursor().moveToPosition(cursorPos, 0.7);
  circle().position(() =>
    new Vector2(300, -200).transformAsPoint(rect().localToParent()),
  );
  yield* rect().rotation(40, 0.9).wait(0.1).to(-10, 0.8);

  yield* waitUntil('scale rect');
  yield* cursorPos(
    () =>
      rig().control(Control.TopRight).transformAsPoint(rig().localToWorld()),
    0.7,
  );
  circle().scale(rect().scale);
  yield* rect().scale(1.4, 0.9).wait(0.1).to(0.6, 1).wait(0.1).to(1, 1);

  yield* waitUntil('reset rotation');
  yield* cursorPos(
    () =>
      rig().control(Control.Rotation).transformAsPoint(rig().localToWorld()),
    0.5,
  );
  yield* rect().rotation(0, 0.6);

  yield* waitUntil('hide rig');
  circle().scale(1);
  circle().position(() => rect().position().add([300, -200]));
  cursor().unstick();
  yield* sequence(
    0.1,
    cursor().hide(),
    rig().scale(0, 0.7, easeInBack),
    rectCoords().hide(),
    circleGlobalCoords().hide(),
  );

  yield* waitUntil('move camera');
  scene().camera.save();
  yield* scene().camera.centerOn(circleLocalCoords(), 1.5);

  yield* waitUntil('show local coords');
  yield* circleLocalCoords().show();

  yield* waitUntil('show lines');
  yield* sequence(
    0.06,
    ...[circleX(), circleY()].map((node) => node.scale(1, 0.7, easeOutBack)),
    ...[labelX(), labelY()].map((node) => node.scale(1, 0.7, easeOutBack)),
    all(positionLine().start(0, 0.7), positionLine().end(1, 0.7)),
  );

  yield* waitUntil('show global coords');
  circleGlobalCoords()
    .bottom(circleLocalCoords().top().add(Vector2.down.scale(12)))
    .scale(1)
    .zIndex(-1)
    .opacity(0);
  circleGlobalCoords().save();
  circleLocalCoords().save();
  yield* sequence(
    0.3,
    all(
      circleLocalCoords().bottom(circle().top().add(Vector2.up.scale(12)), 0.8),
      circleLocalCoords().opacity(0, 0.8),
    ),
    all(
      circleGlobalCoords().bottom(
        () => circle().top().add(Vector2.down.scale(10)),
        0.7,
        easeOutCubic,
      ),
      circleGlobalCoords().opacity(1, 0.7),
    ),
  );

  yield* waitUntil('show local coords 2');
  yield* sequence(
    0.3,
    circleGlobalCoords().restore(0.7),
    circleLocalCoords().restore(0.7, easeOutCubic),
  );

  yield* waitUntil('hide lines');
  yield* sequence(
    0.15,
    ...[circleX(), circleY()].map((node) => node.scale(0, 0.6, easeInBack)),
    ...[labelX(), labelY()].map((node) => node.scale(0, 0.6, easeInBack)),
    all(positionLine().start(0.6, 0.6), positionLine().end(0.6, 0.6)),
    circleLocalCoords().hide(),
  );

  yield* waitUntil('hide objects');
  yield* sequence(
    0.1,
    sceneTree.scale(0, 0.6, easeInBack),
    circle().scale(0, 0.6, easeInBack),
    rect().scale(0, 0.6, easeInBack),
    scene().camera.restore(1),
    scene().size([2000, 1100], 1),
  );

  yield* waitUntil('scene end');
});
import { CameraView } from '@ksassnowski/motion-canvas-camera';

import {
  Circle,
  Img,
  Layout,
  Node,
  Rect,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  CodeBlock,
  edit,
  lines,
} from '@motion-canvas/2d/lib/components/CodeBlock';
import {
  BBox,
  DEFAULT,
  Matrix2D,
  Vector2,
  all,
  cancel,
  chain,
  createRef,
  easeInBack,
  easeOutBack,
  linear,
  makeRef,
  range,
  sequence,
  useScene,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';
import { ThreadGenerator } from '@motion-canvas/core/lib/threading';

import { group, translate } from '@common/utils';

import theme from '@theme';

import dungeonSprite from '../assets/dungeon.png';
import {
  AnimatedSprite,
  Blood,
  Coordinates,
  ExtendedGameSceneTree,
  Goblin,
  Grid,
  Hero,
  SceneTree,
  Spear,
  Torch,
} from '../components';

export default makeScene2D(function* (view) {
  const camera = createRef<CameraView>();
  const tiles = createRef<Node>();
  const dungeon = createRef<Img>();
  const goblin = createRef<AnimatedSprite>();
  const heroine = createRef<AnimatedSprite>();
  const spear = createRef<AnimatedSprite>();
  const blood = createRef<AnimatedSprite>();
  const grid = createRef<Grid>();
  const goblinGrid = createRef<Grid>();
  const torches: AnimatedSprite[] = [];
  const code = createRef<CodeBlock>();
  const codeWrapper = createRef<Rect>();
  const sceneTree = createRef<SceneTree>();
  const goblinSpriteCoordinates = createRef<Rect>();
  const worldZeroCoordinates = createRef<Coordinates>();
  const worldSpaceOrigin = createRef<Circle>();

  const { x: sceneWidth, y: sceneHeight } = useScene().getSize();
  const TILE_SIZE = 128;
  const NUM_ROWS = sceneHeight / TILE_SIZE;
  const NUM_COLS = sceneWidth / TILE_SIZE;

  let heroineAnimation: ThreadGenerator | null;
  let goblinAnimation: ThreadGenerator | null;

  function* showSpear() {
    yield* spear().scale(-1, 0.2);
  }

  function* hideSpear(duration = 0.2) {
    yield* spear().scale(0, duration);
  }

  function* attack(times: number) {
    for (let i = 0; i < times; i++) {
      yield* all(
        heroine().playOnce('attack'),
        chain(
          translate(spear(), [10, 0], 0.05),
          waitFor(0.4),
          translate(spear(), [0, 0], 0.3),
        ),
        chain(blood().scale([-3, 3], 0), blood().playOnce('default')),
      );
      yield* waitFor(times > 1 ? 0.1 : 0);
    }
  }

  function* attackSequence(times: number) {
    yield* showSpear();
    yield* waitFor(0.2);
    cancel(heroineAnimation);
    yield* attack(times);
    heroineAnimation = yield heroine().loop('idle');
    yield* waitFor(0.2);
    yield* hideSpear();
  }

  function* focus() {
    yield* all(
      camera().opacity(0.1, 0.8),
      sceneTree().position([-500, 0], 0.8),
      codeWrapper().position([400, 0], 0.8),
    );
  }

  function* unfocus() {
    yield* all(
      camera().opacity(1, 0.8),
      codeWrapper().position([515, -410], 0.8),
      sceneTree().topLeft(
        () =>
          view
            .topLeft()
            .transformAsPoint(view.localToParent().inverse())
            .add(30),
        0.8,
      ),
    );
  }

  yield view.add(
    <>
      <CameraView ref={camera} width={'100%'} height={'100%'} clip={false}>
        <Grid
          ref={grid}
          width={8000}
          height={8000}
          position={() =>
            camera()
              .topLeft()
              .transformAsPoint(camera().localToParent().inverse())
          }
          spacing={() => new Vector2(TILE_SIZE)}
          lineWidth={() => Vector2.one.div(camera().scale()).x}
          axisLineWidth={() => 3 / camera().scale().x}
          stroke={'#363637'}
          axisStroke={'#454545'}
          start={0.5}
          end={0.5}
        />

        <Img
          ref={dungeon}
          src={dungeonSprite}
          scale={8}
          y={38}
          smoothing={false}
        />

        {range(0, 3).map((i) => (
          <Torch
            ref={makeRef(torches, i)}
            position={[-640 + 640 * i, -348]}
            scale={8}
          />
        ))}

        <Grid
          ref={goblinGrid}
          width={8000}
          height={8000}
          position={() => goblin().position().add(Vector2.up.scale(30))}
          spacing={TILE_SIZE}
          stroke={'#2e362e'}
          axisStroke={'#37503d'}
          lineWidth={() => Vector2.one.div(camera().scale()).x}
          axisLineWidth={() => 3 / camera().scale().x}
          end={0.5}
          start={0.5}
        />

        <Blood
          ref={blood}
          scale={0}
          position={() =>
            camera()
              .topLeft()
              .transformAsPoint(camera().localToParent().inverse())
          }
          zIndex={1}
        />
        <Goblin ref={goblin} position={[-770, 140]} scale={0} />
        <Hero ref={heroine} position={[770, 140]} scale={0}>
          <Spear ref={spear} scale={0} position={[3, 12]} />
        </Hero>
      </CameraView>

      <Coordinates
        ref={goblinSpriteCoordinates}
        position={[100, -70]}
        coordinates={Vector2.zero}
        xColor={theme.colors.Green2}
        yColor={theme.colors.Green2}
        scale={0}
      />

      <Coordinates
        ref={worldZeroCoordinates}
        position={() => camera().topLeft().add([60, -30])}
        coordinates={Vector2.zero}
        scale={0}
      />

      <Circle
        ref={worldSpaceOrigin}
        size={12}
        fill={theme.colors.White}
        position={() => camera().topLeft()}
        scale={0}
      />

      <Rect
        ref={codeWrapper}
        fill={`${theme.colors.Gray5}dd`}
        padding={[32, 32, 20, 32]}
        radius={12}
        position={[515, -410]}
        scale={0}
        smoothCorners
        layout
      >
        <CodeBlock
          ref={code}
          code={`
        const effect = new BloodSpatter();
        effect.position = goblinSprite.position;
        scene.add(effect);`}
          lineHeight={'160%'}
          fontSize={36}
          fontFamily={theme.fonts.mono}
          layout
        />
      </Rect>

      <ExtendedGameSceneTree
        ref={sceneTree}
        opacity={0}
        scale={2}
        containerFill={`${theme.colors.Gray5}dd`}
        topLeft={() =>
          view
            .topLeft()
            .transformAsPoint(view.localToParent().inverse())
            .add(30)
        }
      />

      <Layout
        ref={tiles}
        compositeOperation={'destination-in'}
        width={'100%'}
        height={'100%'}
        wrap={'wrap'}
        layout
      >
        {range(NUM_ROWS).map(() =>
          range(NUM_COLS).map(() => (
            <Rect size={TILE_SIZE} fill={'#121214'} scale={0} />
          )),
        )}
      </Layout>
    </>,
  );

  yield all(...torches.map((torch) => torch.loop('default')));
  goblinAnimation = yield goblin().loop('walk');
  heroineAnimation = yield heroine().loop('walk');

  yield* sequence(
    0.09,
    ...range(NUM_ROWS).map((i) =>
      sequence(
        0.02,
        ...tiles()
          .children()
          .slice(i * NUM_COLS, i * NUM_COLS + NUM_COLS)
          .map((node) => (node as Layout).scale(1, 0.3, linear)),
      ),
    ),
  );
  // No point in having to handle hundreds of tiles on every frame after the
  // initial animation.
  tiles().remove();

  yield* waitUntil('enter chars');
  heroine().scale([-8, 8]);
  goblin().scale(8);
  yield* all(
    heroine().position.x(128, 1.6, linear),
    goblin().position.x(-72, 1.6, linear),
  );
  cancel(heroineAnimation);
  cancel(goblinAnimation);
  heroineAnimation = yield heroine().loop('idle');
  goblinAnimation = yield goblin().loop('idle');

  yield* waitUntil('attack');
  yield* showSpear();
  yield* waitFor(0.2);
  cancel(heroineAnimation);
  const stab = yield attack(Infinity);

  yield* waitUntil('zoom on blood');
  camera().save();
  yield* camera().zoomOnto(blood(), 0, 800);

  yield* waitUntil('stop attack');
  cancel(stab, heroineAnimation);
  heroineAnimation = yield heroine().loop('idle');
  yield* hideSpear(0);

  yield* waitUntil('reset camera');
  yield* camera().restore(0);

  yield* waitUntil('show code');
  yield* codeWrapper().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show scene tree');
  yield* sceneTree().create(0.6);

  yield* waitUntil('focus');
  yield* focus();

  yield* waitUntil('highlight code');
  yield* code().selection(lines(1), 1);

  yield* waitUntil('highlight goblin sprite node');
  yield* sceneTree().highlightNode('goblin-sprite', 0.6);

  yield* waitUntil('highlight goblin node');
  yield* sceneTree().highlightNode('goblin', 0.6, theme.colors.Red);

  yield* waitUntil('hide highlight');
  yield* sceneTree().resetHighlight(0.6);

  yield* waitUntil('reset scene');
  yield* unfocus();

  const g = group(...torches, heroine(), dungeon(), codeWrapper());
  yield* waitUntil('goblin local space');
  cancel(goblinAnimation);
  camera().save();
  yield* sequence(
    0.4,
    all(
      camera().centerOn(goblinGrid(), 1),
      // @ts-ignore
      g.opacity(0, 0.8),
      sceneTree().highlightNode('goblin', 0.7, theme.colors.Green1),
    ),
    all(goblinGrid().start(0, 1), goblinGrid().end(1, 1)),
  );

  yield* waitUntil('show coords');
  yield* goblinSpriteCoordinates().scale(1.5, 0.7, easeOutBack);

  yield* waitUntil('show full scene');
  goblinAnimation = yield goblin().loop('idle');
  yield* all(
    camera().restore(0.7),
    goblinGrid().start(1, 0.7),
    sceneTree().resetHighlight(),
    goblinSpriteCoordinates().scale(0, 0.7),
    // @ts-ignore
    g.opacity(1, 0.7),
  );

  yield* waitUntil('focus 2');
  yield* focus();

  yield* waitUntil('highlight code 2');
  yield* code().selection(lines(2), 0.7);

  yield* waitUntil('insert sprite');
  yield* sceneTree().insertObject({
    id: 'blood',
    label: 'Blood',
    icon: (
      <Rect
        size={8}
        lineWidth={3}
        stroke={`${theme.colors.Red}88`}
        fill={theme.colors.Red}
        radius={2}
        smoothCorners
      />
    ),
  });

  yield* waitUntil('reset');
  yield* all(unfocus(), codeWrapper().opacity(0, 0.7));

  yield* waitUntil('zoom out camera');
  // lmao
  const worldZeroBBox = BBox.fromPoints(
    ...BBox.fromSizeCentered(new Vector2(200)).transformCorners(
      Matrix2D.fromTranslation(
        Vector2.zero.transformAsPoint(camera().worldToLocal()),
      ).domMatrix,
    ),
  );
  yield* sequence(
    0.4,
    camera().zoomOnto(worldZeroBBox, 1.2, TILE_SIZE * 25),
    all(grid().end(1, 1), grid().start(0, 1)),
  );

  yield* waitUntil('show world origin');
  yield* all(
    worldSpaceOrigin().scale(1, 0.7, easeOutBack),
    worldSpaceOrigin().ripple(1),
    worldZeroCoordinates().show(),
  );

  yield* waitUntil('attack 2');
  yield* attackSequence(3);

  yield* waitUntil('zoom in');
  yield* all(camera().zoom(0.4, 1), camera().shift(new Vector2(200, 400), 1));

  yield* waitUntil('move');
  yield* all(
    translate(goblin(), [380, 120], 0.8),
    translate(heroine(), [380, 120], 0.8),
  );

  yield* waitUntil('attack 3');
  yield* attackSequence(2);

  yield* waitUntil('move 2');
  yield* all(
    translate(goblin(), [-635, -240], 0.8),
    translate(heroine(), [-635, -240], 0.8),
  );

  yield* waitUntil('attack 4');
  yield* attackSequence(2);

  yield* waitUntil('reset camera 2');
  code().selection(lines(0, 2));
  codeWrapper().opacity(1).scale(0);
  yield* sequence(
    0.5,
    camera().reset(1),
    codeWrapper().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('focus 3');
  yield* focus();

  yield* waitUntil('show code 2');
  yield* all(
    code().selection(lines(1), 0.7),
    sceneTree().highlightNode('goblin-sprite', 0.7),
  );

  yield* waitUntil('use gobo pos');
  yield* all(
    sceneTree().highlightNode('goblin', 0.7),
    code().edit(0.7)`
const effect = new BloodSpatter();
effect.position = ${edit('goblinSprite.position', 'goblin.position')};
scene.add(effect);`,
  );

  yield* waitUntil('use sprite pos');
  yield* all(
    sceneTree().highlightNode('goblin-sprite', 0.7),
    code().edit(0.7, false)`
const effect = new BloodSpatter();
effect.position = ${edit('goblin.position', 'goblinSprite.position')};
scene.add(effect);`,
    code().selection(lines(1), 0.7),
  );

  yield* waitUntil('compute world pos');
  yield* code().edit(1.3)`
const effect = new BloodSpatter();
${edit(
  'effect.position = goblinSprite.position;',
  `const worldPos = goblin.localToParent(
  goblinSprite.position
);
effect.position = worldPos;`,
)}
scene.add(effect);`;

  yield* waitUntil('set global pos');
  yield* code().edit(1.2)`
const effect = new BloodSpatter();
${edit(
  `const worldPos = goblin.localToParent(
  goblinSprite.position
);
effect.position = worldPos;`,
  `effect.globalPosition = goblinSprite.globalPosition;`,
)}
scene.add(effect);`;

  yield* waitUntil('unfocus');
  yield* all(
    unfocus(),
    codeWrapper().opacity(0, 0.7),
    sceneTree().resetHighlight(),
  );

  yield* waitUntil('hide scene tree');
  yield* sceneTree().scale(0, 0.7, easeInBack);

  yield* waitUntil('zoom out forever');
  worldZeroCoordinates().reparent(camera());
  worldSpaceOrigin().reparent(camera());
  yield camera().zoom(0.01, 40, linear);

  yield* waitUntil('fade out');
  yield* camera().opacity(0, 5, linear);

  yield* waitUntil('scene end');
});
import { Circle, Polygon, Rect, Txt, makeScene2D } from '@motion-canvas/2d';
import { Ray, ShapeProps } from '@motion-canvas/2d/lib/components';
import {
  DEFAULT,
  Vector2,
  createRef,
  createSignal,
  easeInBack,
  easeOutBack,
  loopUntil,
  sequence,
  waitUntil,
} from '@motion-canvas/core';
import { all, loop } from '@motion-canvas/core/lib/flow';
import { createComputed } from '@motion-canvas/core/lib/signals';
import { easeInOutCubic, tween } from '@motion-canvas/core/lib/tweening';
import { debug } from '@motion-canvas/core/lib/utils';

import { createPolarLerp, rotatePoint } from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  Grid,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  Vector,
} from '../components';

export default makeScene2D(function* (view) {
  const worldScene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();
  const localScene = createRef<SceneContainer>();
  const rectGrid = createRef<Grid>();
  const origin = createRef<Circle>();
  const originCoordinates = createRef<Coordinates>();
  const xArrowLocal = createRef<Ray>();
  const xCoordinateLocal = createRef<Txt>();
  const xArrowWorld = createRef<Ray>();
  const xCoordinateWorld = createRef<Txt>();

  const rectPosition = Vector2.createSignal();
  const rectScale = Vector2.createSignal(1);
  const rectRotation = createSignal(0);

  const polygonPosition = new Vector2(-250, -150);
  const circlePosition = new Vector2(250, 250);
  const trianglePosition = new Vector2(-150, 200);

  const sceneTree = () => (<RectCircleSceneTree />) as SceneTree;

  function createPositionSignal(pos: Vector2) {
    return createComputed(() =>
      pos.transformAsPoint(rect().localToParent().inverse()),
    );
  }

  function moveRectangle() {
    return rectPosition([100, 100], 1)
      .wait(0.5)
      .to([-200, 75], 1)
      .wait(0.5)
      .to(0, 1)
      .wait(0.5);
  }

  function scaleRectangle() {
    return rectScale(0.8, 1).wait(0.5).to(1.3, 1).wait(0.5).to(1, 1).wait(0.5);
  }

  function* showRectGrid() {
    yield* all(
      rectGrid().start(0.5, 0).to(0, 1),
      rectGrid().end(0.5, 0).to(1, 1),
    );
  }

  function* hideRectGrid() {
    yield* all(rectGrid().start(0.5, 1), rectGrid().end(0.5, 1));
  }

  const props: ShapeProps = {
    fill: theme.colors.Brown3,
    scale: () => Vector2.one.div(rectScale()),
    rotation: () => -rectRotation(),
  };

  view.add(
    <>
      <SceneContainer
        ref={worldScene}
        width={850}
        height={700}
        scale={0}
        x={-475}
        sceneTree={sceneTree()}
        showAxis
      >
        <Grid
          ref={rectGrid}
          width={'100%'}
          height={'100%'}
          position={rectPosition}
          spacing={() => new Vector2(50).mul(rectScale())}
          rotation={rectRotation}
          axisStroke={'#63878f'}
          stroke={'#51666c'}
          end={0}
        />

        <RectObject
          ref={rect}
          position={rectPosition}
          rotation={rectRotation}
          scale={rectScale}
        >
          <CircleObject ref={circle} position={[300, -200]} />
        </RectObject>

        <Polygon
          sides={5}
          size={70}
          fill={theme.colors.Brown3}
          position={polygonPosition}
        />

        <Circle
          size={60}
          fill={theme.colors.Brown3}
          position={circlePosition}
        />

        <Polygon
          sides={3}
          size={90}
          fill={theme.colors.Brown3}
          position={trianglePosition}
        />

        <Vector
          ref={xArrowWorld}
          to={() =>
            new Vector2([300, 0]).transformAsPoint(rect().localToParent())
          }
          end={0}
        />

        <Txt
          ref={xCoordinateWorld}
          text={() =>
            new Vector2([300, 0])
              .transformAsPoint(rect().localToParent())
              .x.toFixed(0)
          }
          fontFamily={theme.fonts.mono}
          fontSize={28}
          position={() =>
            new Vector2([300, 0])
              .transformAsPoint(rect().localToParent())
              .add([0, -30])
          }
          fill={theme.colors.Red}
          scale={0}
        />
      </SceneContainer>

      <SceneContainer
        ref={localScene}
        width={850}
        height={700}
        x={475}
        labelText={'Local Space'}
        labelColor={theme.colors.Blue1}
        sceneTree={sceneTree()}
        scale={0}
        showAxis
      >
        <RectObject>
          <CircleObject position={[300, -200]} />
        </RectObject>

        <Polygon
          sides={5}
          size={70}
          position={createPositionSignal(polygonPosition)}
          {...props}
        />

        <Circle
          size={60}
          position={createPositionSignal(circlePosition)}
          {...props}
        />

        <Polygon
          sides={3}
          size={90}
          position={createPositionSignal(trianglePosition)}
          {...props}
        />

        <Vector ref={xArrowLocal} to={[300, 0]} end={0} />

        <Txt
          ref={xCoordinateLocal}
          text={'300'}
          fontFamily={theme.fonts.mono}
          fontSize={28}
          position={[300, 40]}
          fill={theme.colors.Red}
          scale={0}
        />

        <Circle ref={origin} fill={theme.colors.White} size={14} scale={0} />

        <Coordinates
          ref={originCoordinates}
          coordinates={0}
          y={-70}
          scale={0}
        />
      </SceneContainer>
    </>,
  );

  yield* waitUntil('show scenes');
  yield* sequence(
    0.1,
    worldScene().scale(1, 0.8, easeOutBack),
    localScene().scale(1, 0.8, easeOutBack),
  );

  yield* waitUntil('show world label');
  yield* worldScene().labelScale(1, 0.6, easeOutBack);

  yield* waitUntil('show local label');
  yield* localScene().labelScale(1, 0.6, easeOutBack);

  yield* waitUntil('move rect');
  yield* loopUntil('stop moving', moveRectangle);

  yield* waitUntil('show rect grid');
  yield* showRectGrid();

  yield* waitUntil('move rect 2');
  yield loopUntil('stop move 2', moveRectangle);

  yield* waitUntil('show origin');
  yield* sequence(
    0.1,
    origin().scale(1, 0.7, easeOutBack),
    origin().ripple(1),
    originCoordinates().show(),
  );

  yield* waitUntil('show local pos');
  yield* sequence(
    0.3,
    xArrowLocal().end(1, 0.7),
    xCoordinateLocal().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('hide rect grid');
  yield* all(
    hideRectGrid(),
    xArrowLocal().end(0, 0.6),
    xCoordinateLocal().scale(0, 0.6, easeOutBack),
    originCoordinates().hide(),
    origin().scale(0, 0.6, easeOutBack),
  );

  yield* waitUntil('scale rect');
  yield loop(2, scaleRectangle);

  yield* waitUntil('show rect grid 2');
  yield* showRectGrid();

  yield* waitUntil('scale rect 2');
  yield* rectScale(0.7, 1);

  yield* waitUntil('show local pos 2');
  yield* sequence(
    0.3,
    xArrowLocal().end(1, 0.7),
    xCoordinateLocal().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show world arrow');
  yield* xArrowWorld().end(1, 0.7);

  yield* waitUntil('hide rect grid 2');
  yield* hideRectGrid();
  yield* xCoordinateWorld().scale(1, 0.7, easeOutBack);

  yield* waitUntil('hide arrows');
  yield* all(
    xArrowLocal().end(0, 0.7),
    xArrowWorld().end(0, 0.7),
    xCoordinateWorld().scale(0, 0.6, easeInBack),
    xCoordinateLocal().scale(0, 0.6, easeInBack),
  );

  yield* waitUntil('reset scale');
  yield* rectScale(1, 1);

  yield* waitUntil('rotate rect');
  yield* rectRotation(45, 1);

  yield* waitUntil('show rect grid 3');
  yield* showRectGrid();

  yield* waitUntil('rotate rect 2');
  yield* rectRotation(-15, 1.2).wait(0.5).to(-120, 1.2).wait(0.5);

  yield* waitUntil('show local arrow');
  yield* sequence(
    0.3,
    xArrowLocal().end(1, 0.7),
    xCoordinateLocal().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show world arrow 2');
  yield* xArrowWorld().end(1, 0.7);

  yield* waitUntil('show world coord');
  yield* hideRectGrid();

  /*
  yield* waitUntil('center scene');
  yield* all(
    localScene().x(1400, 0.7),
    worldScene().x(0, 0.7),
    worldScene().width(1000, 0.7),
    worldScene().height(800, 0.7),
    rectRotation(0, 0.8),
    rectScale(1, 0.7),
    xArrowWorld().end(0, 0.5),
    worldScene().labelScale(0, 0.7),
  );
  localScene().remove();

  yield* waitUntil('transform rect');
  yield* rectRotation(-50, 0.7);
  yield* rectPosition([150, 150], 0.7);
  yield* rectScale(0.7, 0.7);

  yield* waitUntil('show arrow');
  xArrowWorld()
    .from(rect().position())
    .to(circle().position().transformAsPoint(rect().localToParent()));
  yield* xArrowWorld().end(1, 0.8);

  yield* waitUntil('move vector');
  yield* all(
    xArrowWorld().from(0, 0.7),
    xArrowWorld().to(circle().position(), 0.7),
  );

  yield* waitUntil('scale vector');
  yield* xArrowWorld().to(circle().position().mul(rectScale()), 0.7);

  yield* waitUntil('rotate vector');
  yield* xArrowWorld().to(
    rotatePoint(xArrowWorld().to(), rectRotation()),
    0.7,
    easeInOutCubic,
    createPolarLerp(),
  );

  yield* waitUntil('translate vector');
  yield* xArrowWorld().to(xArrowWorld().to().add(rect().position()), 0.7);
   */

  yield* waitUntil('scene end');
});
import { Circle, Rect, makeScene2D } from '@motion-canvas/2d';
import { Ray } from '@motion-canvas/2d/lib/components';
import {
  DEFAULT,
  Vector2,
  createRef,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';
import { all } from '@motion-canvas/core/lib/flow';

import { translate } from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  RectObject,
  SceneContainer,
  Transform,
  Vector,
} from '../components';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const rectCoords = createRef<Coordinates>();
  const rectCoords2 = createRef<Coordinates>();
  const circle = createRef<Circle>();
  const circleCoords = createRef<Coordinates>();
  const localPosVector = createRef<Ray>();
  const localPosCoordinates = createRef<Coordinates>();
  const originDot = createRef<Circle>();
  const originCoordinates = createRef<Coordinates>();
  const transform = createRef<Transform>();

  view.add(
    <>
      <SceneContainer ref={scene} width={2000} height={1200} showAxis>
        <RectObject ref={rect} position={[-400, 200]} scale={0}>
          <Coordinates
            ref={rectCoords}
            coordinates={() => rect().position()}
            scale={0}
            y={80}
          />
        </RectObject>

        <CircleObject ref={circle} scale={0} position={() => rect().position()}>
          <Coordinates
            ref={circleCoords}
            coordinates={() => circle().position()}
            scale={0}
            y={80}
          />
        </CircleObject>

        <Vector
          ref={localPosVector}
          from={() => rect().position()}
          to={() => circle().position()}
          end={0}
        />

        <Circle ref={originDot} size={20} fill={theme.colors.White} scale={0} />
        <Coordinates
          ref={originCoordinates}
          coordinates={0}
          position={[-60, -40]}
          scale={0}
        />

        <Coordinates
          ref={localPosCoordinates}
          coordinates={[300, -200]}
          scale={0}
          opacity={0}
          right={() => {
            return localPosVector()
              .getPointAtPercentage(0.6)
              .position.add(Vector2.left.scale(50));
          }}
          xColor={theme.colors.Gray1}
          yColor={theme.colors.Gray1}
        />
      </SceneContainer>

      <Coordinates
        ref={rectCoords2}
        coordinates={200}
        scale={0}
        position={[750, -450]}
      />

      <Transform ref={transform} node={scene} end={0} />
    </>,
  );

  yield* waitUntil('show rect');
  yield* rect().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show rect coords');
  yield* rectCoords().show();

  yield* waitUntil('show circle');
  yield* circle().scale(1, 0.5, easeOutBack);
  circleCoords().scale(1);

  yield* waitUntil('move circle x');
  yield* translate(circle(), [300, 0], 0.8);
  // Hack around a weird bug where the coordinates would be visible while the
  // vector's length is 0, even if its scale is set to 0. This is a bug caused
  // by Jacob's lack of skill.
  localPosCoordinates().opacity(1);

  yield* waitUntil('move circle y');
  yield* translate(circle(), [0, -200], 0.8);

  yield* waitUntil('show vector');
  yield* localPosVector().end(1, 0.8);

  yield* waitUntil('show local pos');
  yield* localPosCoordinates().show();

  yield* waitUntil('hide objects');
  yield* sequence(
    0.1,
    localPosCoordinates().hide(),
    localPosVector().end(0, 0.6),
    circle().scale(0, 0.6, easeInBack),
    rect().scale(0, 0.6, easeInBack),
  );

  yield* waitUntil('show circle 2');
  circle().fill(theme.colors.White).size(20).position([100, 200]);
  circleCoords().position.y(40);
  yield* circle().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show origin');
  yield* sequence(
    0.1,
    originDot().scale(1, 0.6, easeOutBack),
    originCoordinates().show(),
  );

  yield* waitUntil('clear scene');
  yield* sequence(
    0.1,
    circle().scale(0, 0.6, easeInBack),
    circleCoords().hide(),
    originDot().scale(0, 0.6, easeInBack),
    scene().gridStart(1, 1.2),
    originCoordinates().hide(),
  );

  yield* waitUntil('show rect 2');
  scene().size([3000, 3000]).position([-200, -200]).rotation(20).scale(1.5);
  rectCoords().scale(0);
  rect()
    .size(60)
    .position(Vector2.zero.transformAsPoint(scene().localToParent().inverse()))
    .rotation(-20);
  yield* rect().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show rect coords 2');
  yield* rectCoords2().show();

  yield* waitUntil('show origin 2');
  yield* originDot().scale(0.5, 0.6, easeOutBack);

  yield* waitUntil('move rect to origin');
  yield* rect().position(0, 1);

  yield* waitUntil('show transform');
  yield* all(originDot().scale(0, 0.6), transform().end(1, 0.6));

  yield* waitUntil('show axis');
  yield* all(scene().axisStart(0, 1.2), scene().axisEnd(1, 1.2));

  yield* waitUntil('rotate rect');
  yield* all(rect().rotation(0, 1));

  yield* waitUntil('show grid');
  yield* all(
    scene().gridStart(0.5, 0).to(0, 2),
    scene().gridEnd(0.5, 0).to(1, 2),
  );

  yield* waitUntil('position rect');
  yield* rect().position.x(200, 0.7);
  yield* sequence(
    0.1,
    rect().position.y(200, 0.7),
    all(
      rectCoords2().fontSize(28, 1),
      rectCoords2().position(
        () =>
          new Vector2(200, 200)
            .transformAsPoint(scene().localToParent())
            .add(Vector2.up.scale(70)),
        1,
      ),
    ),
  );

  yield* waitUntil('position scene');
  yield* scene().position(0, 0.8);

  yield* waitUntil('rotate scene');
  yield* scene().rotation(0, 0.8);

  yield* waitUntil('scale scene');
  yield* scene().scale(1, 0.8);

  yield* waitUntil('hide scene');
  yield* sequence(
    0.15,
    transform().scale(0, 0.7, easeInBack),
    rectCoords2().hide(),
    rect().scale(0, 0.8, easeInBack),
    scene().size([1000, 800], 1),
  );

  yield* waitUntil('scene end');
});

import { makeScene2D } from '@motion-canvas/2d';
import {
  Latex,
  LatexProps,
  Layout,
  LayoutProps,
  Node,
} from '@motion-canvas/2d/lib/components';
import { all, delay, sequence, waitUntil } from '@motion-canvas/core/lib/flow';
import {
  Computed,
  SignalValue,
  createComputed,
  createSignal,
  isReactive,
} from '@motion-canvas/core/lib/signals';
import { slideTransition } from '@motion-canvas/core/lib/transitions';
import { easeInBack } from '@motion-canvas/core/lib/tweening';
import { Direction, Matrix2D, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';

import { texColor } from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  SceneContainer,
  SceneContainerProps,
  localToParentFormula,
  rotationMatrixTex,
  scalingMatrixTex,
  translationMatrixTex,
} from '../components';

function createPositionSignal(
  translation: SignalValue<Vector2> = Vector2.zero,
  rotation: SignalValue<number> = 0,
  scale: SignalValue<Vector2> = Vector2.one,
): Computed<Vector2> {
  return createComputed(() => {
    const parsedTranslation = isReactive(translation)
      ? translation()
      : translation;
    const parsedRotation = isReactive(rotation) ? rotation() : rotation;
    const parsedScale = isReactive(scale) ? scale() : scale;

    const cos = Math.cos((parsedRotation * Math.PI) / 180);
    const sin = Math.sin((parsedRotation * Math.PI) / 180);
    const matrix = new Matrix2D(
      parsedScale.x * cos,
      parsedScale.y * sin,
      -parsedScale.x * sin,
      parsedScale.y * cos,
      0,
      0,
    );
    return parsedTranslation.transformAsPoint(matrix.domMatrix);
  });
}

export default makeScene2D(function* (view) {
  const formula = createRef<Latex>();
  const translationMatrix = createRef<Latex>();
  const scalingMatrix = createRef<Latex>();
  const rotationMatrix = createRef<Latex>();
  const layoutGroup = createRef<Node>();
  const translationScene = createRef<SceneContainer>();
  const scalingScene = createRef<SceneContainer>();
  const rotationScene = createRef<SceneContainer>();

  const sceneStyles: SceneContainerProps = {
    showAxis: true,
    lineWidth: 0,
    width: 580,
    height: 400,
    gridSpacing: 25,
  };

  const layoutStyles: LayoutProps = {
    direction: 'column',
    alignItems: 'center',
    gap: 40,
    layout: true,
    x: -630,
    scale: 0,
  };

  const latexStyles: LatexProps = {
    height: 115,
    scale: 0,
  };

  const translation = Vector2.createSignal();
  const scaling = Vector2.createSignal(1);
  const rotation = createSignal(0);

  yield view.add(
    <>
      <Latex
        ref={formula}
        tex={texColor(localToParentFormula, theme.colors.White)}
        y={-700}
        scale={0}
        height={250}
      />

      <Node ref={layoutGroup} y={-50}>
        <Layout ref={translationScene} {...layoutStyles}>
          <Latex
            ref={translationMatrix}
            tex={texColor(translationMatrixTex, theme.colors.White)}
            {...latexStyles}
          />

          <SceneContainer {...sceneStyles}>
            <CircleObject
              position={() => {
                const position = createPositionSignal(
                  new Vector2(50, -50),
                  rotation,
                  scaling,
                );
                return position().add(translation());
              }}
              scale={() => scaling().scale(0.5)}
            />
          </SceneContainer>
        </Layout>

        <Layout ref={rotationScene} {...layoutStyles}>
          <Latex
            ref={rotationMatrix}
            tex={texColor(rotationMatrixTex, theme.colors.White)}
            {...latexStyles}
          />

          <SceneContainer {...sceneStyles}>
            <CircleObject
              position={createPositionSignal(
                new Vector2(50, -50),
                rotation,
                scaling,
              )}
              scale={() => scaling().scale(0.5)}
            />
          </SceneContainer>
        </Layout>

        <Layout ref={scalingScene} {...layoutStyles}>
          <Latex
            ref={scalingMatrix}
            tex={texColor(scalingMatrixTex, theme.colors.White)}
            {...latexStyles}
            scale={1}
          />

          <SceneContainer {...sceneStyles}>
            <CircleObject
              position={createPositionSignal(new Vector2(50, -50), 0, scaling)}
              scale={() => scaling().scale(0.5)}
            />
          </SceneContainer>
        </Layout>
      </Node>
    </>,
  );

  yield* slideTransition(Direction.Bottom, 0.9);

  yield* waitUntil('show scaling scene');
  yield* scalingScene().scale(1, 0.6);

  yield* waitUntil('show scaling');
  yield* scaling(1.5, 0.8);

  yield* waitUntil('show rotation');
  rotationScene().scale(1);
  rotationScene().position(scalingScene().position());
  yield* sequence(
    0.2,
    rotationScene().position.x(scalingScene().position.x() + 630, 0.7),
    rotationMatrix().scale(1, 0.6),
    delay(0.1, rotation(60, 0.7)),
  );

  yield* waitUntil('show translation');
  translationScene().scale(1);
  translationScene().position(rotationScene().position());
  yield* sequence(
    0.2,
    translationScene().position.x(rotationScene().position.x() + 630, 0.7),
    translationMatrix().scale(1, 0.6),
    delay(0.1, translation([50, 100], 0.8)),
  );

  yield* waitUntil('show formula');
  formula().scale(1);
  yield* all(formula().position.y(-350, 1), layoutGroup().position.y(150, 1));

  yield* waitUntil('hide scene');
  yield* sequence(
    0.1,
    formula().scale(0, 0.6, easeInBack),
    ...layoutGroup()
      .children()
      .map((node) => node.scale(0, 0.6, easeInBack)),
  );

  yield* waitUntil('scene end');
});
import {
  CacheRectCollider,
  KinematicBody,
  PolygonCollider,
  StaticBody,
  World,
} from '@ksassnowski/motion-canvas-components';

import { makeScene2D } from '@motion-canvas/2d';
import { Img, Latex, Rect } from '@motion-canvas/2d/lib/components';
import { waitUntil } from '@motion-canvas/core/lib/flow';
import { Origin, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef, useRandom } from '@motion-canvas/core/lib/utils';

import justGoboSprite from '../assets/just_gobo.png';
import { AnimatedSprite, Blood, SimpleFormula } from '../components';

export default makeScene2D(function* (view) {
  const world = createRef<World>();
  const tex = createRef<Latex>();
  const blood = createRef<AnimatedSprite>();
  const random = useRandom();

  yield view.add(
    <>
      <World ref={world}>
        <StaticBody restitution={1}>
          <PolygonCollider
            vertices={() => {
              const first = tex()
                .getOriginDelta(Origin.Left)
                .add(Vector2.left.scale(10));
              const second = first.add(Vector2.down.scale(15));
              const third = second.add(Vector2.right.scale(300));
              return [first, second, third];
            }}
          >
            <SimpleFormula ref={tex} height={180} />
          </PolygonCollider>
        </StaticBody>

        <StaticBody x={-960} restitution={0.85}>
          <CacheRectCollider>
            <Rect width={4} height={1080} />
          </CacheRectCollider>
        </StaticBody>

        <StaticBody position={[-560, 540]} restitution={0.6}>
          <CacheRectCollider>
            <Rect height={4} width={600} />
          </CacheRectCollider>
        </StaticBody>

        <KinematicBody
          mass={3}
          restitution={0.9}
          position={[-500, -700]}
          angularVelocity={-4}
        >
          <CacheRectCollider expand={32}>
            <Img src={justGoboSprite} scale={8} smoothing={false} />
          </CacheRectCollider>
        </KinematicBody>
      </World>

      <Blood ref={blood} scale={3} position={[500, -120]} opacity={0} />
    </>,
  );

  yield world().simulate(Infinity);

  yield* waitUntil('blood');
  blood().opacity(1);
  yield* blood().playOnce('default');

  yield* waitUntil('blood 2');
  blood().position([random.nextInt(-600, 600), random.nextInt(-400, 400)]);
  yield* blood().playOnce('default');

  yield* waitUntil('blood 3');
  blood().position([random.nextInt(-600, 600), random.nextInt(-400, 400)]);
  yield* blood().playOnce('default');

  yield* waitUntil('scene end');
});
import {
  CacheRectCollider,
  KinematicBody,
  KinematicBodyProps,
  World,
} from '@ksassnowski/motion-canvas-components';

import { makeScene2D } from '@motion-canvas/2d';
import { Img } from '@motion-canvas/2d/lib/components';
import { waitUntil } from '@motion-canvas/core/lib/flow';
import { fadeTransition } from '@motion-canvas/core/lib/transitions';
import { PossibleVector2 } from '@motion-canvas/core/lib/types';
import { createRef, range } from '@motion-canvas/core/lib/utils';

import justGobo from '../assets/just_gobo.png';

const Goblin = ({
  imgScale = [-6, 6],
  expandCollider = 25,
  ...rest
}: KinematicBodyProps & {
  imgScale?: PossibleVector2;
  expandCollider?: number;
}) => (
  <KinematicBody mass={0.5} restitution={1} {...rest}>
    <CacheRectCollider expand={expandCollider}>
      <Img src={justGobo} scale={imgScale} smoothing={false} />
    </CacheRectCollider>
  </KinematicBody>
);

export default makeScene2D(function* (view) {
  const world = createRef<World>();

  yield view.add(
    <World ref={world} gravity={0}>
      <Goblin
        rotation={90}
        x={-1050}
        linearVelocity={[2300, 0]}
        mass={5}
        imgScale={12}
        expandCollider={42}
      />

      <Goblin
        rotation={-90}
        x={1050}
        linearVelocity={[-2300, 0]}
        mass={6}
        imgScale={[-12, 12]}
        expandCollider={42}
      />

      {range(3).flatMap((i) =>
        range(3).map((j) => <Goblin position={[-60 + 60 * j, -60 + 60 * i]} />),
      )}
    </World>,
  );

  yield* fadeTransition(1);

  yield* waitUntil('start simulation');
  yield world().simulate(Infinity);

  yield* waitUntil('scene end');
});
import { CameraView } from '@ksassnowski/motion-canvas-camera';

import { makeScene2D } from '@motion-canvas/2d';
import { Img, Node, Txt } from '@motion-canvas/2d/lib/components';
import {
  CodeBlock,
  edit,
  lines,
} from '@motion-canvas/2d/lib/components/CodeBlock';
import {
  all,
  chain,
  delay,
  loop,
  sequence,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow';
import { DEFAULT } from '@motion-canvas/core/lib/signals';
import { ThreadGenerator, cancel } from '@motion-canvas/core/lib/threading';
import {
  easeInBack,
  easeInQuint,
  easeOutBack,
  easeOutCubic,
  linear,
} from '@motion-canvas/core/lib/tweening';
import { BBox, Vector2 } from '@motion-canvas/core/lib/types';
import {
  createRef,
  makeRef,
  range,
  useRandom,
} from '@motion-canvas/core/lib/utils';

import { typewrite } from '@common/utils';

import theme from '@theme';

import drinkSprite from '../assets/drink_sprite.png';
import dungeonSprite from '../assets/dungeon.png';
import {
  AnimatedSprite,
  Blood,
  Goblin,
  Hero,
  Spear,
  Torch,
} from '../components';

export default makeScene2D(function* (view) {
  const camera = createRef<CameraView>();
  const gameScene = createRef<Node>();
  const blood = createRef<AnimatedSprite>();
  const goblin = createRef<AnimatedSprite>();
  const heroine = createRef<AnimatedSprite>();
  const torches: AnimatedSprite[] = [];
  const spear = createRef<Img>();
  const drink = createRef<Img>();
  const code = createRef<CodeBlock>();
  const questionMarks = createRef<Node>();
  const title = createRef<Txt>();

  let heroineAnimation: ThreadGenerator | null;
  let goblinAnimation: ThreadGenerator | null;

  function* showSpear() {
    yield* spear().scale(8, 0.2);
  }

  function* hideSpear(duration = 0.2) {
    yield* spear().scale(0, duration);
  }

  function* attack(times: number) {
    for (let i = 0; i < times; i++) {
      yield* all(
        heroine().playOnce('attack'),
        chain(
          spear().position.x(30, 0.05),
          waitFor(0.4),
          spear().position.x(95, 0.3),
        ),
        chain(blood().scale([-3, 3], 0), blood().playOnce('default')),
      );
      yield* waitFor(times > 1 ? 0.1 : 0);
    }
  }

  yield view.add(
    <>
      <CameraView ref={camera} width={'100%'} height={'100%'}>
        <Node ref={gameScene}>
          <Img src={dungeonSprite} scale={8} y={52} smoothing={false} />

          {range(0, 3).map((i) => (
            <Torch
              ref={makeRef(torches, i)}
              position={[-640 + 640 * i, -348]}
              scale={8}
            />
          ))}

          <Blood
            ref={blood}
            scale={0}
            position={() => goblin().position().sub([50, 0])}
            zIndex={1}
          />
          <Goblin ref={goblin} position={[-770, 160]} scale={0} />
          <Hero ref={heroine} position={[770, 160]} scale={0} />
          <Spear
            ref={spear}
            scale={0}
            position={() => [100, heroine().position.y() + 25]}
          />

          <Img
            ref={drink}
            src={drinkSprite}
            smoothing={false}
            position={() => heroine().position().add([-60, 10])}
            scale={0}
          />
        </Node>

        <CodeBlock
          ref={code}
          code={`
        const effect = new BloodSpatter();
        effect.position = goblinSprite.position;
        scene.add(effect);`}
          lineHeight={'160%'}
          fontFamily={theme.fonts.mono}
          opacity={0}
          y={-200}
        />

        <Node
          ref={questionMarks}
          position={() => heroine().position().add([0, -120])}
        >
          {range(3).map((i) => (
            <Txt
              fontFamily={theme.fonts.pixel}
              fill={theme.colors.White}
              fontSize={110}
              text={'?'}
              rotation={-40 + 40 * i}
              x={-90 + 90 * i}
              y={i !== 1 ? 40 : 0}
              scale={0}
            />
          ))}
        </Node>
      </CameraView>
      <Txt
        ref={title}
        fontFamily={theme.fonts.serif}
        fontSize={96}
        fontWeight={600}
        fill={theme.colors.White}
        text={'Coordinate Spaces'}
        opacity={0}
      />
    </>,
  );

  camera().clip(false);
  yield all(...torches.map((torch) => torch.loop('default')));
  goblinAnimation = yield goblin().loop('walk');
  heroineAnimation = yield heroine().loop('walk');

  yield* waitUntil('enter heroine');
  heroine().scale([-8, 8]);
  yield* heroine().position.x(128, 1.6, linear);
  cancel(heroineAnimation);
  heroineAnimation = yield heroine().loop('idle');

  yield* waitUntil('enter goblin');
  goblin().scale(8);
  yield* goblin().position.x(-72, 1.6, linear);
  cancel(goblinAnimation);
  goblinAnimation = yield goblin().loop('idle');

  yield* waitUntil('attack 1');
  yield* showSpear();
  yield* waitFor(0.2);
  cancel(heroineAnimation);
  yield* attack(6);
  heroineAnimation = yield heroine().loop('idle');
  yield* waitFor(0.2);
  yield* hideSpear();

  yield* waitUntil('show code 1');
  gameScene().save();
  yield* sequence(
    0.4,
    gameScene().position.y(700, 1),
    all(code().position.y(-100, 1, easeOutCubic), code().opacity(1, 1)),
  );

  yield* waitUntil('highlight code 1');
  yield* code().selection(lines(0), 0.5);

  yield* waitUntil('highlight code 2');
  yield* code().selection(lines(1), 0.6);

  yield* waitUntil('highlight code 3');
  yield* code().selection(lines(2), 0.6);

  yield* waitUntil('highlight code 4');
  yield* code().selection(DEFAULT, 0.4);

  yield* waitUntil('hide code 2');
  yield* all(
    code().opacity(0, 0.8),
    code().position.y(-300, 0.9),
    gameScene().restore(1.2),
  );

  yield* waitUntil('attack 2');
  cancel(heroineAnimation);
  blood().absolutePosition(Vector2.zero);
  yield* showSpear();
  yield* waitFor(0.2);
  const stab = yield attack(Infinity);

  yield* waitUntil('comedic zoom');
  camera().save();
  yield* camera().zoomOnto(
    BBox.fromPoints(new Vector2(-700, -400), new Vector2(0, 0)),
    0,
  );

  yield* waitUntil('restore camera');
  cancel(stab, heroineAnimation);
  heroineAnimation = yield heroine().loop('idle');
  yield* all(hideSpear(0), camera().restore(0));

  yield* waitUntil('comedic zoom 2');
  const zoomPosition = new BBox(
    heroine()
      .absolutePosition()
      .transformAsPoint(camera().worldToLocal())
      .add([0, 50]),
    heroine().size(),
  );
  camera().save();
  yield* camera().zoomOnto(zoomPosition, 0, 250);

  yield* waitUntil('comedic zoom 3');
  yield* camera().zoomOnto(zoomPosition, 0, 120);

  yield* waitUntil('restore camera 2');
  yield* camera().restore(0);

  yield* waitUntil('show code 2');
  gameScene().save();
  code().save();
  yield* sequence(
    0.4,
    gameScene().position.y(700, 1),
    all(code().position.y(-100, 1, easeOutCubic), code().opacity(1, 1)),
  );

  yield* waitUntil('change code 1');
  yield* code().edit(1.8)`
const effect = new BloodSpatter();
${edit(
  `effect.position`,
  `effect.globalPosition`,
)} = ${edit(`goblinSprite.position`, `goblinSprite.globalPosition`)};
scene.add(effect);`;

  yield* waitUntil('change code 2');
  yield* sequence(
    0.5,
    code().edit(1.8)`
const effect = new BloodSpatter();
${edit(
  `effect.globalPosition = goblinSprite.globalPosition;`,
  `const position = goblinSprite.parent().localToWorld(
  goblinSprite.position,
);
effect.position = position;`,
)}
scene.add(effect);`,
  );

  yield* waitUntil('change code 3');
  yield* code().edit(1.8, false)`
const effect = new BloodSpatter();
const position = goblinSprite.parent().${edit(`localToWorld`, `localToParent`)}(
  goblinSprite.position,
);
effect.position = position;
scene.add(effect);`;

  yield* waitUntil('hide code 3');
  yield* all(
    code().opacity(0, 0.8),
    code().position.y(-500, 1.1),
    gameScene().restore(1.2),
  );

  yield* waitUntil('show question marks');
  yield* sequence(
    0.1,
    ...questionMarks()
      .children()
      .map((child) => child.scale(1, 0.3, easeOutBack)),
  );

  yield* waitUntil('hide question marks');
  yield* sequence(
    0.08,
    ...questionMarks()
      .children()
      .reverse()
      .map((child) => child.scale(0, 0.3, easeInBack)),
  );

  yield* waitUntil('show spear');
  yield* showSpear();

  yield* waitUntil('random blood');
  const random = useRandom();
  cancel(heroineAnimation);
  yield* loop(3, () => {
    const position = new Vector2(
      random.nextInt(-800, 800),
      random.nextInt(-500, 500),
    );

    blood().position(position);
    return all(blood().playOnce('default'), attack(1));
  });
  yield* hideSpear();
  cancel(heroineAnimation);
  heroineAnimation = yield heroine().loop('idle');

  yield* waitUntil('show drink');
  yield camera().centerOn(goblin(), 4, linear);
  yield* drink().scale(5.5, 0.3, easeOutBack);

  yield* waitUntil('sit down');
  cancel(heroineAnimation);
  heroineAnimation = yield heroine().loop('walk');
  yield* heroine().position.x(goblin().position.x(), 0.5, linear);
  cancel(heroineAnimation, goblinAnimation);
  yield* waitFor(0.2);
  heroine().frame(2);
  drink().position(heroine().position().add([-50, 40]));
  blood()
    .zIndex(0)
    .scale([-3.5, 3.5])
    .rotation(80)
    .position(goblin().position().add([25, -10]));
  goblin().remove();
  yield blood().playOnce('stain');

  yield* waitUntil('drink');
  yield loop(Infinity, () => {
    return chain(
      all(
        drink().rotation(40, 0.6),
        drink().position(heroine().position().add([-40, 30]), 0.6),
      ),
      waitFor(0.7),
      all(
        drink().rotation(0, 0.6),
        drink().position(heroine().position().add([-50, 50]), 0.6),
      ),
      waitFor(1),
    );
  });

  yield* waitUntil('show title');
  yield* all(
    camera().zoom(30, 10, easeInQuint),
    delay(9, all(title().opacity(1, 0), typewrite(title(), 2))),
    delay(4, gameScene().opacity(0, 6, linear)),
  );

  yield* waitUntil('scale title');
  yield* title().scale(300, 2.4);

  yield* waitUntil('scene end');
});
import { SurroundingRectangle } from '@ksassnowski/motion-canvas-components';

import {
  Circle,
  Latex,
  Layout,
  LayoutProps,
  Node,
  Polygon,
  Ray,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  DEFAULT,
  Direction,
  PossibleColor,
  ThreadGenerator,
  Vector2,
  all,
  chain,
  createRef,
  delay,
  easeInBack,
  easeInOutCubic,
  easeOutBack,
  loop,
  sequence,
  slideTransition,
  waitFor,
  waitUntil,
} from '@motion-canvas/core';

import {
  createPolarLerp,
  rotatePoint,
  texColor,
  translate,
  typewrite,
} from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  Grid,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  Vector,
  localToParentTex,
  rotationMatrixTex,
  scalingMatrixTex,
  translationMatrixTex,
} from '../components';
import { swapNodes } from '../utils';

export default makeScene2D(function* (view) {
  const localToParentMatrix = createRef<Latex>();
  const matrixLabel = createRef<Txt>();
  const matrixContainer = createRef<Layout>();
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();
  const circleGrid = createRef<Grid>();
  const rectGrid = createRef<Grid>();
  const localPositionVector = createRef<Ray>();
  const localPosCoordinates = createRef<Coordinates>();
  const parentPositionVector = createRef<Ray>();
  const parentPosCoordinates = createRef<Coordinates>();
  const highlightRect = createRef<SurroundingRectangle>();
  const scalingMatrix = createRef<Layout>();
  const rotationMatrix = createRef<Layout>();
  const translationMatrix = createRef<Layout>();
  const polygon = createRef<Polygon>();
  const polygonLocalPositionVector = createRef<Ray>();
  const polygonLocalCoordinates = createRef<Coordinates>();
  const polygonParentPositionVector = createRef<Ray>();
  const polygonParentPosCoordinates = createRef<Coordinates>();
  const polygonWorldPositionVector = createRef<Ray>();
  const polygonWorldPosCoordinates = createRef<Coordinates>();
  const polygonLocalToWorld = createRef<Layout>();
  const circleLocalToWorld = createRef<Layout>();
  const rectLocalToWorld = createRef<Layout>();
  const matrixNameContainer = createRef<Layout>();

  const sceneTree = (<RectCircleSceneTree />) as SceneTree;

  function MatrixName({
    icon,
    text,
    color = theme.colors.White,
    ...rest
  }: LayoutProps & { icon?: Node; text: string; color?: PossibleColor }) {
    return (
      <Layout
        fontSize={42}
        fontFamily={theme.fonts.mono}
        alignItems={'center'}
        gap={16}
        layout
        {...rest}
      >
        {icon}
        <Txt text={text} fill={color} />
      </Layout>
    );
  }

  function CircleIcon() {
    return (
      <Circle
        size={30}
        fill={theme.colors.Red}
        lineWidth={8}
        stroke={`${theme.colors.Red}88`}
      />
    );
  }

  function RectIcon() {
    return (
      <Rect
        size={30}
        fill={theme.colors.Blue1}
        lineWidth={8}
        stroke={`${theme.colors.Blue1}88`}
        radius={8}
        smoothCorners
      />
    );
  }

  function showParentSpace() {
    return sequence(
      0.7,
      all(
        scene().labelText('', 0.5).wait(0.1).to('Parent Space', 0.5),
        delay(0.6, scene().labelColor(theme.colors.Brown2, 0)),
        rectGrid().opacity(0.3, 0.7),
      ),
      all(
        scene().gridStroke('#524539', 0.6),
        scene().axisStroke('#7e6143', 0.6),
      ),
    );
  }

  function showLocalSpace(extraAnimations: ThreadGenerator[] = []) {
    return sequence(
      0.6,
      all(
        scene().labelText('', 0.5).wait(0.1).to('Local Space', 0.5),
        delay(0.6, scene().labelColor(theme.colors.Blue1, 0)),
        scene().gridStroke(DEFAULT, 0.5),
        scene().axisStroke(DEFAULT, 0.5),
        ...extraAnimations,
      ),
      rectGrid().opacity(1, 0.7),
    );
  }

  yield view.add(
    <>
      <Txt
        ref={matrixLabel}
        fontFamily={theme.fonts.mono}
        text={''}
        fill={theme.colors.Green1}
        fontSize={72}
        y={-300}
      />

      <Latex
        ref={localToParentMatrix}
        tex={texColor(localToParentTex, theme.colors.White)}
        height={280}
      />

      <Layout
        ref={matrixContainer}
        alignItems={'center'}
        y={-390}
        scale={0}
        layout
      >
        <Latex
          ref={translationMatrix}
          tex={texColor(translationMatrixTex, theme.colors.White)}
          height={200}
        />
        <Latex
          ref={rotationMatrix}
          tex={texColor(rotationMatrixTex, theme.colors.White)}
          height={200}
        />
        <Latex
          ref={scalingMatrix}
          tex={texColor(scalingMatrixTex, theme.colors.White)}
          height={200}
        />
      </Layout>

      <Layout
        ref={matrixNameContainer}
        direction={'column'}
        y={-380}
        gap={32}
        layout
      >
        <Layout
          ref={polygonLocalToWorld}
          alignItems={'center'}
          gap={32}
          scale={0}
        >
          <MatrixName
            icon={
              <Polygon
                sides={5}
                fill={theme.colors.Green2}
                lineWidth={8}
                stroke={`${theme.colors.Green2}88`}
                size={30}
              />
            }
            text={'LocalToWorld'}
            color={theme.colors.Brown2}
          />

          <Txt
            text={'='}
            fontSize={42}
            fontFamily={theme.fonts.mono}
            fill={theme.colors.White}
          />

          <MatrixName text={'LocalToParent'} icon={<RectIcon />} />

          <MatrixName text={'LocalToParent'} icon={<CircleIcon />} />
        </Layout>

        <Layout
          ref={circleLocalToWorld}
          alignItems={'center'}
          gap={32}
          scale={0}
        >
          <MatrixName
            icon={<CircleIcon />}
            text={'LocalToWorld'}
            color={theme.colors.Brown2}
          />

          <Txt
            text={'='}
            fontSize={42}
            fontFamily={theme.fonts.mono}
            fill={theme.colors.White}
          />

          <MatrixName text={'LocalToParent'} icon={<RectIcon />} />
        </Layout>

        <Layout ref={rectLocalToWorld} alignItems={'center'} gap={32} scale={0}>
          <MatrixName
            icon={<RectIcon />}
            text={'LocalToWorld'}
            color={theme.colors.Brown2}
          />

          <Txt
            text={'='}
            fontSize={42}
            fontFamily={theme.fonts.mono}
            fill={theme.colors.White}
          />

          <MatrixName text={'Identity Matrix'} />
        </Layout>
      </Layout>

      <SceneContainer
        ref={scene}
        sceneTree={sceneTree}
        labelText={'Local Space'}
        labelColor={theme.colors.Blue1}
        labelScale={0}
        scale={0}
        height={700}
        y={120}
        showAxis
      >
        <Grid
          ref={rectGrid}
          width={1500}
          height={1700}
          spacing={() => new Vector2(50).mul(rect().scale())}
          rotation={() => rect().rotation()}
          position={() => rect().position()}
          axisStroke={'#63878f'}
          stroke={'#51666c'}
          end={0.5}
          start={0.5}
        />

        <Grid
          ref={circleGrid}
          width={1500}
          height={1700}
          spacing={() =>
            new Vector2(50).mul(rect().scale().mul(circle().scale()))
          }
          rotation={() => circle().absoluteRotation()}
          position={() =>
            circle().position().transformAsPoint(rect().localToParent())
          }
          axisStroke={'#814a4a'}
          stroke={'#574242'}
          start={0.5}
          end={0.5}
        />

        <RectObject
          ref={rect}
          rotation={45}
          scale={1.25}
          position={[-200, 100]}
        >
          <CircleObject ref={circle} position={[300, -200]}>
            <Polygon
              ref={polygon}
              sides={5}
              fill={theme.colors.Green2}
              size={60}
              position={-200}
              scale={0}
            />
          </CircleObject>
        </RectObject>

        <Vector
          ref={localPositionVector}
          from={() => rect().position()}
          to={() =>
            new Vector2(300, -200).transformAsPoint(rect().localToParent())
          }
          end={0}
        />

        <Vector
          ref={parentPositionVector}
          to={() =>
            circle().position().transformAsPoint(rect().localToParent())
          }
          stroke={theme.colors.Green1}
          end={0}
        />

        <Vector
          ref={polygonLocalPositionVector}
          from={() =>
            circle().position().transformAsPoint(rect().localToParent())
          }
          to={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
          }
          stroke={theme.colors.White}
          end={0}
        />

        <Vector
          ref={polygonParentPositionVector}
          from={() => rect().position()}
          to={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
          }
          stroke={theme.colors.White}
          end={0}
        />

        <Vector
          ref={polygonWorldPositionVector}
          to={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
          }
          stroke={theme.colors.Green1}
          end={0}
        />

        <Coordinates
          ref={polygonLocalCoordinates}
          coordinates={() => polygon().position()}
          xColor={theme.colors.Red}
          yColor={theme.colors.Red}
          position={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
              .add(Vector2.down.scale(65))
          }
          scale={0}
        />

        <Coordinates
          ref={polygonParentPosCoordinates}
          coordinates={() =>
            polygon().position().transformAsPoint(circle().localToParent())
          }
          xColor={theme.colors.Blue1}
          yColor={theme.colors.Blue1}
          left={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
              .add(Vector2.right.scale(50))
          }
          scale={0}
        />

        <Coordinates
          ref={polygonWorldPosCoordinates}
          coordinates={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
          }
          right={() =>
            polygon()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
              .add(Vector2.left.scale(50))
          }
          scale={0}
        />

        <Coordinates
          ref={localPosCoordinates}
          coordinates={[300, -200]}
          xColor={theme.colors.Blue1}
          yColor={theme.colors.Blue1}
          scale={0}
          position={() =>
            circle()
              .position()
              .transformAsPoint(rect().localToParent())
              .add(Vector2.up.scale(70))
          }
        />

        <Coordinates
          ref={parentPosCoordinates}
          coordinates={() =>
            circle().position().transformAsPoint(rect().localToParent())
          }
          xColor={theme.colors.Brown2}
          yColor={theme.colors.Brown2}
          scale={0}
          position={() =>
            circle()
              .position()
              .transformAsPoint(rect().localToParent())
              .add(Vector2.down.scale(70))
          }
        />
      </SceneContainer>

      <SurroundingRectangle
        ref={highlightRect}
        stroke={theme.colors.Green1}
        fill={`${theme.colors.Green1}31`}
        lineWidth={4}
        buffer={[0, 26]}
        radius={8}
        zIndex={-1}
        nodes={() => rotationMatrix()}
        scale={0}
        smoothCorners
      />
    </>,
  );

  yield* slideTransition(Direction.Right, 0.7);

  yield* waitUntil('show label');
  matrixLabel().text('LocalToParent');
  yield* typewrite(matrixLabel(), 0.8);

  yield* waitUntil('show scene');
  yield* sequence(
    0.4,
    all(
      matrixLabel().position.y(-800, 0.7),
      localToParentMatrix().height(200, 0.8),
      localToParentMatrix().position.y(-390, 0.8),
    ),
    scene().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show local space');
  yield* all(
    rectGrid().start(0, 0.7),
    rectGrid().end(1, 0.7),
    scene().labelScale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show local vec');
  yield* localPositionVector().end(1, 0.7);
  yield* localPosCoordinates().show();

  yield* waitUntil('show parent space');
  yield* sequence(
    0.6,
    showParentSpace(),
    sequence(
      0.3,
      parentPositionVector().end(1, 0.7),
      parentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show local space 2');
  yield* all(
    showLocalSpace(),
    parentPositionVector().end(0, 0.6),
    parentPosCoordinates().hide(),
    delay(0.5, sceneTree.highlightNode('rect', 0.7, theme.colors.Blue1)),
  );

  yield* waitUntil('move up level');
  yield* sequence(
    0.55,
    all(
      showParentSpace(),
      localPositionVector().end(0, 0.5),
      localPosCoordinates().hide(),
      sceneTree.highlightNode('root', 0.6, theme.colors.Brown3),
    ),
    sequence(
      0.4,
      parentPositionVector().end(1, 0.6),
      parentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show local space 3');
  yield* all(
    showLocalSpace(),
    parentPositionVector().end(0, 0.6),
    parentPosCoordinates().hide(),
    sceneTree.resetHighlight(),
    delay(
      0.5,
      all(localPosCoordinates().show(), localPositionVector().end(1, 0.6)),
    ),
  );

  yield* waitUntil('show parent pos');
  yield* sequence(
    0.2,
    parentPositionVector().end(1, 0.7),
    parentPosCoordinates().show(),
  );

  yield* waitUntil('hide parent pos');
  localToParentMatrix().save();
  yield* all(
    parentPositionVector().end(0, 0.7),
    parentPosCoordinates().hide(),
    scene().position.y(0, 0.7),
    localToParentMatrix().position.y(-800, 0.7),
  );

  parentPosCoordinates()
    .position(localPosCoordinates().position())
    .coordinates([300, -200])
    .xColor(theme.colors.Blue1)
    .yColor(theme.colors.Blue1)
    .reparent(view);

  yield* waitUntil('move local pos');
  parentPosCoordinates().scale(1);
  yield* parentPosCoordinates().position([740, 0], 1);

  yield* waitUntil('show parent space 2');
  yield* showParentSpace();

  yield* waitUntil('show wrong pos');
  parentPositionVector().to([300, -200]);
  yield* all(
    parentPositionVector().end(1, 0.7),
    parentPosCoordinates().xColor(theme.colors.Brown2, 0.6),
    parentPosCoordinates().yColor(theme.colors.Brown2, 0.6),
    parentPosCoordinates().position(
      () => new Vector2(300, -230).transformAsPoint(scene().localToParent()),
      0.7,
    ),
  );

  yield* waitUntil('show matrix');
  yield* all(scene().position.y(120, 0.7), localToParentMatrix().restore(0.7));

  yield* waitUntil('decompose matrix');
  yield* swapNodes(localToParentMatrix(), matrixContainer());

  yield* waitUntil('highlight scaling');
  parentPosCoordinates().coordinates(() => parentPositionVector().to());
  yield* all(
    highlightRect().nodes(scalingMatrix, 0),
    highlightRect().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('scale pos');
  const scaledPos = parentPositionVector().to().mul(rect().scale());
  yield* all(
    parentPositionVector().to(scaledPos, 1),
    translate(parentPosCoordinates(), [-50, -20], 1),
  );

  yield* waitUntil('highlight local space');
  yield* showLocalSpace();

  yield* waitUntil('scale local space');
  parentPosCoordinates().right(() =>
    parentPositionVector()
      .to()
      .transformAsPoint(scene().localToParent())
      .add([-45, 0]),
  );
  yield* loop(2, () => {
    return chain(
      all(rect().scale(1, 1), parentPositionVector().to([300, -200], 1)),
      waitFor(0.2),
      all(rect().scale(1.25, 1), parentPositionVector().to(scaledPos, 1)),
      waitFor(0.5),
    );
  });

  yield* waitUntil('parent space');
  yield* all(showParentSpace(), highlightRect().nodes(rotationMatrix(), 0.7));

  yield* waitUntil('rotate pos');
  yield* parentPositionVector().to(
    rotatePoint(parentPositionVector().to(), rect().rotation()),
    1,
    easeInOutCubic,
    createPolarLerp(),
  );

  yield* waitUntil('highlight local space 2');
  yield* showLocalSpace();

  yield* waitUntil('rotate local');
  const rotatedPos = parentPositionVector().to();
  yield* loop(2, () => {
    return chain(
      all(
        rect().rotation(0, 1.2),
        parentPositionVector().to(
          scaledPos,
          1.2,
          easeInOutCubic,
          createPolarLerp(),
        ),
      ),
      waitFor(0.2),
      all(
        rect().rotation(45, 1.2),
        parentPositionVector().to(
          rotatedPos,
          1.2,
          easeInOutCubic,
          createPolarLerp(),
        ),
      ),
      waitFor(0.5),
    );
  });

  yield* waitUntil('parent space 2');
  yield* all(
    showParentSpace(),
    highlightRect().nodes(translationMatrix(), 0.7),
  );

  yield* waitUntil('translate pos');
  yield* all(
    parentPositionVector().to(
      () => circle().position().transformAsPoint(rect().localToParent()),
      1,
    ),
    parentPosCoordinates().position(
      () =>
        circle()
          .absolutePosition()
          .transformAsPoint(view.worldToLocal())
          .add([0, -70]),
      0.7,
    ),
  );

  yield* waitUntil('highlight local space 3');
  yield* showLocalSpace();

  yield* waitUntil('translate local');
  yield* loop(2, () =>
    rect().position(0, 1).wait(0.2).to([-200, 100], 1).wait(0.5),
  );

  yield* waitUntil('parent space 3');
  yield* all(
    showParentSpace(),
    highlightRect().scale(0, 0.6, easeInBack),
    swapNodes(matrixContainer(), localToParentMatrix()),
  );

  yield* waitUntil('center matrix');
  localToParentMatrix().width(DEFAULT);
  yield* all(
    scene().position.y(1000, 0.7),
    localToParentMatrix().position.y(0, 0.7),
    localToParentMatrix().height(280, 0.7),
  );

  yield* waitUntil('show label 2');
  yield* matrixLabel().position.y(-300, 0.9);
  parentPosCoordinates().scale(0);
  parentPositionVector().end(0);

  yield* waitUntil('show scene 2');
  yield* all(
    scene().position.y(0, 0.7),
    matrixLabel().position.y(-1000, 0.7),
    localToParentMatrix().position.y(-700, 0.7),
  );
  yield* showLocalSpace();

  yield* waitUntil('show highlight');
  yield* sceneTree.highlightNode('rect', 0.7, theme.colors.Blue1);

  yield* waitUntil('show parent 4');
  yield* sequence(
    0.6,
    all(
      showParentSpace(),
      localPositionVector().end(0, 0.7),
      localPosCoordinates().hide(),
      sceneTree.highlightNode('root', 0.7, theme.colors.Brown3),
    ),
    sequence(
      0.3,
      parentPositionVector().end(1, 0.7),
      parentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show local 4');
  yield* sequence(
    0.6,
    all(
      showLocalSpace(),
      parentPositionVector().end(0, 0.7),
      parentPosCoordinates().hide(),
      sceneTree.highlightNode('rect', 0.7, theme.colors.Blue1),
    ),
    sequence(
      0.3,
      localPositionVector().end(1, 0.7),
      localPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show parent 5');
  yield* sequence(
    0.6,
    all(
      showParentSpace(),
      localPositionVector().end(0, 0.7),
      localPosCoordinates().hide(),
      sceneTree.highlightNode('root', 0.7, theme.colors.Brown3),
    ),
    sequence(
      0.3,
      parentPositionVector().end(1, 0.7),
      parentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('reset scene');
  yield* all(
    sceneTree.resetHighlight(),
    scene().labelScale(0, 0.7, easeInBack),
    scene().gridStroke(DEFAULT, 0.7),
    scene().axisStroke(DEFAULT, 0.7),
    rectGrid().end(0.5, 0.7),
    rectGrid().start(0.5, 0.7),
    parentPositionVector().end(0, 0.7),
    parentPosCoordinates().hide(),
  );

  yield* waitUntil('show polygon');
  yield* all(
    polygon().scale(1, 0.6, easeOutBack),
    sceneTree.insertObject(
      {
        id: 'polygon',
        label: 'Polygon',
        icon: (
          <Polygon
            sides={5}
            fill={theme.colors.Green2}
            size={10}
            lineWidth={3}
            stroke={`${theme.colors.Green2}88`}
          />
        ),
      },
      2,
    ),
  );

  yield* waitUntil('show circle grid');
  yield* all(
    circleGrid().start(0, 0.7),
    circleGrid().end(1, 0.7),
    sceneTree.highlightNode('circle', 0.7, theme.colors.Red),
    sequence(
      0.4,
      polygonLocalPositionVector().end(1, 0.7),
      polygonLocalCoordinates().show(),
    ),
  );

  yield* waitUntil('show rect local');
  rectGrid().opacity(1);
  yield* circleGrid().opacity(0.3, 0.8);
  yield* all(
    rectGrid().end(1, 0.7),
    rectGrid().start(0, 0.7),
    sceneTree.highlightNode('rect', 0.7, theme.colors.Blue1),
    polygonLocalPositionVector().opacity(0.3, 0.6),
    polygonLocalCoordinates().opacity(0.3, 0.6),
    sequence(
      0.4,
      polygonParentPositionVector().end(1, 0.7),
      polygonParentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show world space');
  yield* all(rectGrid().opacity(0.1, 0.7), circleGrid().opacity(0.1, 0.7));
  yield* all(
    sceneTree.highlightNode('root', 0.8, theme.colors.Green1),
    polygonParentPosCoordinates().opacity(0.3, 0.6),
    polygonParentPositionVector().opacity(0.3, 0.6),
    sequence(
      0.4,
      polygonWorldPositionVector().end(1, 0.7),
      polygonWorldPosCoordinates().show(),
    ),
  );

  yield* waitUntil('move scene');
  yield* all(scene().position.y(130, 0.9), sceneTree.resetHighlight());

  yield* waitUntil('poly local to world');
  yield* polygonLocalToWorld().scale(1, 0.7, easeOutBack);

  yield* waitUntil('circle local to world');
  yield* circleLocalToWorld().scale(1, 0.7, easeOutBack);

  yield* waitUntil('rect local to world');
  yield* rectLocalToWorld().scale(1, 0.7, easeOutBack);

  yield* waitUntil('reset scene 2');
  yield* all(
    matrixNameContainer().position.y(-700, 0.7),
    scene().position.y(0, 0.7),
    polygonWorldPositionVector().end(0, 0.7),
    polygonWorldPosCoordinates().hide(),
    polygonParentPositionVector().end(0, 0.7),
    polygonParentPosCoordinates().hide(),
    polygonLocalPositionVector().end(0, 0.7),
    polygonLocalCoordinates().hide(),
    circleGrid().end(0.5, 0.7),
    circleGrid().start(0.5, 0.7),
    rectGrid().start(0.5, 0.7),
    rectGrid().end(0.5, 0.7),
  );

  yield* waitUntil('show local space 4');
  circleGrid().opacity(1);
  rectGrid().opacity(1);
  polygonLocalPositionVector().opacity(1);
  polygonLocalCoordinates().opacity(1);
  polygonParentPositionVector().opacity(1);
  polygonParentPosCoordinates().opacity(1);
  yield* all(
    circleGrid().end(1, 0.7),
    circleGrid().start(0, 0.7),
    sceneTree.highlightNode('circle', 0.7, theme.colors.Red),
    sequence(
      0.4,
      polygonLocalPositionVector().end(1, 0.7),
      polygonLocalCoordinates().show(),
    ),
  );

  yield* waitUntil('show parent space 3');
  yield* all(
    polygonLocalPositionVector().end(0, 0.7),
    polygonLocalCoordinates().hide(),
    circleGrid().end(0.5, 0.7),
    circleGrid().start(0.5, 0.7),
    sceneTree.highlightNode('rect', 0.7, theme.colors.Blue1),
    highlightRect().nodes(sceneTree.getObject('rect'), 0.7),
    rectGrid().end(1, 0.7),
    rectGrid().start(0, 0.7),
    sequence(
      0.4,
      polygonParentPositionVector().end(1, 0.7),
      polygonParentPosCoordinates().show(),
    ),
  );

  yield* waitUntil('show local space 5');
  yield* all(
    polygonParentPositionVector().end(0, 0.7),
    polygonParentPosCoordinates().hide(),
    rectGrid().end(0.5, 0.7),
    rectGrid().start(0.5, 0.7),
    sceneTree.highlightNode('circle', 0.7, theme.colors.Red),
    circleGrid().end(1, 0.7),
    circleGrid().start(0, 0.7),
    sequence(
      0.4,
      polygonLocalPositionVector().end(1, 0.7),
      polygonLocalCoordinates().show(),
    ),
  );

  yield* waitUntil('move scene 2');
  localToParentMatrix()
    .tex(texColor(`${localToParentTex}^{-1}`, theme.colors.White))
    .height(200);
  yield* all(
    scene().position.y(120, 0.8),
    localToParentMatrix().position.y(-390, 0.8),
  );

  yield* waitUntil('move scene 3');
  yield* all(
    scene().position.y(0, 0.8),
    localToParentMatrix().position.y(-800, 0.8),
  );

  yield* waitUntil('hide scene');
  yield* all(scene().scale(0, 0.7, easeInBack), highlightRect().opacity(0, 0));

  yield* waitUntil('scene end');
});
import { SurroundingRectangle } from '@ksassnowski/motion-canvas-components';

import { makeScene2D } from '@motion-canvas/2d';
import {
  Circle,
  Latex,
  Line,
  Rect,
  RectProps,
} from '@motion-canvas/2d/lib/components';
import { all, sequence, waitUntil } from '@motion-canvas/core/lib/flow';
import { easeInBack, easeOutBack } from '@motion-canvas/core/lib/tweening';
import { createRef } from '@motion-canvas/core/lib/utils';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  Cursor,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  TranslationMatrixFormula,
  Vector,
} from '../components';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const rectPos = createRef<Coordinates>();
  const posHighlight = createRef<SurroundingRectangle>();
  const circle = createRef<Circle>();
  const circleRelativePos = createRef<Coordinates>();
  const circleAbsolutePos = createRef<Coordinates>();
  const formula = createRef<Latex>();
  const formulaHighlight = createRef<Rect>();
  const cursor = createRef<Cursor>();
  const localVector = createRef<Line>();

  const highlightRectStyles: RectProps = {
    lineWidth: 3,
    fill: `${theme.colors.Green1}33`,
    stroke: theme.colors.Green1,
    radius: 14,
    smoothCorners: true,
  };

  const sceneTree = (
    <RectCircleSceneTree position={[-370, -305]} />
  ) as SceneTree;

  yield view.add(
    <>
      <SceneContainer ref={scene} sceneTree={sceneTree} showAxis>
        <RectObject ref={rect} zIndex={1} scale={0} />

        <Coordinates
          ref={rectPos}
          coordinates={() => rect().position()}
          position={() => rect().position().add([0, 70])}
          scale={0}
          zIndex={1}
        />

        <CircleObject
          ref={circle}
          position={() => rect().position().add([300, -200])}
          zIndex={1}
          scale={0}
        />

        <Coordinates
          ref={circleAbsolutePos}
          scale={0}
          coordinates={() =>
            circle().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          position={() => circle().position().add([0, -60])}
        />

        <Coordinates
          ref={circleRelativePos}
          coordinates={() => circle().position().sub(rect().position())}
          position={() => circle().position().add([0, 60])}
          xColor={theme.colors.Gray1}
          yColor={theme.colors.Gray1}
          scale={0}
        />

        <Vector
          ref={localVector}
          from={() => rect().position()}
          to={() => circle().position()}
          zIndex={2}
          end={0}
        />

        <SurroundingRectangle
          ref={posHighlight}
          nodes={circleRelativePos()}
          scale={0}
          bufferY={10}
          {...highlightRectStyles}
        />
      </SceneContainer>

      <Rect
        ref={formulaHighlight}
        size={[45, 70]}
        position={[410, 0]}
        scale={0}
        {...highlightRectStyles}
      />
      <TranslationMatrixFormula ref={formula} scale={0} x={550} width={700} />

      <Cursor ref={cursor} position={[150, 100]} scale={0} />
    </>,
  );

  yield* scene().scale(0).scale(1, 0.6, easeOutBack);

  yield* waitUntil('show objects');
  yield* sequence(
    0.1,
    rect().scale(1, 0.7, easeOutBack),
    rectPos().show(),
    circle().scale(1, 0.7, easeOutBack),
    circleAbsolutePos().show(),
  );

  yield* waitUntil('show relative pos');
  yield* sequence(
    0.1,
    circleRelativePos().show(),
    posHighlight().scale(1, 0.6),
  );

  yield* waitUntil('show cursor');
  yield* cursor().show();

  yield* waitUntil('cursor to rect');
  yield* cursor().moveToPosition(rect(), 0.7);

  yield* waitUntil('move rect');
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-200, 200],
      [-250, -50],
      [50, 50],
    ],
    1,
  );
  yield* cursor().hide();

  yield* waitUntil('show formula');
  yield* sequence(
    0.45,
    scene().position.x(-350, 0.8),
    formula().scale(1, 0.6, easeOutBack),
  );

  yield* waitUntil('highlight P');
  cursor().position([-100, 120]);
  yield* all(
    formulaHighlight().scale(1, 0.7, easeOutBack),
    posHighlight().nodes(rectPos(), 0.7),
    cursor().show(),
  );

  yield* waitUntil('move rect 2');
  yield* cursor().moveToPosition(rect(), 0.6);
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-300, -100],
      [-500, 0],
    ],
    0.8,
  );
  yield* cursor().hide();

  yield* waitUntil('hide highlights');
  yield* all(formulaHighlight().scale(0, 0.7), posHighlight().scale(0, 0.7));

  yield* waitUntil('show local vector');
  yield* sequence(
    0.15,
    circleRelativePos().position(
      () => localVector().getPointAtPercentage(0.65).position.add([-120, 0]),
      0.8,
    ),
    localVector().end(1, 0.8),
  );

  yield* waitUntil('move rect 3');
  yield* cursor().show();
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-300, -100],
      [-250, 200],
      [-450, 250],
      [-400, -100],
      [-350, 0],
    ],
    0.8,
  );
  yield* cursor().hide();

  yield* waitUntil('hide absolute pos');
  yield* sequence(0.1, rectPos().hide(), circleAbsolutePos().hide());

  yield* waitUntil('cursor to circle');
  yield* cursor().show();
  yield* cursor().moveToPosition(circle(), 0.7);

  yield* waitUntil('move circle');
  yield* cursor().clickAndDrag(
    circle(),
    [
      [-500, -200],
      [-250, 100],
      [-50, -200],
    ],
    0.85,
  );
  yield* cursor().hide();

  yield* waitUntil('reset');
  yield* sequence(
    0.2,
    all(circleRelativePos().hide(), localVector().end(0, 0.7)),
    formula().scale(0, 0.6, easeInBack),
    scene().position.x(0, 0.8),
  );

  yield* waitUntil('hide scene');
  yield* scene().scale(0, 0.7, easeInBack);

  yield* waitUntil('scene end');
});
import {
  Circle,
  Latex,
  Layout,
  Line,
  Ray,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  Vector2,
  all,
  createRef,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';

import { texColor, translate } from '@common/utils';

import theme from '@theme';

import {
  SceneContainer,
  SceneContainerProps,
  SimpleFormula,
  TranslationMatrixFormula,
} from '../components';
import { swapNodes } from '../utils';

const matrix2x3aTex = `
\\begin{bmatrix}
a & b & c \\\\ 
d & e & f
\\end{bmatrix}
`;

const matrix2x3bTex = `
\\begin{bmatrix}
g & h & i \\\\ 
j & k & l
\\end{bmatrix}
`;

const resultMatrixTex = `
\\begin{bmatrix}
R_x + P_x \\\\
R_y + P_y \\\\
1
\\end{bmatrix}
`;

export default makeScene2D(function* (view) {
  const simpleFormula = createRef<Latex>();
  const matrixFormula = createRef<Latex>();
  const operatorTex = createRef<Latex>();
  const sceneLabelTex = createRef<Latex>();
  const sceneContainers = createRef<Layout>();
  const relativePosScene = createRef<SceneContainer>();
  const relativePosLine = createRef<Line>();
  const highlightRect = createRef<Rect>();
  const matrixLabel = createRef<Txt>();
  const matrix2x3a = createRef<Latex>();
  const matrix2x3b = createRef<Latex>();
  const resultMatrix = createRef<Latex>();
  const line = createRef<Ray>();
  const notDefinedText = createRef<Txt>();

  const position = Vector2.createSignal(0);
  const relativePosition = Vector2.createSignal([100, -50]);

  const sceneContainerStyles: SceneContainerProps = {
    gridSpacing: 25,
    lineWidth: 0,
    padding: 0,
    showAxis: true,
  };

  const showScenes = () =>
    sequence(
      0.08,
      ...sceneContainers()
        .children()
        .map((node) => node.scale(1, 1, easeOutBack)),
    );

  const hideScenes = () =>
    sequence(
      0.05,
      ...sceneContainers()
        .children()
        .map((node) => node.scale(0, 0.8, easeInBack)),
    );

  function* moveInput() {
    yield* position([50, 50], 1).to([-200, 0], 1).to([125, -40], 1);
    yield* relativePosition([-25, -125], 1).to([0, 125], 1).to([-150, -35], 1);
  }

  yield view.add(
    <>
      <SimpleFormula ref={simpleFormula} height={180} />

      <Txt
        ref={matrixLabel}
        text={'2D Transformation Matrix'}
        fontFamily={theme.fonts.mono}
        fill={theme.colors.Green1}
        position={[260, -230]}
        scale={0}
      />

      <Txt
        ref={notDefinedText}
        text={'Not defined'}
        fontFamily={theme.fonts.mono}
        fill={theme.colors.Red}
        fontSize={64}
        y={-230}
        scale={0}
      />

      <Rect
        ref={highlightRect}
        stroke={theme.colors.Green1}
        fill={`${theme.colors.Green1}31`}
        lineWidth={4}
        radius={8}
        zIndex={-1}
        x={257}
        size={[390, 320]}
        smoothCorners
        scale={0}
      />

      <Layout alignItems={'center'} layout>
        <Latex
          ref={matrix2x3a}
          tex={texColor(matrix2x3aTex, theme.colors.White)}
          height={0}
        />
        <Latex
          ref={matrix2x3b}
          tex={texColor(matrix2x3bTex, theme.colors.White)}
          height={0}
        />
      </Layout>

      <Latex
        ref={resultMatrix}
        tex={texColor(`= ${resultMatrixTex}`, theme.colors.White)}
        height={280}
        position={200}
        opacity={0}
      />

      <Ray
        ref={line}
        from={() => matrix2x3a().bottomLeft()}
        to={() => matrix2x3b().topRight()}
        lineWidth={16}
        stroke={theme.colors.Red}
        end={0}
      />

      <TranslationMatrixFormula
        ref={matrixFormula}
        height={280}
        position={() => simpleFormula().position().add([58, 0])}
        scale={0}
      />

      <Layout ref={sceneContainers} y={180} gap={60} layout>
        <Layout direction={'column'} gap={32} alignItems={'center'} scale={0}>
          <Latex tex={texColor('P', theme.colors.White)} height={40} />

          <SceneContainer width={500} height={375} {...sceneContainerStyles}>
            <Circle position={position} size={20} fill={theme.colors.Blue1} />
          </SceneContainer>
        </Layout>

        <Layout scale={0}>
          <Latex
            ref={operatorTex}
            tex={texColor('+', theme.colors.White)}
            width={40}
            y={35}
            layout={false}
          />
        </Layout>

        <Layout direction={'column'} gap={32} alignItems={'center'} scale={0}>
          <Latex
            ref={sceneLabelTex}
            tex={texColor('R', theme.colors.White)}
            height={40}
          />

          <SceneContainer
            ref={relativePosScene}
            width={500}
            height={375}
            {...sceneContainerStyles}
          >
            <Line
              ref={relativePosLine}
              points={() => [[0, 0], relativePosition()]}
              lineWidth={3}
              stroke={theme.colors.White}
              arrowSize={12}
              endArrow
            />
          </SceneContainer>
        </Layout>

        <Layout scale={0}>
          <Latex
            tex={texColor('=', theme.colors.White)}
            width={40}
            y={35}
            layout={false}
          />
        </Layout>

        <Layout direction={'column'} gap={32} alignItems={'center'} scale={0}>
          <Latex tex={texColor('P + R', theme.colors.White)} height={40} />

          <SceneContainer width={500} height={375} {...sceneContainerStyles}>
            <Circle
              size={20}
              fill={theme.colors.Red}
              position={() => position().add(relativePosition())}
            />
          </SceneContainer>
        </Layout>
      </Layout>
    </>,
  );

  yield* waitUntil('show scenes');
  yield* sequence(0.3, simpleFormula().position.y(-300, 0.8), showScenes());

  yield* waitUntil('move input');
  yield* moveInput();

  yield* waitUntil('hide scenes');
  yield* sequence(0.55, hideScenes(), simpleFormula().position.y(0, 1));

  yield* waitUntil('show matrix');
  yield* sequence(
    0.75,
    swapNodes(simpleFormula, matrixFormula),
    sequence(
      0.2,
      highlightRect().scale(1, 0.7, easeOutBack),
      matrixLabel().scale(1, 0.7, easeOutBack),
    ),
  );

  yield* waitUntil('show 2x3');
  yield* sequence(
    0.5,
    all(
      ...[matrixLabel(), matrixFormula(), highlightRect()].map((node) =>
        translate(node, [0, 800], 0.6),
      ),
    ),
    matrix2x3a().height(220, 0.7, easeOutBack),
  );
  matrixLabel().scale(0);

  yield* waitUntil('show 2x3 b');
  yield* matrix2x3b().height(220, 0.7, easeOutBack);

  yield* waitUntil('not defined');
  yield* all(
    line().end(1, 0.6),
    notDefinedText().scale(1, 0.7, easeOutBack),
    matrix2x3a().opacity(0.3, 0.7),
    matrix2x3b().opacity(0.3, 0.7),
  );

  yield* waitUntil('reset');
  highlightRect().scale(0);
  yield* sequence(
    0.3,
    all(
      line().end(0, 0.5),
      notDefinedText().scale(0, 0.5),
      matrix2x3a().height(0, 0.5),
      matrix2x3b().height(0, 0.5),
    ),
    all(
      ...[matrixLabel(), matrixFormula(), highlightRect()].map((node) =>
        translate(node, [0, -800], 0.6),
      ),
    ),
  );

  yield* waitUntil('highlight vector');
  highlightRect().width(180);
  highlightRect().position.x(565);
  yield* highlightRect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('highlight z');
  yield* all(
    highlightRect().size([74, 100], 0.7),
    highlightRect().position.y(100, 0.7),
  );

  yield* waitUntil('hide highlight');
  yield* highlightRect().scale(0, 0.6, easeInBack);

  yield* waitUntil('show result');
  yield* all(
    matrixFormula().position.y(-170, 0.7),
    resultMatrix().position.y(100, 0).to(170, 0.7),
    resultMatrix().opacity(1, 0.7),
  );

  yield* waitUntil('hide formula');
  yield* all(
    matrixFormula().scale(0, 0.7, easeInBack),
    resultMatrix().scale(0, 0.7, easeInBack),
  );
});
import { Circle, Ray, Rect, makeScene2D } from '@motion-canvas/2d';
import {
  DEFAULT,
  all,
  createRef,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  Grid,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  Transform,
  Vector,
} from '../components';

export default makeScene2D(function* (view) {
  const transform = createRef<Transform>();
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();
  const rectGrid = createRef<Grid>();
  const circleGrid = createRef<Grid>();
  const relativePosVector = createRef<Ray>();
  const absolutePosVector = createRef<Ray>();
  const circleLocalCoordinates = createRef<Coordinates>();
  const circleGlobalCoordinates = createRef<Coordinates>();

  const sceneTree = (<RectCircleSceneTree opacity={0} />) as SceneTree;

  view.add(
    <>
      <SceneContainer
        ref={scene}
        width={3000}
        height={2200}
        gridSpacing={120}
        showAxis
        position={[-300, 200]}
        gridEnd={0}
        axisLineWidth={6}
        sceneTree={sceneTree}
      >
        <Grid
          ref={rectGrid}
          spacing={50}
          axisStroke={'#63878f'}
          stroke={'#393f48'}
          position={() => rect().position()}
          width={'120%'}
          height={'120%'}
          end={0}
        />
        <Grid
          ref={circleGrid}
          position={() => circle().position()}
          spacing={50}
          axisStroke={'#6b4343'}
          stroke={'#574242'}
          width={'120%'}
          height={'120%'}
          end={0}
        />

        <RectObject ref={rect} scale={0} position={[-50, 150]} />
        <CircleObject ref={circle} position={[250, -100]} scale={0} />

        <Vector
          ref={relativePosVector}
          to={() => circle().position()}
          end={0}
        />

        <Vector
          ref={absolutePosVector}
          stroke={theme.colors.Green1}
          to={() => circle().position()}
          end={0}
        />

        <Coordinates
          ref={circleLocalCoordinates}
          coordinates={[250, -100]}
          xColor={theme.colors.Gray2}
          yColor={theme.colors.Gray2}
          left={() =>
            relativePosVector().getPointAtPercentage(0.3).position.add([60, 0])
          }
          scale={0}
        />

        <Coordinates
          ref={circleGlobalCoordinates}
          coordinates={() => circle().position()}
          bottom={() => circle().top().add([0, -10])}
          scale={0}
        />
      </SceneContainer>

      <Transform ref={transform} node={scene} end={0} />
    </>,
  );

  yield* waitUntil('show transform');
  yield* transform().end(1, 0.5);

  yield* waitUntil('scale transform');
  yield* transform().axisLength(120, 0.6);

  yield* waitUntil('rotate transform');
  yield* scene().rotation(-40, 0.6);

  yield* waitUntil('show grid');
  yield* scene().gridEnd(1, 2);

  yield* waitUntil('reset scene');
  yield* all(
    transform().end(0, 0.5),
    scene().gridSpacing(DEFAULT, 0.9),
    scene().axisLineWidth(DEFAULT, 0.9),
    scene().rotation(0, 0.9),
    scene().position(0, 0.9),
    scene().size([1000, 800], 0.8),
  );
  yield* sequence(
    0.1,
    rect().scale(1, 0.7, easeOutBack),
    circle().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show grids');
  yield* sequence(
    0.1,
    scene().gridEnd(0, 1),
    rectGrid().end(1, 1),
    circleGrid().end(1, 1),
  );

  yield* waitUntil('hide grids');
  yield* sequence(
    0.1,
    rectGrid().end(0, 1),
    circleGrid().end(0, 1),
    scene().gridEnd(1, 0.6),
  );

  yield* waitUntil('show tree');
  yield* sceneTree.create(0.6);

  yield* waitUntil('show pos');
  yield* sequence(
    0.2,
    relativePosVector().end(1, 0.7),
    circleLocalCoordinates().show(),
  );

  yield* waitUntil('move circle');
  yield* all(
    relativePosVector().from(rect().position, 1),
    circle().position(() => rect().position().add([250, -100]), 1),
  );

  yield* waitUntil('change grids');
  scene().labelText('Local Space');
  scene().labelColor(theme.colors.Blue1);
  yield* sequence(
    0.7,
    all(scene().gridEnd(0.5, 1), scene().gridStart(0.5, 1)),
    all(rectGrid().end(0.5, 0).to(1, 1), rectGrid().start(0.5, 0).to(0, 1)),
    scene().labelScale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show world space');
  yield* sequence(
    0.1,
    all(rectGrid().end(0.5, 0.7), rectGrid().start(0.5, 0.7)),
    all(scene().gridEnd(0.5, 0).to(1, 1), scene().gridStart(0.5, 0).to(0, 1)),
  );

  yield* waitUntil('change label');
  yield* all(
    scene().labelText(' ', 0.7).to('World Space', 0.7),
    scene().labelColor(DEFAULT, 1),
  );

  yield* waitUntil('show world pos');
  yield* sequence(
    0.2,
    absolutePosVector().end(1, 0.7),
    circleGlobalCoordinates().show(),
  );

  yield* waitUntil('hide scene');
  yield* scene().scale(0, 0.8, easeInBack);

  yield* waitUntil('scene end');
});
import {
  Layout,
  LayoutProps,
  Node,
  Rect,
  makeScene2D,
} from '@motion-canvas/2d';
import { Txt } from '@motion-canvas/2d/lib/components';
import {
  all,
  createRef,
  linear,
  loop,
  range,
  waitUntil,
} from '@motion-canvas/core';
import { slideTransition } from '@motion-canvas/core/lib/transitions';

import theme from '@theme';

const YELLOW = '#FFC66D';
const RED = '#FF6470';
const GREEN = '#99C47A';
const BLUE = '#68ABDF';

const Trail = (props: LayoutProps) => (
  <Layout layout direction={'column'} gap={30} offsetY={-1} {...props} />
);

export default makeScene2D(function* (view) {
  const logo = createRef<Node>();
  const star = createRef<Node>();
  const trail1 = createRef<Layout>();
  const trail2 = createRef<Layout>();
  const trail3 = createRef<Layout>();
  const dot = createRef<Rect>();
  const thankYou = createRef<Txt>();

  view.add(
    <>
      <Node
        ref={logo}
        rotation={-45}
        position={44}
        scale={0.8}
        opacity={0}
        cache
      >
        <Node cache y={-270}>
          <Trail ref={trail1}>
            {range(3).map((_) => (
              <Rect width={40} radius={20} height={120} fill={YELLOW} />
            ))}
          </Trail>
          <Rect
            width={40}
            radius={20}
            height={270}
            fill={'white'}
            offsetY={-1}
            compositeOperation={'destination-in'}
          />
        </Node>
        <Node cache x={-70} y={-200}>
          <Trail ref={trail2}>
            {range(3).map((_) => (
              <Rect width={40} height={120} radius={20} fill={RED} />
            ))}
          </Trail>
          <Rect
            width={40}
            radius={20}
            height={180}
            fill={'white'}
            offsetY={-1}
            compositeOperation={'destination-in'}
          />
        </Node>
        <Node cache x={70} y={-300}>
          <Trail ref={trail3}>
            {range(4).map((i) => (
              <Rect
                ref={i === 1 ? dot : undefined}
                width={40}
                radius={20}
                height={100}
                fill={i === 0 ? GREEN : BLUE}
                offsetY={1}
              />
            ))}
          </Trail>
          <Rect
            width={40}
            radius={20}
            height={220}
            fill={'white'}
            offsetY={-1}
            y={60}
            compositeOperation={'destination-in'}
          />
        </Node>
        <Node ref={star}>
          {range(5).map((i) => (
            <Rect
              width={100}
              radius={50}
              height={150}
              fill={'white'}
              offsetY={1}
              rotation={(360 / 5) * i}
              compositeOperation={'destination-out'}
            />
          ))}
          {range(5).map((i) => (
            <Rect
              width={40}
              radius={20}
              height={120}
              fill={'white'}
              offsetY={1}
              rotation={(360 / 5) * i}
            />
          ))}
        </Node>
      </Node>

      <Txt
        ref={thankYou}
        fontSize={92}
        fill={theme.colors.White}
        fontFamily={theme.fonts.serif}
        text={'Thank you for watching!'}
        opacity={0}
      />
    </>,
  );

  yield* slideTransition();

  yield loop(Infinity, () =>
    all(
      star().rotation(0, 0).to(360, 4, linear),
      loop(4, function* () {
        yield* trail1().position.y(-150, 1, linear);
        trail1().position.y(0);
      }),
      loop(2, function* () {
        yield* trail2().position.y(-150, 2, linear);
        trail2().position.y(0);
      }),
      loop(2, function* () {
        yield* all(
          trail3().position.y(-130, 2, linear),
          dot().fill(GREEN, 2, linear),
        );
        dot().fill(BLUE);
        trail3().position.y(0);
      }),
    ),
  );

  yield* waitUntil('show logo');
  yield* logo().opacity(1, 2);

  yield* waitUntil('fade logo');
  yield* logo().opacity(0, 1);

  yield* waitUntil('fade text');
  yield* thankYou().opacity(1, 0.5);

  yield* waitUntil('scene end');
});
import { Rect, makeScene2D } from '@motion-canvas/2d';
import { Node, Ray } from '@motion-canvas/2d/lib/components';
import {
  createRef,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';

import theme from '@theme';

import { Coordinates, RectObject, SceneContainer, Vector } from '../components';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const relativeCoordinates = createRef<Coordinates>();
  const relativeVector = createRef<Ray>();
  const absoluteVector = createRef<Ray>();
  const absoluteCoordinates = createRef<Coordinates>();
  const arrowWrapper = createRef<Node>();

  view.add(
    <SceneContainer ref={scene} showAxis>
      <RectObject ref={rect} position={[-150, 200]} scale={0} />

      <Node ref={arrowWrapper}>
        <Vector ref={relativeVector} to={[300, -200]} end={0} />
      </Node>

      <Vector
        ref={absoluteVector}
        to={() => rect().position().add([300, -200])}
        end={0}
        stroke={theme.colors.Green1}
      />

      <Coordinates
        ref={relativeCoordinates}
        coordinates={[300, -200]}
        xColor={theme.colors.Gray2}
        yColor={theme.colors.Gray2}
        left={() =>
          relativeVector()
            .to()
            .transformAsPoint(arrowWrapper().localToParent())
            .add([15, 0])
        }
        scale={0}
      />

      <Coordinates
        ref={absoluteCoordinates}
        coordinates={() => rect().position().add([300, -200])}
        bottom={() => absoluteVector().to().add([0, -25])}
        scale={0}
      />
    </SceneContainer>,
  );

  yield* waitUntil('show pos');
  yield* sequence(
    0.2,
    relativeVector().end(1, 0.6),
    relativeCoordinates().show(),
  );

  yield* waitUntil('show rect');
  yield* rect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('move coordinates');
  yield* arrowWrapper().position(rect().position(), 1);

  yield* waitUntil('show absolute');
  yield* sequence(
    0.2,
    absoluteVector().end(1, 0.6),
    absoluteCoordinates().show(),
  );

  yield* waitUntil('hide objects');
  yield* sequence(
    0.08,
    absoluteCoordinates().hide(),
    absoluteVector().end(0, 0.6),
    relativeCoordinates().hide(),
    relativeVector().end(0, 0.6),
    rect().scale(0, 0.6, easeInBack),
    scene().gridStroke(theme.colors.Gray5, 0.5),
    scene().axisStroke(theme.colors.Gray5, 0.5),
    scene().size([2000, 1200], 0.7),
  );

  yield* waitUntil('scene end');
});
import { makeScene2D } from '@motion-canvas/2d';
import { Circle, Latex, Line, Rect } from '@motion-canvas/2d/lib/components';
import {
  all,
  sequence,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow';
import { createComputed } from '@motion-canvas/core/lib/signals';
import {
  clamp,
  easeInBack,
  easeInOutBack,
  easeOutBack,
} from '@motion-canvas/core/lib/tweening';
import { createRef } from '@motion-canvas/core/lib/utils';

import { texColor } from '@common/utils';

import theme from '@theme';

import {
  ArcVector,
  CircleObject,
  Coordinates,
  RectObject,
  RotationMatrix,
  SceneContainer,
  Vector,
  rotationMatrixCombinedTex,
  rotationMatrixSeparateTex,
} from '../components';
import { swapNodes } from '../utils';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();
  const circleCoords = createRef<Coordinates>();
  const arc = createRef<ArcVector>();
  const absoluteVector1 = createRef<Line>();
  const absoluteVector2 = createRef<Line>();
  const rotationMatrix = createRef<Latex>();
  const rotationMatrixSeparate = createRef<Latex>();
  const originDot = createRef<Circle>();
  const theta = createRef<Latex>();
  const pTex = createRef<Latex>();
  const highlightRect = createRef<Rect>();
  const translationVector = createRef<Line>();
  const translationBackVector = createRef<Line>();
  const circleGhost1 = createRef<Circle>();
  const circleGhost2 = createRef<Circle>();
  const circleGhost3 = createRef<Circle>();

  const rectToCircle = createComputed(() =>
    rect().position().add([300, -200]).sub(rect().position()),
  );
  const rectToCircleAngle = createComputed(
    () => (rectToCircle().radians * 180) / Math.PI,
  );
  const circleScenePosition = createComputed(() =>
    circle().absolutePosition().transformAsPoint(scene().worldToLocal()),
  );

  yield view.add(
    <>
      <Rect
        ref={highlightRect}
        fill={`${theme.colors.Green1}44`}
        lineWidth={4}
        stroke={theme.colors.Green1}
        radius={14}
        size={[450, 320]}
        position={[527, -300]}
        scale={0}
        smoothCorners
      />

      <RotationMatrix ref={rotationMatrix} height={280} />

      <Latex
        ref={rotationMatrixSeparate}
        tex={texColor(rotationMatrixSeparateTex, theme.colors.White)}
        height={280}
        y={-300}
        scale={0}
      />

      <SceneContainer ref={scene} showAxis>
        <Circle
          ref={circleGhost1}
          size={56}
          lineWidth={4}
          stroke={theme.colors.Red}
          lineDash={[10, 12]}
          position={[100, -250]}
          scale={0}
        />

        <Circle
          ref={circleGhost2}
          size={56}
          lineWidth={4}
          stroke={theme.colors.Red}
          lineDash={[10, 12]}
          position={[300, -200]}
          scale={0}
        />

        <Circle
          ref={circleGhost3}
          size={56}
          lineWidth={4}
          stroke={theme.colors.Red}
          lineDash={[10, 12]}
          position={[323, 160]}
          scale={0}
        />

        <Vector
          ref={translationVector}
          from={[100, -250]}
          to={[300, -200]}
          startOffset={40}
          endOffset={40}
          end={0}
        />

        <Vector
          ref={translationBackVector}
          from={[323, 160]}
          to={[123, 110]}
          startOffset={40}
          endOffset={40}
          end={0}
        />

        <CircleObject
          ref={originDot}
          size={60}
          fill={theme.colors.White}
          position={() => rect().position()}
        />

        <RectObject ref={rect} />
        <CircleObject ref={circle} position={[300, -200]} />

        <Coordinates
          ref={circleCoords}
          coordinates={circleScenePosition}
          position={() => circleScenePosition().add([0, 60])}
          scale={0}
        />

        <ArcVector
          ref={arc}
          opacity={0}
          position={() => rect().position()}
          size={() => rectToCircle().magnitude * 2}
          startAngle={rectToCircleAngle}
          endAngle={() =>
            clamp(
              rectToCircleAngle(),
              360,
              rectToCircleAngle() + rect().rotation() - 1,
            )
          }
          lineWidth={4}
          lineDash={[12, 12]}
          stroke={theme.colors.Brown2}
        />

        <Vector
          ref={absoluteVector1}
          from={() => rect().position()}
          to={() => rect().position().add([300, -200])}
          stroke={theme.colors.Green1}
          lineDash={[12, 12]}
          end={0}
        />

        <Latex
          ref={theta}
          tex={texColor('\\theta', theme.colors.White)}
          height={30}
          position={() => rect().position().add([90, 0])}
          scale={0}
        />

        <Latex
          ref={pTex}
          tex={texColor('P', theme.colors.White)}
          height={20}
          position={() => rect().position().add(18)}
          scale={0}
        />

        <Vector
          ref={absoluteVector2}
          from={() => rect().position()}
          to={() =>
            circle().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          stroke={theme.colors.Green1}
          end={0}
        />
      </SceneContainer>
    </>,
  );

  yield* waitUntil('rotate rect');
  yield* rect().rotation(360, 1.2, easeInOutBack);
  rect().rotation(0);

  yield* waitUntil('show circle pos');
  yield* circleCoords().show();

  yield* waitUntil('rotate rect 2');
  yield* rect().rotation(60, 0.8);

  yield* waitUntil('reset rect');
  yield* rect().rotation(0, 1);

  yield* waitUntil('show vectors');
  yield* all(
    absoluteVector2().end(1, 0.7),
    circleCoords().position(() => circleScenePosition().add([20, 60]), 0.7),
  );
  arc().opacity(1);

  yield* waitUntil('rotate rect 3');
  absoluteVector1().end(1);
  circle().reparent(rect());
  yield* rect().rotation(60, 2);

  yield* waitUntil('show formula');
  yield* sequence(
    0.4,
    all(
      scene().height(600, 0.7),
      scene().width(900, 0.7),
      scene().position.y(200, 0.7),
      scene().lineWidth(0, 0.5),
    ),
    rotationMatrix().position.y(-300, 0.7, easeOutBack),
  );

  yield* waitUntil('show theta');
  yield* theta().scale(1, 0.7, easeOutBack);

  yield* waitUntil('highlight origin');
  yield* originDot().ripple(1);

  yield* waitUntil('move rect');
  yield* rect().position([-200, -50], 1);

  yield* waitUntil('highlight rect origin');
  yield* originDot().ripple(1);

  yield* waitUntil('reset scene');
  yield* sequence(
    0.1,
    theta().scale(0, 0.7, easeInBack),
    absoluteVector1().end(0, 0.7),
    absoluteVector2().end(0, 0.7),
    circleCoords().position(() => circleScenePosition().add([0, 60]), 0.5),
    rect().rotation(0, 0.7),
  );

  yield* waitUntil('show separate matrices');
  yield* swapNodes(rotationMatrix, rotationMatrixSeparate);

  yield* waitUntil('highlight P');
  originDot().size(12).scale(0).zIndex(1);
  yield* all(
    rect().ripple(1),
    originDot().scale(1, 0.7, easeOutBack),
    pTex().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('highlight translation');
  yield* highlightRect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('show translation');
  circleGhost1().scale(1);
  yield* sequence(0.25, rect().position(0, 1), translationVector().end(1, 0.5));

  yield* waitUntil('highlight origin 2');
  yield* originDot().ripple(1);

  yield* waitUntil('highlight rotation matrix');
  yield* all(
    highlightRect().width(630, 0.8),
    highlightRect().position.x(-30, 0.8),
  );

  yield* waitUntil('show rotation');
  circleGhost2().scale(1);
  arc()
    .moveBelow(rect())
    .position(0)
    .startAngle(rectToCircleAngle() + 7)
    .endAngle(rectToCircleAngle() + 7);
  yield* sequence(
    0.35,
    rect().rotation(60, 1.5),
    arc().endAngle(rectToCircleAngle() + 52.5, 0.8),
  );

  yield* waitUntil('highlight translation 2');
  yield all(
    highlightRect().width(400, 0.8),
    highlightRect().position.x(-557, 0.8),
  );

  yield* waitUntil('show translation 2');
  circleGhost3().scale(1);
  yield* sequence(
    0.25,
    rect().position([-200, -50], 1),
    translationBackVector().end(1, 0.5),
  );

  yield* waitUntil('hide highlight');
  yield* highlightRect().scale(0, 0.7, easeInBack);

  yield* waitUntil('show full rotation');
  yield* rect().rotation(0, 1);
  yield* waitFor(0.6);
  yield* rect().rotation(60, 1.2);

  yield* waitUntil('show combined matrix');
  rotationMatrix().tex(texColor(rotationMatrixCombinedTex, theme.colors.White));
  yield* sequence(
    0.5,
    rotationMatrixSeparate().scale(0, 0.6, easeInBack),
    rotationMatrix().scale(1, 0.6, easeOutBack),
  );

  yield* waitUntil('center formula');
  yield* all(scene().position.y(900, 1), rotationMatrix().position.y(0, 1));

  yield* waitUntil('scene end');
});
import { makeScene2D } from '@motion-canvas/2d';
import { Latex, LatexProps, Rect } from '@motion-canvas/2d/lib/components';
import { all, sequence, waitUntil } from '@motion-canvas/core/lib/flow';
import { SignalValue, isReactive } from '@motion-canvas/core/lib/signals';
import { slideTransition } from '@motion-canvas/core/lib/transitions';
import { easeInBack, easeOutBack } from '@motion-canvas/core/lib/tweening';
import {
  Color,
  Direction,
  PossibleColor,
  PossibleVector2,
  Vector2,
} from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';

import { texColor } from '@common/utils';

import theme from '@theme';

import { RectObject, ScalingMatrix } from '../components';
import { swapNodes } from '../utils';

const createScalingMatrixTex = (
  scale: Vector2,
  highlightX: Color,
  highlightY: Color,
) => `
\\begin{bmatrix}
${texColor(scale.x.toFixed(2).toString(), highlightX.css())} & 0 & 0 \\\\
0 & ${texColor(scale.y.toFixed(2).toString(), highlightY.css())} & 0 \\\\
0 & 0 & 1
\\end{bmatrix}
`;

interface ScalingMatrixProps extends LatexProps {
  matrixScale?: SignalValue<PossibleVector2>;
  highlightX?: SignalValue<PossibleColor>;
  highlightY?: SignalValue<PossibleColor>;
}

const AnimatedScalingMatrix = ({
  matrixScale = new Vector2(1),
  highlightX = new Color(theme.colors.White),
  highlightY = new Color(theme.colors.White),
  ...rest
}: ScalingMatrixProps) => (
  <Latex
    tex={() =>
      texColor(
        createScalingMatrixTex(
          new Vector2(isReactive(matrixScale) ? matrixScale() : matrixScale),
          new Color(isReactive(highlightX) ? highlightX() : highlightX),
          new Color(isReactive(highlightY) ? highlightY() : highlightY),
        ),
        theme.colors.White,
      )
    }
    {...rest}
  />
);

export default makeScene2D(function* (view) {
  const animatedMatrix = createRef<Latex>();
  const scalingMatrix = createRef<Latex>();
  const rect = createRef<Rect>();
  const highlightRect = createRef<Rect>();

  const scale = Vector2.createSignal(1);
  const highlightX = Color.createSignal(theme.colors.White);
  const highlightY = Color.createSignal(theme.colors.White);

  yield view.add(
    <>
      <AnimatedScalingMatrix
        ref={animatedMatrix}
        height={300}
        matrixScale={scale}
        x={-300}
        highlightX={highlightX}
        highlightY={highlightY}
      />

      <Rect
        ref={highlightRect}
        position={[-140, -110]}
        size={100}
        fill={`${theme.colors.Green1}44`}
        lineWidth={4}
        stroke={theme.colors.Green1}
        radius={14}
        scale={0}
        smoothCorners
      />

      <ScalingMatrix ref={scalingMatrix} height={300} scale={0} />

      <RectObject ref={rect} x={300} size={150} scale={scale} />
    </>,
  );

  yield* slideTransition(Direction.Right, 1);

  yield* waitUntil('highlight matrix');
  yield* all(
    highlightX(theme.colors.Red, 0.5),
    highlightY(theme.colors.Green1, 0.5),
  );

  yield* waitUntil('scale x');
  yield* scale([1.75, 1], 0.8);

  yield* waitUntil('scale y');
  yield* scale([1.75, 2], 0.8);

  yield* waitUntil('reset scale');
  yield* all(
    scale(1, 1),
    highlightX(theme.colors.White, 0.7),
    highlightY(theme.colors.White, 0.7),
  );
  yield* sequence(
    0.3,
    rect().scale(0, 0.6, easeInBack),
    animatedMatrix().position.x(0, 0.7),
  );

  yield* waitUntil('use rect scale');
  yield* swapNodes(animatedMatrix(), scalingMatrix());

  yield* waitUntil('highlight Sx');
  yield* highlightRect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('highlight Sy');
  yield* highlightRect().position([25, 0], 0.7);

  yield* waitUntil('hide highlight');
  yield* highlightRect().scale(0, 0.6, easeInBack);

  yield* waitUntil('scene end');
});
import { makeScene2D } from '@motion-canvas/2d';
import {
  Circle,
  Layout,
  Line,
  Node,
  Rect,
  Txt,
} from '@motion-canvas/2d/lib/components';
import {
  all,
  chain,
  sequence,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow';
import { createComputed, createSignal } from '@motion-canvas/core/lib/signals';
import { easeOutBack, easeOutCubic } from '@motion-canvas/core/lib/tweening';
import { BBox, Origin } from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';

import theme from '@theme';

import {
  CircleObject,
  Control,
  Coordinates,
  Cursor,
  RectCircleSceneTree,
  RectObject,
  SceneContainer,
  SceneTree,
  TransformationRig,
  Vector,
} from '../components';

export default makeScene2D(function* (view) {
  const scene = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const rectPos = createRef<Coordinates>();
  const rectScaleCoordinates = createRef<Coordinates>();
  const rectScale = createRef<Layout>();
  const scaleFormulaGroup = createRef<Node>();
  const circle = createRef<Circle>();
  const circleRelativePos = createRef<Coordinates>();
  const circleAbsolutePos = createRef<Coordinates>();
  const objectGroup = createRef<Node>();
  const localVector = createRef<Line>();
  const rig = createRef<TransformationRig>();
  const cursor = createRef<Cursor>();

  const sceneTree = (<RectCircleSceneTree />) as SceneTree;
  const rectCoordinatesOffset = createSignal(30);

  yield view.add(
    <>
      <SceneContainer ref={scene} scale={0} sceneTree={sceneTree} showAxis>
        <Node ref={objectGroup} position={[-200, 150]}>
          <RectObject ref={rect} scale={0} />

          <CircleObject
            ref={circle}
            position={() => rect().position().add([300, -200])}
            scale={0}
          />
        </Node>

        <Coordinates
          ref={rectPos}
          coordinates={() =>
            rect().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          position={() => {
            const offset =
              BBox.fromPoints(
                ...rect()
                  .cacheBBox()
                  .transformCorners(
                    rect().localToWorld().multiply(scene().worldToLocal()),
                  ),
              ).height / 2;

            return rect()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
              .add([0, offset + rectCoordinatesOffset()]);
          }}
          scale={0}
          zIndex={1}
        />

        <Layout
          ref={rectScale}
          position={() => rectPos().position().add([0, 46])}
          alignItems={'center'}
          gap={8}
          scale={0}
          layout
        >
          <Txt
            text={'Scale'}
            fontSize={28}
            fontFamily={theme.fonts.mono}
            fontWeight={400}
            fill={theme.colors.Gray1}
          />

          <Coordinates
            ref={rectScaleCoordinates}
            coordinates={() => rect().scale()}
            decimals={2}
            xColor={theme.colors.White}
            yColor={theme.colors.White}
            zIndex={1}
          />
        </Layout>

        <Coordinates
          ref={circleAbsolutePos}
          scale={0}
          coordinates={() =>
            circle().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          position={() =>
            circle()
              .absolutePosition()
              .transformAsPoint(scene().worldToLocal())
              .add([0, -60])
          }
        />

        <Layout
          position={() =>
            localVector().getPointAtPercentage(0.4).position.add([280, 0])
          }
          gap={12}
          layout
        >
          <Coordinates
            ref={circleRelativePos}
            coordinates={() => circle().position().mul(objectGroup().scale())}
            xColor={theme.colors.White}
            yColor={theme.colors.White}
            scale={0}
          />

          <Layout
            ref={scaleFormulaGroup}
            fontFamily={theme.fonts.mono}
            gap={12}
            scale={0}
          >
            <Txt
              text={'* Scale = '}
              fill={theme.colors.Gray1}
              fontSize={28}
              fontWeight={400}
            />
            <Coordinates
              coordinates={() => circle().position().mul(objectGroup().scale())}
              xColor={theme.colors.White}
              yColor={theme.colors.White}
            />
          </Layout>
        </Layout>

        <Vector
          ref={localVector}
          from={() =>
            rect().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          to={() =>
            circle().absolutePosition().transformAsPoint(scene().worldToLocal())
          }
          end={0}
        />

        <TransformationRig
          scale={0}
          ref={rig}
          node={rect()}
          lineWidth={1}
          stroke={theme.colors.White}
          fill={theme.colors.Gray5}
          spacing={20}
        />
      </SceneContainer>

      <Cursor ref={cursor} scale={0} position={[150, 100]} />
    </>,
  );

  yield* waitUntil('show scene');
  yield* sequence(
    0.5,
    scene().scale(1, 0.8, easeOutBack),
    sequence(
      0.1,
      rect().scale(1, 0.7, easeOutBack),
      circle().scale(1, 0.7, easeOutBack),
      rectPos().show(),
      circleAbsolutePos().show(),
    ),
  );

  yield* waitUntil('show rig');
  yield* all(
    rectScale().scale(1, 0.6, easeOutBack),
    rig().scale(1, 0.8, easeOutBack),
    cursor().show(),
    rectCoordinatesOffset(50, 0.6, easeOutCubic),
  );

  yield* waitUntil('scale rect');
  let cursorPos = createComputed(() =>
    rig().control(Control.TopRight).transformAsPoint(rig().localToWorld()),
  );
  yield* cursor().moveToPosition(cursorPos(), 0.7);
  cursor().stickTo(cursorPos);
  yield* rect().scale(2, 1).to(0.8, 1).to(1, 1);

  const scaleGroup = () =>
    chain(
      objectGroup().scale(1.35, 1),
      waitFor(0.2),
      objectGroup().scale(0.7, 1),
      waitFor(0.2),
      objectGroup().scale(1, 1),
    );
  yield* waitUntil('show desired scaling');
  rectScaleCoordinates().coordinates(objectGroup().scale);
  yield* scaleGroup();

  yield* waitUntil('scale group');
  yield* scaleGroup();
  cursor().unstick();

  yield* waitUntil('hide cursor');
  yield* cursor().hide();

  yield* waitUntil('show local vec');
  yield* sequence(0.4, localVector().end(1, 0.8), circleRelativePos().show());

  yield* waitUntil('show cursor');
  yield* cursor().show();
  cursor().stickTo(cursorPos);

  yield* waitUntil('scale group 2');
  yield* scaleGroup();

  yield* waitUntil('multiply scale');
  circleRelativePos().coordinates([300, -200]);
  yield* scaleFormulaGroup().scale(1, 0.6, easeOutBack);

  yield* waitUntil('scale group 3');
  yield* scaleGroup();
  cursor().unstick();

  yield* waitUntil('scene end');
});
import { makeScene2D } from '@motion-canvas/2d';
import { Img, Layout, Node } from '@motion-canvas/2d/lib/components';
import { CodeBlock } from '@motion-canvas/2d/lib/components/CodeBlock';
import {
  all,
  chain,
  sequence,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow';
import { createComputed } from '@motion-canvas/core/lib/signals';
import { ThreadGenerator, cancel } from '@motion-canvas/core/lib/threading';
import {
  easeInBack,
  easeOutBack,
  linear,
} from '@motion-canvas/core/lib/tweening';
import { createRef, useRandom } from '@motion-canvas/core/lib/utils';

import theme from '@theme';

import {
  AnimatedSprite,
  Blood,
  Control,
  Cursor,
  GameSceneTree,
  Goblin,
  Hero,
  SceneContainer,
  SceneTree,
  Spear,
  TransformationRig,
} from '../components';

export default makeScene2D(function* (view) {
  const sceneContainer = createRef<Layout>();
  const cursor = createRef<Cursor>();
  const hero = createRef<AnimatedSprite>();
  const spear = createRef<Img>();
  const goblin = createRef<AnimatedSprite>();
  const blood = createRef<AnimatedSprite>();
  const code = createRef<CodeBlock>();
  const heroGroup = createRef<Layout>();
  const heroWrapper = createRef<Node>();
  const rig = createRef<TransformationRig>();

  function* attack(times: number) {
    for (let i = 0; i < times; i++) {
      yield* all(
        hero().playOnce('attack'),
        chain(
          spear().position.x(100, 0.05),
          waitFor(0.3),
          spear().position.x(34, 0.3),
        ),
        chain(blood().scale([-3, 3], 0), blood().playOnce('default')),
      );
      yield* waitFor(times > 1 ? 0.2 : 0);
    }
  }

  const sceneTree = (<GameSceneTree opacity={0} />) as SceneTree;

  yield view.add(
    <>
      <SceneContainer
        ref={sceneContainer}
        sceneTree={sceneTree}
        scale={0}
        showAxis
      >
        <Blood ref={blood} position={-400} scale={0} />
        <Goblin ref={goblin} scale={[-8, 8]} position={[600, 70]} />

        <TransformationRig
          ref={rig}
          scale={0}
          lineWidth={1}
          stroke={theme.colors.White}
          fill={theme.colors.Gray5}
          node={() => heroGroup()}
          spacing={[0, 40, 0, 0]}
        />

        <Layout ref={heroGroup} position={[-100, 64]} size={[230, 200]}>
          <Node ref={heroWrapper} x={-600}>
            <Hero ref={hero} scale={8} />
            <Spear ref={spear} scale={0} position={[34, 20]} />
          </Node>
        </Layout>
      </SceneContainer>

      <Cursor ref={cursor} scale={0} />

      <CodeBlock
        ref={code}
        code={`hero.position = new Vector2(-100, 0)`}
        fontSize={32}
        fontFamily={theme.fonts.mono}
        position={[150, -330]}
        scale={0}
      />
    </>,
  );

  let heroAnimation: ThreadGenerator = yield hero().loop('walk');
  let goblinAnimation: ThreadGenerator = yield goblin().loop('walk');

  yield* waitUntil('show scene container');
  yield* sceneContainer().scale(1, 0.6, easeOutBack);

  yield* waitUntil('enter sprites');
  yield* heroWrapper().position.x(0, 1, linear);
  hero().frame(0);
  cancel(heroAnimation);
  yield* spear().scale([-8, 8], 0.3);

  yield* waitUntil('enter gobo');
  yield* goblin().position.x(100, 1, linear);
  goblin().frame(0);
  cancel(goblinAnimation);

  yield* waitUntil('show scene tree');
  yield* sceneTree.create(0.6);

  yield* waitUntil('highlight objects');
  const pairs: [string, Node][] = [
    ['goblin', goblin()],
    ['hero', hero()],
    ['spear', spear()],
  ];
  for (const [id, sprite] of pairs) {
    sprite.save();
    yield* all(
      sceneTree.highlightNode(id, 0.7),
      sprite.scale(sprite.scale().scale(1.4), 0.7),
    );
    yield* waitFor(0.2);
    yield* sprite.restore(0.6);
  }
  yield* sceneTree.resetHighlight();

  yield* waitUntil('highlight spear');
  spear().save();
  yield* all(
    sceneTree.highlightNode('spear', 0.7),
    spear().scale(spear().scale().scale(1.4), 0.7),
  );
  yield* spear().restore(0.6);

  yield* waitUntil('highlight hero');
  hero().save();
  yield* all(
    sceneTree.highlightNode('hero', 0.7),
    hero().scale(hero().scale().scale(1.4), 0.7),
  );

  yield* waitUntil('reset hero');
  yield* all(sceneTree.resetHighlight(0.7), hero().restore(0.6));

  yield* waitUntil('attack');
  const random = useRandom(42);
  for (let i = 0; i < 4; i++) {
    blood().position([random.nextInt(-600, 600), random.nextInt(-600, 600)]);
    yield* attack(1);
    yield* waitFor(0.1);
  }

  yield* waitUntil('show cursor');
  yield* cursor().show();

  yield* waitUntil('move to hero');
  yield* cursor().absolutePosition(
    hero().absolutePosition().add([45, 160]),
    0.6,
  );

  yield* waitUntil('drag hero');
  heroWrapper().save();
  yield* cursor().clickAndDrag(heroWrapper(), [-100, [200, -200]], 0.6, {
    dragOffset: [-5, -13],
    ghostOpacity: 0,
  });
  yield* cursor().hide();

  yield* waitUntil('show code');
  yield* code().scale(1, 0.5);

  yield* waitUntil('move by code');
  yield* heroWrapper().restore(0.7);

  yield* waitUntil('hide code');
  yield* code().scale(0, 0.6);

  yield* waitUntil('move hero');
  heroWrapper().save();
  yield* heroWrapper()
    .position([-200, 100], 1)
    .to([-300, 0], 1)
    .to([200, -300], 1);
  yield* heroWrapper().restore(1.2);

  yield* waitUntil('show cursor 2');
  yield* cursor().show();

  yield* waitUntil('show transform rig');
  yield* rig().scale(1, 0.4, easeOutBack);

  yield* waitUntil('cursor to corner');
  const scaleControl = createComputed(() =>
    rig().control(Control.TopRight).transformAsPoint(rig().localToWorld()),
  );
  yield* cursor().moveToPosition(scaleControl(), 0.75);

  heroGroup().save();
  yield* waitUntil('scale nodes');
  cursor().stickTo(scaleControl);
  yield* heroGroup().scale(1.4, 0.6);

  yield* waitUntil('cursor to rotation');
  const rotationControl = createComputed(() =>
    rig().control(Control.Rotation).transformAsPoint(rig().localToWorld()),
  );
  yield* cursor().moveToPosition(rotationControl(), 0.6);
  cursor().stickTo(rotationControl);

  yield* waitUntil('rotate nodes');
  yield* heroGroup().rotation(25, 0.7);

  yield* waitUntil('reset transform');
  cursor().position(cursor().position());
  yield* sequence(
    0.2,
    rig().scale(0, 0.5),
    cursor().hide(),
    heroGroup().restore(0.6),
  );

  yield* waitUntil('move hero again');
  yield* heroWrapper().position([-100, 100], 1);

  yield* waitUntil('hide everything');
  yield* sequence(
    0.08,
    sceneTree.scale(0, 0.7, easeInBack),
    heroWrapper().scale(0, 0.7, easeInBack),
    goblin().scale(0, 0.7, easeInBack),
    sceneContainer().scale(0, 0.7, easeInBack),
  );

  yield* waitUntil('scene end');
});
import { SurroundingRectangle } from '@ksassnowski/motion-canvas-components';

import {
  Circle,
  Latex,
  Layout,
  Node,
  RectProps,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
import {
  Color,
  Vector2,
  createRef,
  createSignal,
  easeInBack,
  easeOutBack,
  sequence,
  waitUntil,
} from '@motion-canvas/core';
import { all } from '@motion-canvas/core/lib/flow';
import { ThreadGenerator, cancel } from '@motion-canvas/core/lib/threading';
import { linear } from '@motion-canvas/core/lib/tweening';
import { Matrix2D } from '@motion-canvas/core/lib/types';
import { range } from '@motion-canvas/core/lib/utils';

import { rotatePosition, texColor } from '@common/utils';

import theme from '@theme';

import {
  AnimatedSprite,
  CircleObject,
  Hero,
  SceneContainer,
  localToParentTex,
  rotationMatrixCombinedTex,
  rotationMatrixTex,
  scalingMatrixTex,
  scalingTranslationMatrixTex,
  translationMatrixTex,
} from '../components';

const inverseTranslationMatrixTex = `
\\begin{bmatrix}
1 & 0 & -P_x \\\\
0 & 1 & -P_y \\\\
0 & 0 & 1
\\end{bmatrix}`;

const formulaTex = `
circlePos(P, R, S, \\theta) = 
`;

export default makeScene2D(function* (view) {
  const complicatedRotationMatrix = createRef<Latex>();
  const rotationMatrix = createRef<Latex>();
  const highlightRect = createRef<SurroundingRectangle>();
  const previousTransformationMatrix = createRef<Latex>();
  const relativePosition = createRef<Latex>();
  const scalingMatrix = createRef<Latex>();
  const translationMatrix = createRef<Latex>();
  const matrixContainer = createRef<Layout>();
  const rotationMatrixContainer = createRef<Layout>();
  const rotationTranslationMatrix = createRef<Latex>();
  const inverseTranslationMatrix = createRef<Latex>();
  const rotationMatrix2 = createRef<Latex>();
  const scene = createRef<SceneContainer>();
  const circle = createRef<Circle>();
  const combinedMatrix = createRef<Latex>();
  const formulaPart = createRef<Latex>();
  const hero = createRef<AnimatedSprite>();
  const questionMarks = createRef<Node>();

  const highlightRectStyles: RectProps = {
    stroke: theme.colors.Green1,
    fill: `${theme.colors.Green1}31`,
    lineWidth: 4,
    radius: 8,
    scale: 0,
    smoothCorners: true,
  };

  function transformCirclePosition(
    matrix: Matrix2D,
    duration = 0.8,
  ): ThreadGenerator {
    return circle().position(
      circle().position().transformAsPoint(matrix.domMatrix),
      duration,
    );
  }

  function* showScene() {
    yield* sequence(
      0.4,
      matrixContainer().position.y(-370, 0.8),
      scene().scale(1, 0.7, easeOutBack),
    );
  }

  function* hideScene() {
    yield* sequence(
      0.4,
      scene().scale(0, 0.7, easeInBack),
      matrixContainer().position.y(0, 0.8),
    );
  }

  function highlightRectAnimations(...nodes: Layout[]): ThreadGenerator[] {
    if (highlightRect().scale().exactlyEquals(Vector2.zero)) {
      return [highlightRect().nodes(nodes, 0), highlightRect().scale(1, 0.8)];
    }

    return [highlightRect().nodes(nodes, 0.8)];
  }

  function* scaleCirclePosition() {
    yield* sequence(
      0.15,
      all(...highlightRectAnimations(scalingMatrix(), relativePosition())),
      transformCirclePosition(Matrix2D.fromScaling(2)),
    );
  }

  function* translateCircle(matrix: Latex = translationMatrix()) {
    yield* sequence(
      0.15,
      all(...highlightRectAnimations(matrix)),
      transformCirclePosition(Matrix2D.fromTranslation(-100)),
    );
  }

  function* translateCircleBack() {
    yield* sequence(
      0.15,
      all(...highlightRectAnimations(inverseTranslationMatrix())),
      transformCirclePosition(Matrix2D.fromTranslation(100)),
    );
  }

  function* rotateCircle() {
    yield* sequence(
      0.15,
      all(...highlightRectAnimations(rotationMatrix2())),
      rotatePosition(circle(), 60, 0.8),
    );
  }

  const matrixHeight = createSignal(200);
  const matrixColor = Color.createSignal(theme.colors.White);

  yield view.add(
    <>
      <Latex
        ref={complicatedRotationMatrix}
        tex={texColor(rotationMatrixCombinedTex, theme.colors.White)}
        height={280}
      />

      <Latex
        ref={rotationMatrix}
        tex={texColor(rotationMatrixTex, theme.colors.White)}
        height={280}
        y={100}
        opacity={0}
      />

      <Layout ref={matrixContainer} alignItems={'center'} layout>
        <Latex
          ref={formulaPart}
          tex={texColor(formulaTex, theme.colors.White)}
          height={0}
          marginRight={7}
        />

        <Layout scale={0} ref={rotationMatrixContainer}>
          <Latex
            ref={rotationTranslationMatrix}
            tex={texColor(translationMatrixTex, theme.colors.White)}
            height={280}
          />
          <Latex
            ref={rotationMatrix2}
            tex={texColor(rotationMatrixTex, theme.colors.White)}
            height={280}
          />
          <Latex
            ref={inverseTranslationMatrix}
            tex={() =>
              texColor(inverseTranslationMatrixTex, matrixColor().css())
            }
            height={280}
          />
        </Layout>

        <Latex
          ref={previousTransformationMatrix}
          tex={texColor(scalingTranslationMatrixTex, theme.colors.White)}
          height={0}
        />

        <Latex
          ref={translationMatrix}
          tex={() => texColor(translationMatrixTex, matrixColor().css())}
          height={0}
        />

        <Latex
          ref={scalingMatrix}
          tex={texColor(scalingMatrixTex, theme.colors.White)}
          height={0}
        />

        <Latex
          ref={combinedMatrix}
          tex={texColor(localToParentTex, theme.colors.White)}
          height={0}
        />

        <Latex
          ref={relativePosition}
          tex={texColor(
            `\\begin{bmatrix}R_x \\\\ R_y \\\\ 1\\end{bmatrix}`,
            theme.colors.White,
          )}
          height={0}
        />
      </Layout>

      <SurroundingRectangle
        ref={highlightRect}
        zIndex={-1}
        nodes={[scalingMatrix(), relativePosition()]}
        bufferX={-5}
        bufferY={25}
        {...highlightRectStyles}
      />

      <SceneContainer
        ref={scene}
        height={675}
        y={150}
        lineWidth={0}
        showAxis
        scale={0}
      >
        <CircleObject ref={circle} position={() => [150, -100]} />
      </SceneContainer>

      <Node>
        <Node
          ref={questionMarks}
          position={() => hero().position().add([0, -130])}
        >
          {range(3).map((i) => (
            <Txt
              fontFamily={theme.fonts.pixel}
              fill={theme.colors.White}
              fontSize={110}
              text={'?'}
              rotation={-40 + 40 * i}
              x={-90 + 90 * i}
              y={i !== 1 ? 40 : 0}
              scale={0}
            />
          ))}
        </Node>
        <Hero ref={hero} scale={8} position={[-1100, 470]} />
      </Node>
    </>,
  );

  yield* waitUntil('show simple matrix');
  complicatedRotationMatrix().save();
  rotationMatrix().save();
  yield* sequence(
    0.1,
    complicatedRotationMatrix().position.y(-200, 0.6),
    all(
      rotationMatrix().position.y(200, 0.7),
      rotationMatrix().opacity(1, 0.7),
    ),
  );

  yield* waitUntil('hide simple matrix');
  yield* sequence(
    0.1,
    rotationMatrix().restore(0.6),
    complicatedRotationMatrix().restore(0.6),
  );

  yield* waitUntil('decompose rotation');
  yield* sequence(
    0.5,
    complicatedRotationMatrix().scale(0, 0.6, easeInBack),
    rotationMatrixContainer().scale(1, 0.6, easeOutBack),
  );

  yield* waitUntil('show formula');
  yield* all(
    ...rotationMatrixContainer()
      .children()
      .map((node) => (node as Latex).height(matrixHeight, 0.8)),
    previousTransformationMatrix().height(matrixHeight, 0.8),
    relativePosition().height(matrixHeight, 0.8),
  );

  yield* waitUntil('decompose matrix');
  yield* all(
    previousTransformationMatrix().height(0, 0.8),
    scalingMatrix().height(matrixHeight, 0.8),
    translationMatrix().height(matrixHeight, 0.8),
  );

  yield* waitUntil('show scene');
  yield* showScene();

  circle().save();
  yield* waitUntil('scale position');
  yield* scaleCirclePosition();

  yield* waitUntil('translate position');
  yield* translateCircle();

  yield* waitUntil('translate back');
  yield* translateCircleBack();

  yield* waitUntil('rotate position');
  yield* rotateCircle();

  yield* waitUntil('translate again');
  yield* translateCircle(rotationTranslationMatrix());

  yield* waitUntil('hide rect');
  yield* highlightRect().scale(0, 0.8);

  yield* waitUntil('hide scene');
  yield* hideScene();

  yield* waitUntil('highlight matrices');
  highlightRect().nodes([inverseTranslationMatrix(), translationMatrix()]);
  yield* highlightRect().scale(1, 0.6, easeOutBack);

  yield* waitUntil('fade matrices');
  yield* all(matrixColor(theme.colors.Gray4, 1), highlightRect().scale(0, 0.7));

  yield* waitUntil('hide translation');
  yield* all(
    inverseTranslationMatrix().height(0, 0.8),
    translationMatrix().height(0, 0.8),
  );

  yield* waitUntil('show scene 2');
  yield* circle().restore(0);
  yield* showScene();

  yield* waitUntil('scale position 2');
  yield* scaleCirclePosition();

  yield* waitUntil('rotate position 2');
  circle().save();
  yield* rotateCircle();

  yield* waitUntil('translate position 2');
  yield* translateCircle(rotationTranslationMatrix());

  yield* waitUntil('hide rect 2');
  yield* highlightRect().scale(0, 0.6, easeInBack);

  yield* waitUntil('show full matrix');
  matrixColor(theme.colors.White);
  yield* all(
    circle().restore(0.8),
    inverseTranslationMatrix().height(matrixHeight, 0.8),
    translationMatrix().height(matrixHeight, 0.8),
  );

  yield* waitUntil('translate position 3');
  circle().save();
  yield* translateCircle();

  yield* waitUntil('undo translate');
  yield* translateCircleBack();

  yield* waitUntil('rotate position 3');
  yield* rotateCircle();
  yield* translateCircle(rotationTranslationMatrix());

  yield* waitUntil('highlight rotation matrix');
  yield* highlightRect().nodes(
    [
      rotationTranslationMatrix(),
      rotationMatrix2(),
      inverseTranslationMatrix(),
    ],
    0.8,
  );

  yield* waitUntil('show simplified formula');
  yield* all(
    circle().restore(0.8),
    highlightRect().scale(0, 0.6),
    translationMatrix().height(0, 0.8),
    inverseTranslationMatrix().height(0, 0.8),
  );

  yield* waitUntil('rotate position 4');
  yield* rotateCircle();

  yield* waitUntil('translate position 4');
  yield* translateCircle(rotationTranslationMatrix());

  yield* waitUntil('hide rect 3');
  yield* highlightRect().scale(0, 0.6);

  yield* waitUntil('hide scene 2');
  yield* sequence(0.4, hideScene(), matrixHeight(250, 0.7));

  yield* waitUntil('show final matrix');
  yield* all(
    ...[rotationTranslationMatrix(), rotationMatrix2(), scalingMatrix()].map(
      (matrix) => matrix.height(0, 0.7),
    ),
    combinedMatrix().height(matrixHeight, 0.7),
  );

  yield* waitUntil('show formula part');
  yield* formulaPart().height(64, 0.7);

  yield* waitUntil('highlight theta');
  yield* all(
    highlightRect().position([-318, -2], 0),
    highlightRect().size([70, 86], 0),
    highlightRect().scale(1, 0.7),
  );

  yield* waitUntil('hide highlight');
  yield* highlightRect().scale(0, 0.6);

  yield* waitUntil('enter hero');
  let heroAnimation = yield hero().loop('walk');
  yield* hero().position.x(-700, 1.5, linear);
  cancel(heroAnimation);
  heroAnimation = yield hero().loop('idle');

  yield* waitUntil('show question marks');
  yield* sequence(
    0.1,
    ...questionMarks()
      .children()
      .map((node) => node.scale(1, 0.6, easeOutBack)),
  );

  yield* waitUntil('hide question marks');
  yield* sequence(
    0.1,
    ...questionMarks()
      .children()
      .map((node) => node.scale(0, 0.6, easeInBack)),
  );

  yield* waitUntil('exit hero');
  cancel(heroAnimation);
  hero().scale([-8, 8]);
  heroAnimation = yield hero().loop('walk');
  yield* hero().position.x(-1100, 1.5, linear);
  cancel(heroAnimation);

  yield* waitUntil('scene end');
});



import { makeScene2D } from '@motion-canvas/2d';
import {
  Circle,
  Latex,
  Line,
  LineProps,
  Node,
  Rect,
} from '@motion-canvas/2d/lib/components';
import { all, delay, sequence, waitUntil } from '@motion-canvas/core/lib/flow';
import { createComputed } from '@motion-canvas/core/lib/signals';
import {
  easeInBack,
  easeInOutBack,
  easeOutBack,
} from '@motion-canvas/core/lib/tweening';
import { Vector2 } from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';

import { texColor } from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  Control,
  Coordinates,
  Cursor,
  RectCircleSceneTree,
  RectObject,
  RelativePositionVector,
  SceneContainer,
  SceneTree,
  SimpleFormula,
  TransformationRig,
} from '../components';

export default makeScene2D(function* (view) {
  const sceneContainer = createRef<SceneContainer>();
  const rect = createRef<Rect>();
  const circle = createRef<Circle>();
  const circleGhost = createRef<Circle>();
  const lineX = createRef<Line>();
  const lineY = createRef<Line>();
  const vectorLocal = createRef<Line>();
  const vectorGlobal = createRef<Line>();
  const cursor = createRef<Cursor>();
  const tex = createRef<Latex>();
  const formulaTex = createRef<Latex>();
  const rig = createRef<TransformationRig>();
  const rectPosContainer = createRef<Node>();
  const circlePosContainer = createRef<Node>();
  const formulaHighlight = createRef<Rect>();
  const rVectorTex = createRef<Latex>();
  const circleRelativeCoords = createRef<Coordinates>();
  const circleCoords = createRef<Coordinates>();
  const rectCoords = createRef<Coordinates>();

  const sceneTree = (<RectCircleSceneTree opacity={0} />) as SceneTree;

  const lineStyle: LineProps = {
    arrowSize: 13,
    lineWidth: 4,
  };

  yield view.add(
    <>
      <SceneContainer
        ref={sceneContainer}
        sceneTree={sceneTree}
        scale={0}
        showAxis
      >
        <RectObject ref={rect} scale={0} zIndex={2} />

        <Coordinates
          ref={rectCoords}
          xColor={theme.colors.Gray2}
          yColor={theme.colors.Gray2}
          coordinates={() => rect().position()}
          position={() => rect().position().add([0, 70])}
          scale={0}
        />

        <CircleObject ref={circle} scale={0} position={[150, -100]} zIndex={3}>
          <Coordinates
            ref={circleCoords}
            coordinates={() => circle().position()}
            position={[0, -55]}
            scale={0}
          />
        </CircleObject>

        <Circle
          ref={circleGhost}
          size={56}
          stroke={theme.colors.Red}
          lineDash={[8, 9]}
          lineWidth={4}
          position={() => rect().position().add(Vector2.right.scale(300))}
          opacity={0}
          zIndex={3}
        />

        <Line
          ref={lineX}
          stroke={theme.colors.Gray1}
          points={() => [
            rect().position(),
            rect().position().add(Vector2.right.scale(300)),
          ]}
          lineDash={[12, 12]}
          start={0.16}
          end={0.16}
          endArrow
          {...lineStyle}
        />

        <Line
          ref={lineY}
          stroke={theme.colors.Gray1}
          points={() => [
            rect().position().add(Vector2.right.scale(300)),
            rect().position().add(new Vector2(300, -200)),
          ]}
          lineDash={[12, 12]}
          end={0.2}
          start={0.2}
          endArrow
          {...lineStyle}
        />

        <Line
          ref={vectorLocal}
          stroke={theme.colors.White}
          points={() => [
            rect().position(),
            rect().position().add(new Vector2(300, -200)),
          ]}
          endArrow
          end={0}
          zIndex={4}
          {...lineStyle}
        />

        <Line
          ref={vectorGlobal}
          stroke={theme.colors.Green1}
          points={() => [0, circle().position()]}
          endArrow
          start={0}
          end={0}
          zIndex={4}
          {...lineStyle}
        />

        <Latex
          ref={rVectorTex}
          tex={texColor('R', theme.colors.White)}
          height={24}
          position={() =>
            vectorLocal().getPointAtPercentage(0.65).position.add([-70, 0])
          }
          scale={0}
        />

        <Coordinates
          ref={circleRelativeCoords}
          coordinates={new Vector2(300, -200)}
          position={() =>
            vectorLocal()
              .getPointAtPercentage(0.62)
              .position.add(new Vector2(-120, 0))
          }
          scale={0}
        />

        <Node
          ref={rectPosContainer}
          zIndex={3}
          position={() => rect().position()}
        >
          <Circle size={12} fill={theme.colors.White} scale={0} />

          <Latex
            tex={`\\color{${theme.colors.White}}{P}`}
            width={25}
            position={[18, 20]}
            scale={0}
          />
        </Node>

        <Node
          ref={circlePosContainer}
          zIndex={4}
          position={() => circle().position()}
        >
          <Circle size={12} fill={theme.colors.White} scale={0} />

          <Latex
            tex={`\\color{${theme.colors.White}}{circlePos(P, R)}`}
            height={30}
            position={[-0, -55]}
            scale={0}
          />
        </Node>

        <TransformationRig
          scale={0}
          ref={rig}
          node={rect()}
          lineWidth={1}
          stroke={theme.colors.White}
          fill={theme.colors.Gray5}
          spacing={20}
        />

        <Cursor ref={cursor} position={100} scale={0} zIndex={20} />
      </SceneContainer>

      <RelativePositionVector
        ref={tex}
        height={65}
        position={[400, -200]}
        scale={0}
      />

      <SimpleFormula
        ref={formulaTex}
        height={120}
        position={[585, 0]}
        scale={0}
      />

      <Rect
        ref={formulaHighlight}
        height={80}
        width={80}
        fill={`${theme.colors.Green1}44`}
        lineWidth={4}
        stroke={theme.colors.Green1}
        radius={14}
        position={[513, 0]}
        scale={0}
        smoothCorners
        zIndex={-1}
      />
    </>,
  );

  yield* waitUntil('show scene');
  yield* sceneContainer().scale(1, 1, easeOutBack);
  yield* rect().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show circle');
  yield* circle().scale(1, 0.6, easeOutBack);

  yield* waitUntil('show scene tree');
  yield* sceneTree.create(0.6);

  yield* waitUntil('show cursor 1');
  yield* cursor().show();

  yield* waitUntil('move group 1');
  circle().save();
  circle().position(() => rect().position().add([150, -100]));
  yield* cursor().moveToPosition(rect(), 0.6);
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-100, 200],
      [-150, -50],
      [50, -100],
      [0, 0],
    ],
    0.8,
  );

  const resizeControl = createComputed(() =>
    rig().control(Control.TopRight).transformAsPoint(rig().localToWorld()),
  );
  const rotationControl = createComputed(() =>
    rig().control(Control.Rotation).transformAsPoint(rig().localToWorld()),
  );

  yield* waitUntil('show transformation rig');
  // Parent the circle to the rectangle temporarily to make the transformations
  // work as expected.
  circle().reparent(rect());
  yield* rig().scale(1, 0.6, easeOutBack);

  yield* waitUntil('scale group');
  yield* cursor().moveToPosition(resizeControl(), 0.6);
  cursor().stickTo(resizeControl);
  yield* rect().scale(1.4, 1);

  yield* waitUntil('rotate group');
  yield* cursor().moveToPosition(rotationControl(), 0.6);
  cursor().stickTo(rotationControl);
  yield* rect().rotation(30, 1).to(0, 0.7);
  yield* cursor().moveToPosition(resizeControl(), 0.6);
  cursor().stickTo(resizeControl);
  yield* rect().scale(1, 0.7);

  yield* waitUntil('hide cursor 1');
  cursor().unstick();
  yield* sequence(0.5, cursor().hide(), rig().scale(0, 0.6));

  yield* waitUntil('show circle target');
  yield* circle().position([300, -200], 1, easeInOutBack);

  yield* waitUntil('reset circle');
  yield* circle().position(0, 0.8);

  yield* waitUntil('position circle x');
  yield* all(
    circle().position.x(300, 1, easeInOutBack),
    delay(0.32, lineX().end(0.86, 0.35)),
  );

  yield* waitUntil('position circle y');
  circleGhost().opacity(1);
  yield* all(
    circle().position.y(-200, 1, easeInOutBack),
    delay(0.32, lineY().end(0.8, 0.35)),
  );

  yield* waitUntil('show cursor');
  circle().reparent(rect().parent());
  circle().position(() => rect().position().add([300, -200]));
  yield* cursor().show();
  yield* cursor().moveToPosition(rect(), 0.7);

  yield* waitUntil('move rectangle');
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-200, -100],
      [-100, 300],
      [0, 0],
    ],
    1,
  );
  yield* cursor().hide();

  yield* waitUntil('hide helper lines');
  yield* sequence(
    0.1,
    lineY().end(lineY().start(), 0.6),
    lineX().end(lineX().start(), 0.6),
    circleGhost().endAngle(0, 0.6),
  );

  yield* waitUntil('show vector formula');
  tex().position(() =>
    vectorLocal()
      .getPointAtPercentage(0.31)
      .position.add(Vector2.right.scale(110)),
  );
  yield* all(tex().scale(1, 0.6, easeOutBack));

  yield* waitUntil('show local vector');
  vectorLocal().start(0).end(0).stroke(theme.colors.White);
  yield* vectorLocal().end(1, 0.7);

  yield* waitUntil('show cursor 3');
  cursor().position(120);
  yield* cursor().show();

  yield* waitUntil('move rect');
  yield* cursor().moveToPosition(rect(), 0.7);
  yield* cursor().clickAndDrag(
    rect(),
    [
      [100, 100],
      [-50, 250],
    ],
    0.8,
  );

  yield* waitUntil('hide cursor 3');
  yield* cursor().hide();

  yield* waitUntil('show helper lines');
  yield* all(
    lineX().end(0.86, 0.6),
    lineY().end(0.8, 0.6),
    circleGhost().endAngle(360, 0.6),
  );

  yield* waitUntil('hide helper lines 2');
  yield* sequence(
    0.1,
    lineY().end(lineY().start(), 0.6),
    lineX().end(lineX().start(), 0.6),
    circleGhost().endAngle(0, 0.6),
  );

  yield* waitUntil('show absolute vector');
  yield* vectorGlobal().end(1, 0.7);

  yield* waitUntil('show cursor 4');
  cursor().position([-100, 100]);
  yield* cursor().show();

  yield* waitUntil('move rect 2');
  yield* cursor().moveToPosition(rect(), 0.6);
  cursor().stickTo(rect().absolutePosition);
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-200, 200],
      [-280, -50],
      [150, 100],
      [50, 250],
    ],
    1,
  );

  yield* waitUntil('hide cursor 4');
  cursor().unstick();
  yield* cursor().hide();

  yield* waitUntil('reset scene');
  yield* sequence(
    0.1,
    tex().scale(0, 0.6, easeInBack),
    vectorLocal().end(0, 0.6),
    vectorGlobal().end(0, 0.6),
    rect().position(0, 1),
  );

  yield* waitUntil('shift scene');
  yield* sceneContainer().position.x(-300, 0.8);

  yield* waitUntil('show formula');
  yield* formulaTex().scale(1, 0.8, easeOutBack);

  yield* waitUntil('highlight P scene');
  yield* formulaHighlight().scale(1, 0.5, easeOutBack);
  yield* all(
    formulaHighlight().ripple(1),
    rect().ripple(1),
    sequence(
      0.1,
      ...rectPosContainer()
        .children()
        .map((child) => child.scale(1, 0.5, easeOutBack)),
    ),
  );

  yield* waitUntil('highlight R formula');
  yield* formulaHighlight().position.x(
    formulaHighlight().position.x() + 60,
    0.6,
  );

  yield* waitUntil('highlight R scene');
  yield* all(
    formulaHighlight().ripple(1),
    rVectorTex().scale(1, 0.5),
    vectorLocal().end(1, 0.6),
  );

  yield* waitUntil('highlight output formula');
  yield* all(
    formulaHighlight().position.x(formulaHighlight().position.x() + 211, 0.6),
    formulaHighlight().width(240, 0.6),
    formulaHighlight().height(160, 0.6),
  );

  yield* waitUntil('highlight output scene');
  yield* all(
    formulaHighlight().ripple(1),
    circle().ripple(1),
    sequence(
      0.1,
      ...circlePosContainer()
        .children()
        .map((child) => child.scale(1, 0.5, easeOutBack)),
    ),
  );

  yield* waitUntil('show absolute pos');
  yield* sequence(
    0.2,
    formulaHighlight().scale(0, 0.6, easeInBack),
    sequence(
      0.3,
      rectPosContainer().scale(0, 0.4, easeInBack),
      rectCoords().scale(1, 0.5, easeOutBack),
    ),
    sequence(
      0.3,
      circlePosContainer().scale(0, 0.4, easeInBack),
      circleCoords().scale(1, 0.5, easeOutBack),
    ),
  );

  yield* waitUntil('show cursor 5');
  cursor().position(100);
  yield* cursor().show();

  yield* waitUntil('cursor to rect');
  yield* cursor().moveToPosition(rect(), 0.7);

  yield* waitUntil('drag rectangle');
  yield* cursor().clickAndDrag(
    rect(),
    [
      [-700, 0],
      [-400, 200],
      [-350, -100],
    ],
    1.2,
  );

  yield* waitUntil('center formula');
  yield* all(
    sequence(
      0.1,
      rVectorTex().scale(0, 0.6, easeInBack),
      cursor().hide(),
      vectorLocal().end(0, 0.6),
    ),
    delay(
      0.4,
      all(
        sceneContainer().position.x(-1500, 1),
        formulaTex().position(0, 1),
        formulaTex().scale(1.5, 1),
      ),
    ),
  );

  yield* waitUntil('end scene');
});
import { makeScene2D } from '@motion-canvas/2d';
import {
  Latex,
  Layout,
  Node,
  Rect,
  Txt,
} from '@motion-canvas/2d/lib/components';
import { all, sequence, waitUntil } from '@motion-canvas/core/lib/flow';
import { cancel } from '@motion-canvas/core/lib/threading';
import { slideTransition } from '@motion-canvas/core/lib/transitions';
import {
  easeInBack,
  easeOutBack,
  linear,
} from '@motion-canvas/core/lib/tweening';
import { Direction } from '@motion-canvas/core/lib/types';
import { createRef, range } from '@motion-canvas/core/lib/utils';

import { texColor } from '@common/utils';

import theme from '@theme';

import {
  AnimatedSprite,
  Hero,
  finalFormulaSeparateTex,
  localToParentFormula,
} from '../components';

export default makeScene2D(function* (view) {
  const formulaSeparate = createRef<Latex>();
  const highlightRect = createRef<Rect>();
  const formulaCombined = createRef<Latex>();
  const hero = createRef<AnimatedSprite>();
  const questionMarks = createRef<Node>();

  yield view.add(
    <>
      <Rect
        ref={highlightRect}
        fill={`${theme.colors.Green1}44`}
        lineWidth={4}
        stroke={theme.colors.Green1}
        radius={14}
        size={[60, 80]}
        position={[-518, -2]}
        scale={0}
        smoothCorners
      />

      <Latex
        ref={formulaSeparate}
        tex={texColor(finalFormulaSeparateTex, theme.colors.White)}
        height={180}
      />

      <Latex
        ref={formulaCombined}
        tex={texColor(localToParentFormula, theme.colors.White)}
        height={250}
        scale={0}
      />

      <Node>
        <Node
          ref={questionMarks}
          position={() => hero().position().add([0, -130])}
        >
          {range(3).map((i) => (
            <Txt
              fontFamily={theme.fonts.pixel}
              fill={theme.colors.White}
              fontSize={110}
              text={'?'}
              rotation={-40 + 40 * i}
              x={-90 + 90 * i}
              y={i !== 1 ? 40 : 0}
              scale={0}
            />
          ))}
        </Node>
        <Hero ref={hero} scale={8} position={[-1100, 470]} />
      </Node>
    </>,
  );

  yield* slideTransition(Direction.Top, 1);

  yield* waitUntil('highlight theta');
  yield* highlightRect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('highlight formula');
  yield* all(
    highlightRect().size([900, 220], 0.8),
    highlightRect().position.x(14, 0.8),
  );

  yield* waitUntil('hide highlight');
  yield* highlightRect().scale(0, 0.6, easeInBack);

  yield* waitUntil('show formula combined');
  yield* sequence(
    0.4,
    formulaSeparate().scale(0, 0.6, easeInBack),
    formulaCombined().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('enter hero');
  let heroAnimation = yield hero().loop('walk');
  yield* hero().position.x(-700, 1.5, linear);
  cancel(heroAnimation);
  heroAnimation = yield hero().loop('idle');

  yield* waitUntil('show question marks');
  yield* sequence(
    0.1,
    ...questionMarks()
      .children()
      .map((node) => node.scale(1, 0.6, easeOutBack)),
  );

  yield* waitUntil('hide question marks');
  yield* sequence(
    0.1,
    ...questionMarks()
      .children()
      .map((node) => node.scale(0, 0.6, easeInBack)),
  );

  yield* waitUntil('exit hero');
  cancel(heroAnimation);
  hero().scale([-8, 8]);
  heroAnimation = yield hero().loop('walk');
  yield* hero().position.x(-1100, 1.5, linear);
  cancel(heroAnimation);

  yield* waitUntil('scene end');
});
import { makeScene2D } from '@motion-canvas/2d';
import {
  Circle,
  Latex,
  Layout,
  Line,
  Rect,
  Txt,
} from '@motion-canvas/2d/lib/components';
import {
  all,
  sequence,
  waitFor,
  waitUntil,
} from '@motion-canvas/core/lib/flow';
import { createComputed } from '@motion-canvas/core/lib/signals';
import { slideTransition } from '@motion-canvas/core/lib/transitions';
import { easeInBack, easeOutBack } from '@motion-canvas/core/lib/tweening';
import { Direction } from '@motion-canvas/core/lib/types';
import { createRef, finishScene } from '@motion-canvas/core/lib/utils';

import { texColor, translate } from '@common/utils';

import theme from '@theme';

import {
  CircleObject,
  Coordinates,
  Cursor,
  RectObject,
  SceneContainer,
  SceneContainerProps,
  Vector,
  scalingTranslationFormulaCombinedTex,
  scalingTranslationFormulaTex,
} from '../components';

const vectorTex = `
\\begin{bmatrix}
P_x + R_xS_x \\\\
P_y + R_yS_y \\\\
\\end{bmatrix}
`;

export default makeScene2D(function* (view) {
  const texSeparate = createRef<Latex>();
  const texCombined = createRef<Latex>();
  const highlightRect = createRef<Rect>();
  const compositeScene = createRef<SceneContainer>();
  const demonstrationScene = createRef<SceneContainer>();
  const cursor = createRef<Cursor>();
  const circle1 = createRef<Circle>();
  const circle2 = createRef<Circle>();
  const rect = createRef<Rect>();
  const vectorFormula = createRef<Latex>();
  const positionFormula = createRef<Latex>();
  const scaledVector = createRef<Line>();
  const circlePositionDot = createRef<Circle>();
  const rectCoordinates = createRef<Coordinates>();
  const rGroup = createRef<Layout>();
  const pGroup = createRef<Layout>();
  const sGroup = createRef<Layout>();

  const animatedTex = createComputed(() => {
    const p = rect().position();
    const s = rect().scale();
    const r = circle2().position();
    const circlePos = circle2()
      .absolutePosition()
      .transformAsPoint(demonstrationScene().worldToLocal());

    return texColor(
      `
\\begin{bmatrix*}[r]
${texColor(p.x.toFixed(0), theme.colors.Blue1)} + ${r.x} \\cdot ${texColor(
        s.x.toFixed(2),
        theme.colors.Green2,
      )} \\\\
${texColor(p.y.toFixed(0), theme.colors.Blue1)} ${r.y} \\cdot ${texColor(
        s.y.toFixed(2),
        theme.colors.Green2,
      )} 
\\end{bmatrix*} =
\\begin{bmatrix*}[r]
${texColor(circlePos.x.toFixed(0), theme.colors.Red)} \\\\
${texColor(circlePos.y.toFixed(0), theme.colors.Green1)} \\\\
\\end{bmatrix*}
    `,
      theme.colors.White,
    );
  });

  const sceneStyle: SceneContainerProps = {
    lineWidth: 0,
    width: 900,
    height: 600,
    y: 150,
    showAxis: true,
    gridSpacing: 50,
    scale: 0,
  };

  yield view.add(
    <>
      <Rect
        ref={highlightRect}
        fill={`${theme.colors.Green1}44`}
        position={[-298, -4]}
        size={[80, 100]}
        lineWidth={4}
        stroke={theme.colors.Green1}
        radius={14}
        scale={0}
        smoothCorners
      />

      <Latex
        ref={texSeparate}
        tex={texColor(scalingTranslationFormulaTex, theme.colors.White)}
        height={250}
      />

      <Latex
        ref={texCombined}
        tex={texColor(scalingTranslationFormulaCombinedTex, theme.colors.White)}
        position={[-164, 100]}
        height={250}
        opacity={0}
      />

      <SceneContainer ref={compositeScene} {...sceneStyle}>
        <CircleObject ref={circle1} position={[-100, -100]} />
      </SceneContainer>

      <SceneContainer ref={demonstrationScene} {...sceneStyle}>
        <RectObject ref={rect}>
          <CircleObject ref={circle2} position={[300, -200]}>
            <Circle
              ref={circlePositionDot}
              size={12}
              fill={theme.colors.White}
              scale={0}
            />
          </CircleObject>
        </RectObject>

        <Vector
          ref={scaledVector}
          from={() => rect().position()}
          to={() =>
            circle2()
              .absolutePosition()
              .transformAsPoint(demonstrationScene().worldToLocal())
          }
        />

        <Layout
          ref={rGroup}
          scale={0}
          alignItems={'center'}
          fontSize={28}
          fontFamily={theme.fonts.mono}
          fontWeight={400}
          gap={12}
          offset={-1}
          position={() =>
            scaledVector()
              .getPointAtPercentage(0.5)
              .position.transformAsPoint(scaledVector().localToWorld())
              .transformAsPoint(demonstrationScene().worldToLocal())
              .add([20, 0])
          }
          layout
        >
          <Txt text={'R'} fill={theme.colors.Gray1} />
          <Coordinates
            coordinates={[300, -200]}
            xColor={theme.colors.White}
            yColor={theme.colors.White}
          />
        </Layout>

        <Layout
          direction={'column'}
          gap={12}
          position={() => rect().position().add([30, 90])}
          fontSize={28}
          fontFamily={theme.fonts.mono}
          fontWeight={400}
          layout
        >
          <Layout ref={pGroup} gap={12} scale={0}>
            <Txt text={'P'} fill={theme.colors.Gray1} />
            <Coordinates
              ref={rectCoordinates}
              xColor={theme.colors.Blue1}
              yColor={theme.colors.Blue1}
              coordinates={() => rect().position()}
            />
          </Layout>

          <Layout ref={sGroup} gap={12} scale={0}>
            <Txt text={'S'} fill={theme.colors.Gray1} />
            <Coordinates
              xColor={theme.colors.Green2}
              yColor={theme.colors.Green2}
              coordinates={() => rect().scale()}
              decimals={2}
            />
          </Layout>
        </Layout>

        <Latex
          ref={vectorFormula}
          tex={texColor(vectorTex, theme.colors.White)}
          offset={[1, 0]}
          height={86}
          position={() =>
            circle2()
              .absolutePosition()
              .transformAsPoint(demonstrationScene().worldToLocal())
              .add([-35, -30])
          }
          opacity={0}
        />

        <Latex
          ref={positionFormula}
          tex={animatedTex}
          offset={[1, 0]}
          height={75}
          position={() =>
            circle2()
              .absolutePosition()
              .transformAsPoint(demonstrationScene().worldToLocal())
              .add([-35, -30])
          }
          opacity={0}
        />
      </SceneContainer>

      <Cursor ref={cursor} position={[150, 100]} scale={0} />
    </>,
  );

  yield* slideTransition(Direction.Right, 1);

  yield* waitUntil('highlight S');
  yield* highlightRect().scale(1, 0.7, easeOutBack);

  yield* waitUntil('highlight scaling matrix');
  yield* all(
    highlightRect().size([380, 300], 1),
    highlightRect().position.x(397, 1),
  );

  yield* waitUntil('move matrix');
  yield* all(
    texSeparate().position.y(-350, 0.7),
    highlightRect().position.y(-350, 0.7),
  );

  yield* waitUntil('highlight multiplication');
  yield* all(highlightRect().width(760, 1), highlightRect().position.x(213, 1));

  yield* waitUntil('show example scene');
  yield* compositeScene().scale(1, 0.7, easeOutBack);

  yield* waitUntil('show scale');
  yield* sequence(
    0.1,
    all(highlightRect().width(390, 0.7), highlightRect().position.x(398, 0.7)),
    circle1().position(circle1().position().scale(1.5), 0.8),
  );

  yield* waitUntil('show translation');
  yield* sequence(
    0.1,
    all(highlightRect().width(360, 0.7), highlightRect().position.x(12, 0.7)),
    translate(circle1(), [100, -100], 0.7),
  );

  yield* waitUntil('hide scene');
  yield* sequence(
    0.3,
    compositeScene().scale(0, 0.6, easeInBack),
    highlightRect().scale(0, 0.6, easeInBack),
    texSeparate().position.y(0, 0.7),
  );

  yield* waitUntil('show combined');
  yield* all(
    texSeparate().position.y(-200, 0.7),
    texCombined().opacity(1, 0.8),
    texCombined().position.y(200, 0.8),
  );

  yield* waitUntil('hide matrix');
  yield* all(
    texCombined().position(0, 0.8),
    texSeparate().opacity(0, 0.7),
    texSeparate().position.y(-300, 0.7),
  );

  yield* waitUntil('show scene 2');
  yield* sequence(
    0.4,
    texCombined().position.y(-350, 0.7),
    demonstrationScene().scale(1, 0.7, easeOutBack),
  );

  yield* waitUntil('show vector formula');
  yield* all(
    circle2().ripple(1),
    circlePositionDot().scale(1, 0.6, easeOutBack),
    vectorFormula().scale(0).opacity(1).scale(1, 0.6, easeOutBack),
  );

  yield* waitUntil('show coordinates');
  yield* sequence(
    0.1,
    ...[pGroup(), sGroup(), rGroup()].map((node) =>
      node.scale(1, 0.6, easeOutBack),
    ),
  );

  yield* waitUntil('show pos calculation');
  yield* sequence(
    0.45,
    vectorFormula().scale(0, 0.6, easeInBack),
    positionFormula().opacity(1).scale(0).scale(1, 0.6, easeOutBack),
  );

  yield* waitUntil('more examples');
  yield* rect().position([-170, 150], 1);
  yield* waitFor(0.3);
  yield* rect().scale(1.3, 1);
  yield* waitFor(0.3);
  yield* all(rect().position(0, 1), rect().scale(1, 1));

  yield* waitUntil('center scene');
  yield* sequence(
    0.1,
    texCombined().position.y(-700, 0.8),
    demonstrationScene().position.y(0, 0.8),
  );

  yield* waitUntil('hide scene 2');
  yield* sequence(
    0.1,
    positionFormula().scale(0, 0.6, easeInBack),
    circlePositionDot().scale(0, 0.6, easeInBack),
    pGroup().scale(0, 0.6, easeInBack),
    sGroup().scale(0, 0.6, easeInBack),
    rGroup().scale(0, 0.6, easeInBack),
    scaledVector().end(0, 0.6),
    demonstrationScene().size([1000, 800], 1.3),
  );

  yield* waitUntil('scene end');
});
