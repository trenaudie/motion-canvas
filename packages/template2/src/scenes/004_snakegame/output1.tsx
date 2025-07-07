
import { Circle, Node, Rect, makeScene2D, SceneContainer } from '@motion-canvas/2d';
import {
    all,
    createSignal,
    easeInOutBack,
    sequence,
    waitFor,
    waitUntil,
} from '@motion-canvas/core';
import { createComputed } from '@motion-canvas/core/lib/signals';
import { easeInOutCubic } from '@motion-canvas/core/lib/tweening';
import { createRef } from '@motion-canvas/core/lib/utils';
import { Vector2 } from '@motion-canvas/core/lib/types';

export default makeScene2D(function* (view) {
    // Constants
    const squareSize = 50;
    const maxSnakeLength = 5;

    // Signals tracking snake length and vertical position of head/focus
    const snakeLength = createSignal(1);
    // Snake vertical base position (topmost square's y)
    // We'll store it as snakeHeadY (0-based numeric "step" count * squareSize)
    const snakeHeadY = createSignal(0);

    // Signal for red food vertical position, discrete steps in multiples of squareSize
    // We'll keep the food x fixed, snake x fixed too.
    // Snake x on left (-100)
    // Food x on right (100)
    const snakeX = -100;
    const foodX = 100;

    // Food vertical steps:
    // We'll choose food vertical position as a multiple of squareSize so snake moves up/down in discrete steps
    // Generate initial food position at 2 steps below snakeHead
    const foodStep = createSignal(2);

    // Computed positions:
    // snakeHead Y in pixels
    const snakeHeadYPixels = createComputed(() => snakeHeadY() * squareSize);

    // foodPosition Y in pixels (step * squareSize)
    const foodYPixels = createComputed(() => foodStep() * squareSize);

    // Red circle visibility
    const foodVisible = createSignal(true);

    // Reference to Nodes
    const snakeNode = createRef<Node>();
    const foodCircle = createRef<Circle>();

    // The snake body is vertical stack of white squares; length from snakeLength()
    // We show squares at snakeX, vertical positions from snakeHeadYPixels() downwards for length
    // To animate "head" movement, we will animate snakeHeadY from current step to foodStep with straight linear movement

    // We'll build the snake body nodes depending on snakeLength()
    // Each square positioned snakeX horizontally, and vertically at snakeHeadYPixels() - index * squareSize (stacked upwards)

    // Signal to hold the current snake length to build squares reactively
    const lengthForRender = createSignal(1);

    // Helper function to create snake squares positions (we have to put squares stacked upwards starting at snakeHeadYPixels)
    // Negative y direction means squares above head; but snake body grows downward actually in snake game.
    // Here, simpler to put squares stacked downward from head y to head y + (length-1)*squareSize (downward)
    // So squares at snakeX, y = snakeHeadYPixels() + i * squareSize for i in 0..length-1

    // We'll manage animation sequences: 
    // Move head vertically in steps to foodStep step
    // On reaching foodStep, food disappears (scale0), snake length doubles (up to 5 max), then new food appears at a random step not occupied by snake.

    // Helper array for positions of snake squares (for rendering)
    const snakeSquaresPositions = createComputed(() => {
    const baseY = snakeHeadYPixels();
    const length = lengthForRender();
    const positions: number[] = [];
    for (let i = 0; i < length; i++) {
        positions.push(baseY + i * squareSize);
    }
    return positions;
    });

    // Function to move snake head stepwise towards foodStep vertically
    async function moveSnakeToFood() {
    const head = snakeHeadY();
    const target = foodStep();
    // Move one step at a time, up or down
    while (head !== target) {
        const stepDir = target > head ? 1 : -1;
        await snakeHeadY(snakeHeadY() + stepDir, 0.15);
    }
    }

    // Function to generate new food position outside snake body
    function generateNewFoodStep(): number {
    // Food step between 0 and max range (maxSnakeLength * 2 conservatively)
    const maxSteps = maxSnakeLength * 3; 
    // Snake occupies steps from snakeHeadY to snakeHeadY + snakeLength -1
    const occupied = new Set<number>();
    for (let i = snakeHeadY(); i < snakeHeadY() + snakeLength(); i++) {
        occupied.add(i);
    }

    // Attempt to find a new step outside occupied
    for (let attempt = 0; attempt < 50; attempt++) {
        const candidate = Math.floor(Math.random() * maxSteps);
        if (!occupied.has(candidate)) {
        return candidate;
        }
    }
    // Fallback: place right above snake head
    return snakeHeadY() - 2;
    }

    // Initial snake length
    lengthForRender(snakeLength());

    // Root container: center stage
    view.add(
    <SceneContainer width={600} height={600} x={0} y={0} scale={1} cache>
        {/* Snake Node: contains white squares stacked vertically */}
        <Node ref={snakeNode} x={snakeX}>
        {/* Using reactive squares by mapping snake length */}
        {
            // We'll just create up to 5 Rects but control visibility by lengthForRender
            // to avoid re-creating nodes each time
            Array.from({ length: maxSnakeLength }).map((_, i) => {
            const posY = createComputed(() => {
                // Position squares stacked down starting from snakeHeadYPixels()
                if (i < lengthForRender()) {
                return snakeHeadYPixels()() + i * squareSize;
                } else {
                // Position offscreen so invisible
                return 10000;
                }
            });
            return (
                <Rect
                key={i}
                width={squareSize}
                height={squareSize}
                fill={'white'}
                stroke={'#ddd'}
                ref={i === 0 ? undefined : undefined}
                y={posY}
                radius={0}
                />
            );
            })
        }
        </Node>

        {/* Red food circle */}
        <Circle
        ref={foodCircle}
        x={foodX}
        y={foodYPixels}
        radius={squareSize / 2}
        fill={'red'}
        opacity={foodVisible().get() ? 1 : 0}
        scale={() => (foodVisible() ? 1 : 0)}
        />
    </SceneContainer>,
    );

    // Main loop: snake moves to food, eats it, grows up to max length 5

    while (snakeLength() <= maxSnakeLength) {
    foodVisible(true);

    // Move snake head stepwise to food
    yield* moveSnakeToFood();

    // Red food disappears
    yield* foodCircle().scale(0, 0.4, easeInOutBack);
    foodVisible(false);

    if (snakeLength() >= maxSnakeLength) {
        break;
    }

    // Double snake length (grow snake), clamp max to 5
    const newLength = Math.min(snakeLength() * 2, maxSnakeLength);
    snakeLength(newLength);
    lengthForRender(newLength);

    // Animate snake growth by scaling snake Node's squares with a small bounce
    yield* all(
        ...snakeNode()
        .children()
        .slice(0, newLength)
        .map((node) => node.scale(0.9, 0.2))
    );
  }
});