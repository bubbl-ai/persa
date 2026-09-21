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
 */

/** @type {Record<string, Target>} */
export const TARGETS = {
  grok: {
    id: 'grok',
    label: 'Grok — Custom Agent',
    limit: 4000,
    framing: 'system',
    markdown: true,
    where: 'Grok → Custom Agents → your agent → System instructions (4,000 character cap).'
  },
  muse: {
    id: 'muse',
    label: 'Meta Muse',
    limit: null,
    framing: 'message',
    markdown: true,
    where:
      'Either connect the Persa MCP server as a Custom Connector (`persa serve --http`) ' +
      'and Muse will read the personality itself, or send this text to Muse once and ask it to remember it.'
  },
  instinct: {
    id: 'instinct',
    label: 'Instinct — text message',
    limit: 1200,
    framing: 'message',
    markdown: false,
    where: 'Text it to Instinct as a single message. It has no settings screen, so this is the way in.'
  },
  claude: {
    id: 'claude',
    label: 'Claude — Project instructions',
    limit: null,
    framing: 'system',
    markdown: true,
    where: 'Claude → your Project → Set project instructions. (Or add the Persa MCP server and skip the paste.)'
  },
  chatgpt: {
    id: 'chatgpt',
    label: 'ChatGPT — Custom instructions',
    limit: 1500,
    framing: 'system',
    markdown: true,
    where: 'ChatGPT → Settings → Personalization → Custom instructions → "How would you like ChatGPT to respond?"'
  },
  plain: {
    id: 'plain',
    label: 'Plain text — any agent',
    limit: null,
    framing: 'system',
    markdown: false,
    where: 'Paste into whatever custom-instructions box the agent gives you.'
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
