# Excalidraw Blog Theme Image Prompt Template

Use this reusable template with AI image generators (e.g. Imagen, Midjourney, DALL-E) to produce diagrams matching the exact visual style of the blog.

---

## 🎨 Master Prompt Template

```text
An authentic Excalidraw-style minimalist hand-drawn technical diagram on a pure clean solid white background (#ffffff). 

Visual Style:
- Sketchy hand-drawn rectangular boxes with soft pastel fills and clean black outlines.
- Clean, legible handwritten-style sans font with clear text hierarchy.
- Color palette: soft pastel pink (#ec4899) and emerald green (#10b981) accents.
- Neat, single hand-drawn arrows (no messy overlapping or duplicated lines).
- Balanced horizontal layout with generous white space and minimal clutter.

Diagram Structure:
- Left Side: Heading "[LEFT_HEADING]" above a sequence of steps:
  [BOX_1_LABEL] (green pastel fill) -> simple black arrow -> [BOX_2_LABEL] (pink pastel fill) -> simple black arrow -> [BOX_3_LABEL] (pink pastel fill).
  Below the boxes, a single clean pink curved sketchy arrow loops back labeled "[LOOP_LABEL]".

- Center: A wide hand-drawn outline transition arrow pointing right, clearly labeled "[TRANSITION_LABEL]".

- Right Side: Heading "[RIGHT_HEADING]" clearly positioned above:
  Two boxes: "[AGENT_OR_CORE_BOX]" (emerald green fill) and "[TOOL_OR_ENV_BOX]" (pink pastel fill).
  Connected by a clean two-way circular feedback loop: a single curved black arrow on top pointing right, and a single curved black arrow on the bottom pointing left.
```

---

## 📋 Variables Cheat Sheet

| Variable | Description | Example (AINA Part 0) |
|---|---|---|
| `[LEFT_HEADING]` | Title for the baseline/current workflow | `Traditional Workflow` |
| `[BOX_1_LABEL]` | First stage box | `Circuit Design Engineer (Sizing)` |
| `[BOX_2_LABEL]` | Second stage box | `Layout Engineer` |
| `[BOX_3_LABEL]` | Final extraction/eval box | `PEX Extraction` |
| `[LOOP_LABEL]` | Feedback loop penalty/bottleneck text | `Ping-Pong Redesign Loop (Weeks)` |
| `[TRANSITION_LABEL]` | Label inside the center arrow | `Transition to` |
| `[RIGHT_HEADING]` | Title for the proposed/agentic workflow | `Intended Workflow` |
| `[AGENT_OR_CORE_BOX]` | Core AI / Decision engine | `AINA (AI4aNAlog)` |
| `[TOOL_OR_ENV_BOX]` | Environment / Evaluation harness | `SPICE Simulation` |

---

## 💡 Quick Tips for Best Results

1. **Background**: Use `pure solid white background (#ffffff)` for high-contrast light mode, or switch to `warm cream tainted white-yellowish paper background (#fbf9f4)` if you prefer the subtle parchment look.
2. **Preventing Arrow Glitches**: Always specify *"single clean curved arrow"* and *"no duplicate lines, neat and clear"* to prevent diffusion models from drawing doubled or chaotic sketch loops.
3. **Aspect Ratio**: `--ar 16:9` works best for wide horizontal process comparison diagrams in blog posts.
