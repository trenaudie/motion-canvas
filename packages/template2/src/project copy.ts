// project.ts
import { makeProject } from '@motion-canvas/core';
import { makeScene2D } from '@motion-canvas/2d';


async function loadRemoteScene(): Promise<any> {
  const resp = await fetch('http://localhost:8000/scene');
  if (!resp.ok) {
    throw new Error(`Failed to load scene: ${resp.statusText}`);
  }
  const { code } = (await resp.json()) as { code: string };
  console.log(`received code\n${code}`)
  // 1. Turn the raw JS/TS+JSX source string into a “file” the module loader can fetch.
  const blob = new Blob([code], { type: 'application/javascript' });

  // 2. Create a URL pointing at that in-memory “file.”
  const url = URL.createObjectURL(blob);

  // 3. Dynamically import it as if it were an external ES module.
  //    The browser (and Vite) will parse its imports/exports/JSX correctly.
  const module = await import(/* @vite-ignore */ url);

  // 4. The default export of your module is the scene‐factory function.
  const sceneFactory = module.default;
  console.log(`sceneFactory\n${sceneFactory}`)
  return sceneFactory;

}

// 3. At top-level, await the loaded scene…
const remoteScene = await loadRemoteScene();
const scene_description= makeScene2D(remoteScene);

export default makeProject({
  experimentalFeatures: true,
  scenes: [scene_description],
});

