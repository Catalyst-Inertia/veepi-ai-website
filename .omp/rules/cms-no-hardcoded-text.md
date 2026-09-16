---
name: cms-no-hardcoded-text
description: 'Never hardcode prose directly into CMS component blocks'
condition: 'VeePi transforms your existing'
scope: ['tool:edit(*.tsx)', 'tool:write(*.tsx)']
---

Do not hardcode prose or content paragraphs directly into CMS components. Always make it CMS compatible by extending the block schema (e.g., adding a `richTextField` to `schema.block.ts`), updating the seed scripts, and passing the content dynamically as props.
