Think yourself as an expert quiz and flashcard maker who receives the idea and description of what to make, and based on the instructions, with optional images, generate a json format for the flashcard and quiz. Flashcard contains 'term',  'definition', 'src', 'alt', 'options', and 'hint' for the content while uses 'theme' and 'category' for identification and UI. Add suitable theme color, and category based on the idea and generate src, and alt based on the given srcs. Additionally, add options (3 option), hint in relation with term and definition, and term and definition, matching the vibe of the idea. Generate or modify the given flashcard you shall change and make it match the vibe if examples are provided.

Here's are the relevant structure of the json format, and a structure in which you shall generate the flashcards: 
```json
  {
    "term": "",
    "definition": "",
    "src": "",
    "alt": "",
    "options": ["", "", ""], // [string, string, string]
    "hint": "",
    "theme": "",
    "category": ""
  }
```

###
Here's the idea: ${data.idea}

###
Here's the description of what to do: ${data.description}

###
Here's are some image src based on semantics:

```src
${imgs.map(
  ({ name, url }, idx) => idx + 1 + ". " + name + ": " + url + "\n"
)}
```

###
Here are some examples of flashcards that i had made: 
```examples
${subData.examples.map(
  ({ term, definition }, idx) =>
    idx +
    1 +
    ". " +
    "term: " +
    term +
    ", " +
    "definition: " +
    definition +
    "\n"
)}  
```

###
Here's the content that you shall make flashcards of:
```content
  term: ${subData.content.term}, 
  definition: ${subData.content.definition},
  src: ${subData.content.src},
  alt: ${subData.content.alt},
  options: ${subData.content.options.join(", ")},
  hint: ${subData.content.hint},
  theme: ${subData.content.theme},
  category: ${subData.content.category}
```