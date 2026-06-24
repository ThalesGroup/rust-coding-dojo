import { mountAssistant, type AssistantWidget } from './assistant-widget';
import './styles.css';

const root = document.getElementById('assistant-root');
const debugToggle = document.getElementById('debug-mode-toggle') as HTMLInputElement | null;
const kataZone = document.getElementById('kata-zone') as HTMLTextAreaElement | null;
const askKataButton = document.getElementById('ask-kata-button') as HTMLButtonElement | null;

const KATA_CONTEXT = `# Ownership Borrowing

Kata for the STARTER package of the Rust coding DOJO.

Level / Duration: Intermediate / 60 minutes

## Exercise 1

Instruction: Make the program compile and add the line of code to multiply each element by two.

\`\`\`rust
fn mul_two(buffer_s: [i32]) {
    for element in buffer_s {
        // multiply the element by two
    }
}

fn main() {
    let mut buffer_s = [1, 23, 41, 83, 40, 91, 10];
    mul_two(buffer_s);
    println!("{:?}", buffer_s);
}
\`\`\`

Run with:

\`\`\`bash
cargo run --bin exercise_1
\`\`\`
`;

if (!root) {
  throw new Error('Missing #assistant-root container');
}

const assistantRoot = root;
let widget: AssistantWidget | null = null;

if (kataZone) {
  kataZone.value = KATA_CONTEXT;
}

function mountCurrentAssistant() {
  widget = mountAssistant(assistantRoot, {
    debug: debugToggle?.checked ?? false,
    autoLoad: false,
    contextProvider: getExerciseContext,
  });
}

debugToggle?.addEventListener('change', () => {
  const previousWidget = widget;
  widget = null;
  void previousWidget?.destroy().finally(mountCurrentAssistant);
});

askKataButton?.addEventListener('click', () => {
  if (!widget) return;

  void widget.generate(getSelectedKataText() || 'Donne un indice progressif sans fournir directement la solution complète.');
});

mountCurrentAssistant();

function getSelectedKataText() {
  if (!kataZone) return '';
  const { selectionStart, selectionEnd, value } = kataZone;
  if (selectionStart === selectionEnd) return '';
  return value.slice(selectionStart, selectionEnd).trim();
}

function getExerciseContext() {
  const exercise = document.getElementById('exercise');
  if (!exercise) return '';

  const fields = exercise.querySelectorAll('textarea, input, select');
  if (fields.length === 0) {
    return exercise.textContent?.trim() ?? '';
  }

  return Array.from(fields)
    .map((field) => getFieldContext(field))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function getFieldContext(field: Element) {
  if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
    return field.value.trim();
  }

  if (field instanceof HTMLSelectElement) {
    return field.selectedOptions[0]?.textContent?.trim() ?? field.value.trim();
  }

  return '';
}
