'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('data/chat-knowledge.js', 'utf8'), context);
// Exercise the real matcher without initializing the UI.
const source = fs.readFileSync('js/chatbox.js', 'utf8');
vm.runInContext(source.slice(0, source.indexOf('  function init()')) + 'window.matchAnswer = findAnswer; })();', context);
for (const [question, expected] of [
  ['Will my child learn English if they still nap?', 'preschool-nap-english'],
  ['Do napping children get English instruction?', 'preschool-nap-english'],
  ['Does half day include English classes?', 'preschool-half-day-english'],
  ['Does morning half-day preschool include afternoon English classes?', 'preschool-half-day-english'],
  ['What is the afternoon English curriculum?', 'preschool-afternoon-english'],
  ['How does morning immersion work?', 'preschool-morning-language'],
  ['How much is tuition?', 'tuition']
]) {
  test(question, () => assert.equal(context.window.matchAnswer(question)?.id, expected));
}
