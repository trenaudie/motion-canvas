// services/ai-scene-server/src/server.ts
import express from 'express';
import cors from 'cors';
import { build, LibraryFormats, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, unlinkSync, existsSync } from 'fs'; // Added existsSync for debugging
import { join, resolve } from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// --- CORRECTED PATH RESOLUTION ---
// PROJECT_ROOT resolves to services/ai-scene-server/
const PROJECT_ROOT = resolve(__dirname, '..'); // Go up two levels from src (or dist) to the 'ai-scene-server' root.
// If server.ts is in `src`, then `__dirname` is `.../ai-scene-server/src`.
// `resolve(__dirname, '..')` -> `.../ai-scene-server`.
// No, this is incorrect again. Let's rethink `__dirname`.
// If `__dirname` is `services/ai-scene-server/src` (running `ts-node src/server.ts`),
// then `src/scene-build` is `join(__dirname, 'scene-build')`.

// If `__dirname` is `services/ai-scene-server/dist` (running `node dist/server.js`),
// then we need to go up to `services/ai-scene-server` (`resolve(__dirname, '..')`)
// and then into `src/scene-build`.

// Let's make this path calculation more robust based on the provided hierarchy:
// The scene-build directory is inside 'src'.
const SCENE_BUILD_DIR = join(__dirname, 'scene-build');
// --- END CORRECTED PATH RESOLUTION ---

const SCENE_INPUT_FILE_RELATIVE = 'scene-input.tsx'; // This is relative to SCENE_BUILD_DIR
const SCENE_OUTPUT_FILE_RELATIVE = 'scene-output.js'; // This is relative to SCENE_BUILD_DIR
const SCENE_OUTPUT_FILE_FULL_PATH = join(SCENE_BUILD_DIR, SCENE_OUTPUT_FILE_RELATIVE); // Full path to read the output

// --- Add console logs for debugging paths (keep these in for initial testing) ---
console.log(`Current __dirname: ${__dirname}`);
console.log(`PROJECT_ROOT: ${PROJECT_ROOT}`);
console.log(`Calculated SCENE_BUILD_DIR: ${SCENE_BUILD_DIR}`);
console.log(`Vite entry will look for (absolute): ${join(SCENE_BUILD_DIR, SCENE_INPUT_FILE_RELATIVE)}`);
console.log(`Output will be written to (absolute): ${SCENE_OUTPUT_FILE_FULL_PATH}`);

// --- Verify existence (for debugging) ---
if (!existsSync(SCENE_BUILD_DIR)) {
    console.error(`ERROR: SCENE_BUILD_DIR does not exist: ${SCENE_BUILD_DIR}`);
    // process.exit(1); // Exit if critical directory not found
}
if (!existsSync(join(SCENE_BUILD_DIR, SCENE_INPUT_FILE_RELATIVE))) {
    console.error(`ERROR: Scene input file does not exist: ${join(SCENE_BUILD_DIR, SCENE_INPUT_FILE_RELATIVE)}`);
    // process.exit(1); // Exit if critical file not found
}
// --- End console logs and verification ---


app.get('/scene', async (__, res) => {
    try {
        const viteConfig = {
            // Set the root to the correctly calculated SCENE_BUILD_DIR
            root: SCENE_BUILD_DIR,
            mode: 'production',
            plugins: [
                react({
                    jsxRuntime: 'automatic',
                    include: /\.(ts|tsx)$/,
                }) as PluginOption,
            ],
            define: {
                'process.env.NODE_ENV': JSON.stringify('production'), // Or 'development'
                // 'global': 'window', // Sometimes 'global' is also undefined in browser
                // 'process': '{}', // Less common, but could define an empty object if needed
            },
            // -
            build: {
                write: true,
                emptyOutDir: false,
                lib: {
                    entry: SCENE_INPUT_FILE_RELATIVE, // This path is relative to the 'root'
                    name: 'MotionCanvasRemoteScene',
                    fileName: () => SCENE_OUTPUT_FILE_RELATIVE, // This path is relative to 'outDir'
                    formats: ['es'] as LibraryFormats[],
                },
                outDir: '.', // This means output into the 'root' directory (SCENE_BUILD_DIR)
                rollupOptions: {
                    external: [
                        // '@motion-canvas/2d',
                        // '@motion-canvas/core',
                        // Add any other Motion Canvas packages used in the remote scene
                    ],
                    output: {
                        globals: {
                            '@motion-canvas/2d': 'MotionCanvas2D',
                            '@motion-canvas/core': 'MotionCanvasCore',
                        },
                    },
                },
            },
        };

        await build(viteConfig);

        const bundledCode = readFileSync(SCENE_OUTPUT_FILE_FULL_PATH, 'utf-8');

        try {
            unlinkSync(SCENE_OUTPUT_FILE_FULL_PATH);
        } catch (e: any) {
            if (e.code !== 'ENOENT')
                console.warn(`Could not delete ${SCENE_OUTPUT_FILE_FULL_PATH}:`, e.message);
        }

        res.json({ code: bundledCode });
    } catch (err: any) {
        console.error('Error bundling or sending scene to frontend:', err, '\nError code:', (err as any).code);
        res.status(500).json({ error: 'Failed to bundle and send scene code' });
    }
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`AI-scene server listening on http://localhost:${PORT}`);
});