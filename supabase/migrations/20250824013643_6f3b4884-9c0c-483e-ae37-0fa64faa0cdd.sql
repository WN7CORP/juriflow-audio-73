
CREATE OR REPLACE FUNCTION get_lesson_questions(lesson_aula text)
RETURNS TABLE (
  id bigint,
  pergunta text,
  resposta text,
  alternativa_a text,
  alternativa_b text,
  alternativa_c text,
  alternativa_d text,
  aula text
) AS $$
BEGIN
  RETURN QUERY
  SELECT q.id, q.pergunta, q.resposta, q."Alternativa a", q."Alternativa b", q."Alternativa c", q."Alternativa d", q."Aula"
  FROM "QUESTÕES-CURSO" q
  WHERE q."Aula" = lesson_aula;
END;
$$ LANGUAGE plpgsql;
