/** Library entry point — everything `persa` does, callable from code. */
export { loadPersona, parsePersona, normalize, toYaml, savePersona, resolvePersonaPath, PersonaError } from './persona.js';
export { compile, compileAll, buildSections } from './compile.js';
export { TARGETS, TARGET_IDS, getTarget } from './targets.js';
export { TRAITS, TRAIT_NAMES, phraseFor } from './traits.js';
export { createServer, serveStdio, serveHttp } from './mcp.js';
export { serveEditor } from './editor.js';
