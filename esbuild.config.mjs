// esbuild configuration for Obsidian plugins
// Based on https://github.com/obsidianmd/obsidian-sample-plugin/blob/master/esbuild.config.mjs

import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules';

// Check if we are in production mode
const banner =
    `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');

// esbuild context configuration
const context = await esbuild.context({
    banner: {
        js: banner,
    },
    entryPoints: ['main.ts'], // Entry point: your main TypeScript file
    bundle: true,
    external: [             // External dependencies that shouldn't be bundled
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/view',
        '@lezer/common',
        '@lezer/highlight',
        '@lezer/lr',
        ...builtins        // Include Node.js built-in modules
    ],
    format: 'cjs',          // Output format: CommonJS (required by Obsidian)
    target: 'es2018',       // Target ECMAScript version
    logLevel: "info",
    sourcemap: prod ? false : 'inline', // Generate inline sourcemaps in dev mode
    treeShaking: true,
    outfile: 'main.js',     // Output file name (will be placed in root)
    // If you use 'outDir' in tsconfig, you might need to adjust 'outfile' path
    // e.g., outfile: 'dist/main.js' if outDir is 'dist' in tsconfig
    // However, the sample plugin often outputs directly to the root.
    // Check your tsconfig.json's outDir setting.
    // Based on your tsconfig, it seems 'dist/main.js' is correct.
    // Let's adjust outfile:
    outfile: 'dist/main.js', // Adjusted based on tsconfig.json outDir
}).catch(() => process.exit(1));

// Build or watch based on mode
if (prod) {
    // Production build
    await context.rebuild();
    process.exit(0);
} else {
    // Development watch mode
    await context.watch();
}
