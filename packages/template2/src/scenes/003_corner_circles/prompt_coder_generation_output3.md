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
