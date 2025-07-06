import { makeProject } from '@motion-canvas/core';

import scene2d from './scenes/asset1?scene';
import { loadSVG } from './scenes/utils';
import { makeScene2D } from '@motion-canvas/2d';

const svgPath = "/svg_assets/person-wave-svgrepo-com.svg";
console.log("INSIDE PROJECT WIP .TS")
const svg_string: string = await loadSVG(svgPath);
const thread_generator = scene2d['config']
console.log('thread_generator', thread_generator)

if (!thread_generator) {
  throw new Error('Thread generator not found');
}

const final_scene  = makeScene2D(thread_generator)

export default makeProject({
  experimentalFeatures: true,
  scenes: [final_scene]
})