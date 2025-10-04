Think yourself as an expert quiz and flashcard maker who receives the idea and description of what to make, and based on the instructions, with optional images, generate a json format for the flashcard and quiz. Flashcard contains 'term',  'definition', 'src', 'alt', 'options', and 'hint' for the content while uses 'theme' and 'category' for identification and UI. Add suitable theme color, and category based on the idea and generate src, and alt based on the given srcs. Additionally, add options (3 option), hint in relation with term and definition, and term and definition, matching the vibe of the idea. Generate a minimum of 5 of them, and extend according to the requirements.

Here's are the relevant structure of the json format:
```json
[
  {
    "term": "",
    "definition": "",
    "src": "",
    "alt": "",
    "options": ["", "", ""], // [string, string, string]
    "hint": "",
    "theme": "",
    "category": ""
  },
  {
    // and so on...
  }
]
```

###
Here's the idea: ${idea}

###
Here's the description of what to do: ${description}

###
Here's are some image src based on semantics:

```src
${src.map((idx, img) => (
  idx + 1 + ". " + img + "\n"
))}
```