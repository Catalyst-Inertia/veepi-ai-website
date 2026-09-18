---
name: styling-no-style-tags
description: 'Never use <style> tags. Always use Tailwind CSS. Use inline styles only for CSS variables.'
condition: 'style'
scope: ['tool:edit(*.tsx, *.jsx)', 'tool:write(*.tsx, *.jsx)']
---

Never use `<style>` tags or styled-components-like `<style jsx>` tags in the project.

- Instead, always use **Tailwind CSS** classes for styling.
- If a dynamic CSS variable is needed, use an inline style prop directly on the element (e.g., `style={{ "--width": 0 }}`). Do not put normal CSS properties in the `style` prop, only CSS variables.
