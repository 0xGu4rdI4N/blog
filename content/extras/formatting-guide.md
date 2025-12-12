---
type: 'tool'
title: "Markdown Formatting Cheat Sheet"
date: '2025-12-12'
---
Here is a quick reference for the formatting options available on this site:

**Text Styling**
- **Bold**: `**text**`
- *Italic*: `*text*`
- `Code`: `` `text` ``
- [Link](https://example.com): `[Link](url)`

**Math (Katex)**
- Inline: `$E=mc^2$` -> $E=mc^2$
- Block: `$$ \sum_{i=0}^n i^2 = \frac{(n^2+n)(2n+1)}{6} $$`

**Common Math Symbols**
- **Equation from image**: `$$ \theta''(t) + \frac{g}{L} \sin \theta = 0 $$`
- **Fractions**: `\frac{a}{b}` -> $\frac{a}{b}$
- **Greek Letters**: `\theta`, `\pi`, `\alpha`, `\beta` -> $\theta, \pi, \alpha, \beta$
- **Derivatives**: `f'(x)`, `f''(x)`, `\dot{x}`, `\ddot{x}` -> $f'(x), f''(x), \dot{x}, \ddot{x}$
- **Functions**: `\sin`, `\cos`, `\log`, `\ln` -> $\sin, \cos, \log, \ln$

**Advanced Formatting**
- **Superscript**: `<sup>text</sup>` -> <sup>text</sup>
- **Subscript**: `<sub>text</sub>` -> <sub>text</sub>
- **Centering**:
  ```markdown
  :::cent
  Centered Text
  :::
  ```
- **Pink Callout**:
  ```markdown
  :::pink
  This is a sweet pink block!
  :::
  ```
- **Special Characters**:
  - Star: `★` or `&starf;`
  - Copyright: `&copy;` -> ©
  - Arrows: `&rarr;` -> →

**Code Blocks**
```python
def hello():
    print("Hello World")
```
Use triple backticks with the language name.

**Lists**
- Item 1
- Item 2
  - Nested Item (indent with 2-4 spaces)

1. Ordered 1
2. Ordered 2
   
   You can add paragraphs under a list item by indenting them with 4 spaces (or 1 tab).
   
   - And even nested lists inside that!

**Quotes**
> This is a blockquote.
