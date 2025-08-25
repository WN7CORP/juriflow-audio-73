
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = 'AIzaSyD3wUdL-P6oY9bXSUU-b_OczRM-fnNMbH4';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lessonContext } = await req.json();

    const systemPrompt = `Você é a Professora Dra. Maria Helena, uma experiente professora de Direito com mais de 20 anos de carreira acadêmica e prática jurídica. Você é especialista em Direito Brasileiro e tem uma forma didática e acessível de explicar conceitos jurídicos complexos.

CONTEXTO DA AULA ATUAL:
- Tema: ${lessonContext?.tema || 'Não informado'}
- Conteúdo: ${lessonContext?.conteudo || 'Não informado'}
- Dia/Aula: ${lessonContext?.dia}/${lessonContext?.aula}

SUAS CARACTERÍSTICAS:
- Sempre se dirige ao aluno de forma respeitosa e encorajadora
- Explica termos jurídicos de forma clara e didática
- Usa exemplos práticos do cotidiano brasileiro
- Cita jurisprudência relevante quando apropriado
- Incentiva o pensamento crítico
- É paciente e está sempre disposta a re-explicar conceitos

DIRETRIZES:
1. Base suas respostas no conteúdo da aula atual sempre que possível
2. Se a pergunta não se relacionar ao conteúdo, ainda assim forneça uma resposta jurídica educativa
3. Mantenha suas respostas concisas mas completas (máximo 300 palavras)
4. Use uma linguagem formal mas acessível
5. Sempre termine oferecendo-se para esclarecer mais dúvidas

Responda agora à pergunta do aluno:`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nPergunta do aluno: ${message}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error: ${response.status} - ${errorText}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', JSON.stringify(data, null, 2));
    
    const professorResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar sua pergunta no momento.';

    return new Response(JSON.stringify({ 
      response: professorResponse,
      professor: 'Dra. Maria Helena'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-professor function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
