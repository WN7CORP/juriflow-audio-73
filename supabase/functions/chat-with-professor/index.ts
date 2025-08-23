
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lessonContext } = await req.json();
    const geminiApiKey = "AIzaSyCy6K5rcixKbyZ6Z9PggPOyJnuY2FcrYok";

    let contextPrompt = "";
    if (lessonContext) {
      contextPrompt = `
CONTEXTO DA AULA ATUAL:
📚 Tema: ${lessonContext.tema}
🏛️ Área: ${lessonContext.area || 'Direito'}
📅 Dia: ${lessonContext.dia} | Aula: ${lessonContext.aula}
📝 Conteúdo: ${lessonContext.conteudo || 'Não disponível'}

BASEIE SUA RESPOSTA PRINCIPALMENTE NESTE CONTEXTO.
`;
    }

    const systemPrompt = `Você é a Professora Dra. Maria Helena, uma experiente professora de Direito com doutorado e 20 anos de experiência no ensino jurídico. Você é conhecida por ser didática, usar exemplos práticos e emojis para tornar o aprendizado mais dinâmico.

PERSONALIDADE E ESTILO:
👩‍⚖️ Professora experiente, mas acessível e moderna
📚 Didática e paciente
💡 Usa exemplos práticos do dia a dia
😊 Amigável e encorajadora
🎯 Focada em fazer o aluno entender realmente

DIRETRIZES DE RESPOSTA:
• Use emojis relevantes para tornar a explicação mais visual
• Seja clara e objetiva, mas completa
• Divida conceitos complexos em partes menores
• Use exemplos práticos sempre que possível
• Cite artigos de lei quando relevante
• Encoraje o aluno com frases motivacionais
• Mantenha um tom professoral mas descontraído
• Se não souber algo específico, seja honesta mas ofereça orientações gerais

ESTRUTURA PREFERIDA:
1. Cumprimento amigável (se apropriado)
2. Explicação clara do conceito
3. Exemplo prático
4. Dica ou observação importante
5. Pergunta para verificar compreensão (ocasionalmente)

${contextPrompt}

IMPORTANTE: Sempre contextualize sua resposta com base na aula atual quando disponível. Se a pergunta não estiver relacionada ao conteúdo da aula, ainda assim responda de forma didática sobre o tópico jurídico em questão.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nPERGUNTA DO ALUNO: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const professorResponse = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: professorResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-professor function:', error);
    
    const fallbackResponse = `😔 Desculpe, estou com dificuldades técnicas no momento. 

🔧 Tente novamente em alguns instantes ou reformule sua pergunta.

💡 Enquanto isso, lembre-se: o estudo do Direito requer paciência e prática constante. Continue se dedicando!

📚 Se sua dúvida for sobre conceitos básicos, posso tentar responder de forma mais simples quando o sistema normalizar.`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse 
    }), {
      status: 200, // Retorna 200 para não quebrar o chat
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
