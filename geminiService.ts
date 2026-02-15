
import { GoogleGenAI, Type } from "@google/genai";
import { ResultadoConjugacao, TempoVerbal } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function consultarConjugacao(verbo: string, tempo: TempoVerbal): Promise<ResultadoConjugacao> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Conjuegue o verbo "${verbo}" no tempo verbal "${tempo}" em português. 
    
    REGRAS IMPORTANTES DE FORMATAÇÃO E CONTEÚDO:
    1. NÃO utilize o pronome "tu". 
    2. No lugar de "tu", utilize o pronome "Você".
    3. O pronome "Você" deve ser conjugado seguindo a 3ª pessoa do singular.
    4. Também substitua "vós" por "Vocês" (conjugado na 3ª pessoa do plural).
    5. ADICIONE o pronome "A gente". Ele deve ser conjugado obrigatoriamente seguindo a 3ª pessoa do singular (igual a "Você" ou "Ele/Ela").
    6. A lista de conjugações deve seguir EXATAMENTE esta ordem de pessoas: 
       - "Eu"
       - "Você"
       - "Ele/Ela"
       - "A gente"
       - "Nós"
       - "Vocês"
       - "Eles/Elas"
    
    Forneça também o significado e uma curiosidade sobre o uso desse verbo no cotidiano.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verbo: { type: Type.STRING },
          tempo: { type: Type.STRING },
          infinitivo: { type: Type.STRING },
          gerundio: { type: Type.STRING },
          participioPassado: { type: Type.STRING },
          conjugacoes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pessoa: { type: Type.STRING },
                forma: { type: Type.STRING }
              },
              required: ["pessoa", "forma"]
            }
          },
          significado: { type: Type.STRING },
          curiosidade: { type: Type.STRING }
        },
        required: ["verbo", "tempo", "infinitivo", "gerundio", "participioPassado", "conjugacoes", "significado"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Resposta vazia do modelo.");
    return JSON.parse(text) as ResultadoConjugacao;
  } catch (error) {
    console.error("Erro ao processar resposta do Gemini:", error);
    throw new Error("Não foi possível processar a conjugação. Verifique se o verbo existe ou tente novamente.");
  }
}
