
export interface Lesson {
  id?: number;
  Dia: string;
  Aula: string;
  Tema: string;
  conteudo?: string;
  video?: string;
  Nome: string;
  Link: string;
  Descricao: string;
  Area?: string; // Add the Area property
}
