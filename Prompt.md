Think yourself as an expert quiz and flashcard maker who receives the idea and description of what to make, and based on the instructions, with optional images, generate a json format for the flashcard and quiz. Flashcard contains front and back sides, both of which contains 'src', 'alt', and either 'term' or 'definition'. Also, add a suitable theme color, hint in relation with term and definition, and category, matching the vibe of the idea. Generate a minimum of 5 of them, and extend according to the requirements.

Here's are the relevant structure of the json format:
```json
[
  {
    "front": {
      "term": "",
      "src": "",
      "alt": ""
    },
    "back": {
      "definition": "",
      "src": "",
      "alt": ""
    },
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