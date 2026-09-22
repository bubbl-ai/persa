/**
 * Where a compiled personality is going.
 *
 * Each target says three things: how long the text is allowed to be, how it
 * should be framed (a settings field the agent reads as its own system
 * prompt, versus a message you send the agent in chat), and where a human
 * pastes it. Limits are the real product limits; `null` means no practical
 * cap.
 */

import { PersonaError } from './persona.js';

/**
 * @typedef {object} Target
 * @property {string} id
 * @property {string} label
 * @property {number|null} limit   character budget, or null for unbounded
 * @property {'system'|'message'} framing
 * @property {boolean} markdown    false when the field eats formatting
 * @property {string} where        one line telling a human where to paste it
 * @property {'paste'|'connect'} how  a block of text a person copies, or a
 *                                 URL the agent reads for itself
 * @property {string[]} steps      what a person does, in order, in the other
 *                                 product's own words. The hosted app renders
 *                                 these; the CLI prints `where`.
 */

/** @type {Record<string, Target>} */
export const TARGETS = {
  grok: {
    id: 'grok',
    label: 'Grok — Custom Agent',
    limit: 4000,
    framing: 'system',
    markdown: true,
    where: 'Grok → Custom Agents → your agent → System instructions (4,000 character cap).',
    how: 'paste',
    steps: [
      'Open Grok and go to Custom Agents.',
      'Create an agent, or open one you already have.',
      'Paste this into System instructions, replacing what is there.',
      'Save, then start a conversation with that agent.'
    ]
  },
  muse: {
    id: 'muse',
    label: 'Meta Muse',
    limit: null,
    framing: 'message',
    markdown: true,
    where:
      'Either connect the Persa MCP server as a Custom Connector (`persa serve --http`) ' +
      'and Muse will read the personality itself, or send this text to Muse once and ask it to remember it.',
    how: 'connect',
    steps: [
      'Copy your connector URL.',
      'In Muse, open Settings and find Custom Connectors.',
      'Add a connector and paste the URL.',
      'Muse tests it and saves it as a skill. Later edits here reach it on its next call.'
    ]
  },
  instinct: {
    id: 'instinct',
    label: 'Instinct — text message',
    limit: 1200,
    framing: 'message',
    markdown: false,
    where: 'Text it to Instinct as a single message. It has no settings screen, so this is the way in.',
    how: 'paste',
    steps: [
      'Copy the message.',
      'Send it to Instinct as a single text.',
      'Instinct has no settings screen, so this is the way in.',
      'Send it again if it ever seems to forget.'
    ]
  },
  claude: {
    id: 'claude',
    label: 'Claude — Project instructions',
    limit: null,
    framing: 'system',
    markdown: true,
    where: 'Claude → your Project → Set project instructions. (Or add the Persa MCP server and skip the paste.)',
    how: 'connect',
    steps: [
      'Copy your connector URL.',
      'In Claude, open Settings, then Connectors.',
      'Add a custom connector and paste the URL.',
      'Start a new chat. The personality applies with no tool call.'
    ]
  },
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT — Custom instructions',
    limit: 1500,
    framing: 'system',
    markdown: true,
    where: 'ChatGPT → Settings → Personalization → Custom instructions → "How would you like ChatGPT to respond?"',
    how: 'paste',
    steps: [
      'Copy the text.',
      'In ChatGPT, open Settings, then Personalization.',
      'Open Custom instructions.',
      'Paste into "How would you like ChatGPT to respond?" and save.'
    ]
  },
  plain: {
    id: 'plain',
    label: 'Plain text — any agent',
    limit: null,
    framing: 'system',
    markdown: false,
    where: 'Paste into whatever custom-instructions box the agent gives you.',
    how: 'paste',
    steps: [
      'Copy the text.',
      'Paste it wherever that agent keeps its instructions.',
      'No markdown and no product framing, so it survives a plain text box.'
    ]
  }
};

export const TARGET_IDS = Object.keys(TARGETS);

export function getTarget(id) {
  const t = TARGETS[id];
  if (!t) {
    throw new PersonaError(`Unknown target "${id}". Known targets: ${TARGET_IDS.join(', ')}.`);
  }
  return t;
}
