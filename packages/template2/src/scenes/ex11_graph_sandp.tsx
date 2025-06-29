import {
    Circle,
    Grid,
    Layout,
    Line,
    Node,
    Rect,
    Txt,
    makeScene2D,
  } from '@motion-canvas/2d';
  import {
    all,
    createSignal,
    easeInOutBounce,
    linear,
    map,
    tween,
    waitFor,
  } from '@motion-canvas/core';
  import {createRef} from '@motion-canvas/core';
      // Generate more realistic synthetic S&P 500 data

// Function to generate more realistic synthetic S&P 500 data
function generateRealisticSandPData(numPoints: number) {
    const data = [];
    let currentValue = 100; // Starting value

    for (let i = 0; i < numPoints; i++) {
        // Add some randomness to simulate market fluctuations
        const fluctuation = (Math.random() - 0.5) * 10; // Random value between -5 and 5
        currentValue += fluctuation;

        // Ensure the overall trend is upward
        if (i % 3 === 0) {
            currentValue += 5; // Add an upward trend every few points
        }
        data.push({ time: i, value: currentValue });
    }

    return data;
}

export default makeScene2D(function* (view) {
    // Signals
    const num_points = 1000;
    const sandp_data = generateRealisticSandPData(num_points);
    
    // Find min and max values for normalization
    const minValue = Math.min(...sandp_data.map(d => d.value));
    const maxValue = Math.max(...sandp_data.map(d => d.value));
    
    const time = createSignal(0);
    const value = createSignal(0);
    const dataIndex = createSignal(0);
    
    const rectref = createRef<Rect>();
    const line_vertical = createRef<Line>();
    const line_horizontal = createRef<Line>();
    // Animation time
    const TIME = 3.5;
    const gridref = createRef<Grid>();
    view.add(
      <Node y={-30}>
        {/* Grid and animated point */}
        <Grid ref={gridref} size={700} stroke={'#444'} lineWidth={3} spacing={100} start={0} end={0} >
          <Rect
            ref={rectref}
            layout
            size={100}
            offset={[-1, 1]}
            x={() => time() * 500 - 300}
            y={() => {
              // Map the current S&P value to our y-coordinate space
              const idx = Math.floor(dataIndex() * (sandp_data.length - 1));
              const dataValue = sandp_data[idx].value;
              // Normalize to [0,1] range and then map to our coordinate space
              return map(minValue, maxValue, dataValue) * -500 + 300;
            }}
            lineWidth={4} 
          >
            <Circle size={60} fill={'#C22929'} margin={20}></Circle>
          </Rect>
        </Grid>
        {/* Vertical */}
        <Node position={[-400, -400]}>
          {/* Axis */}
          <Line
            ref={line_vertical}
            lineWidth={4}
            points={[
              [0, 750],
              [0, 35],
            ]}
            stroke={'#DDD'}
            lineCap={'round'}
            endArrow
            arrowSize={15}
            start={0}
            end={0}
          ></Line>
  
          {/* Tracker for y */}
          <Layout y={() => {
            // Use the same data mapping for the tracker
            const idx = Math.floor(dataIndex() * (sandp_data.length - 1));
            const dataValue = sandp_data[idx].value;
            // Map to tracker position
            return map(minValue, maxValue, dataValue) * -500 + 650;
          }}>
            <Txt
              fill={'#DDD'}
              text={() => {
                const idx = Math.floor(dataIndex() * (sandp_data.length - 1));
                return sandp_data[idx].value.toFixed(2);
              }}
              fontWeight={300}
              fontSize={30}
              x={-55}
              y={3}
            ></Txt>
            <Circle size={30} fill={'#DDD'}></Circle>
          </Layout>
          {/* Label */}
          <Txt
            y={400}
            x={-160}
            fontWeight={400}
            fontSize={50}
            padding={20}
            fontFamily={'Candara'}
            fill={'#DDD'}
            text={'S&P VALUE'}
          ></Txt>
        </Node>
  
        {/* Horizontal */}
        <Node position={[-400, -400]}>
          {/* Axis */}
          <Line
            ref={line_horizontal}
            lineWidth={4}
            points={[
              [50, 800],
              [765, 800],
            ]}
            stroke={'#DDD'}
            lineCap={'round'}
            endArrow
            arrowSize={15}
            start={0}
            end={0}
          ></Line>
  
          {/* Tracker */}
          <Layout y={800} x={() => time() * 500 + 150}>
            <Circle size={30} fill={'#DDD'}></Circle>
            <Txt
              fill={'#DDD'}
              text={() => {
                const idx = Math.floor(dataIndex() * (sandp_data.length - 1));
                return sandp_data[idx].time.toString();
              }}
              fontWeight={300}
              fontSize={30}
              y={50}
            ></Txt>
          </Layout>
  
          {/* Label */}
          <Txt
            y={900}
            x={400}
            fontWeight={400}
            fontSize={50}
            padding={20}
            fontFamily={'Candara'}
            fill={'#DDD'}
            text={'TIME'}
          ></Txt>
        </Node>
      </Node>,
    );

    yield* gridref().end(1,2);
    yield* line_vertical().end(1,2);
    yield* line_horizontal().end(1,2);
    yield* waitFor(0.5);
    
    // Animate through the S&P data
    yield* all(
      time(1, TIME, linear),
      dataIndex(1, TIME, easeInOutBounce)
    );
    
    yield* waitFor(0.8);
  });
  