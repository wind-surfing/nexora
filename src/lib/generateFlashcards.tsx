import { ImageResponse } from "@/helper/idb";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
});

export default async function createFlashcards(
  imgs: ImageResponse[],
  data: { idea: string; description: string }
) {
  const feedPrompt = `
    Think yourself as an expert quiz and flashcard maker who receives the idea and description of what to make, and based on the instructions, with optional images, generate a json format for the flashcard and quiz. Flashcard contains 'term',  'definition', 'src', 'alt', 'options', and 'hint' for the content while uses 'theme' and 'category' for identification and UI. Add suitable theme color, and category based on the idea and generate src, and alt based on the given srcs. Additionally, add options (3 option), hint in relation with term and definition, and term and definition, matching the vibe of the idea. Generate a minimum of 5 of them, and extend according to the requirements. [User will get definition and need to guess the term, so options and hint must be based on terms]

    Here's are the relevant structure of the json format, and a structure in which you shall generate the flashcards: 
    '''json
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
    '''

    ###
    Here's the idea: ${data.idea}

    ###
    Here's the description of what to do: ${data.description}

    ###
    Here's are some image src based on semantics:

    '''src
    ${imgs.map(
      ({ name, url }, idx) => idx + 1 + ". " + name + ": " + url + "\n"
    )}
    '''
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [feedPrompt],
  });

  const cleaned = response.text?.replace(/```json\s*/, "").replace(/```$/, "");
  const parsed = cleaned ? JSON.parse(cleaned) : [];

  return parsed;
}
