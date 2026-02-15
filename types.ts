
export enum TempoVerbal {
  PresenteIndicativo = "Presente do indicativo",
  PreteritoImperfeitoIndicativo = "Pretérito imperfeito do indicativo",
  PreteritoPerfeitoIndicativo = "Pretérito perfeito do indicativo",
  PreteritoMaisQuePerfeitoIndicativo = "Pretérito mais-que-perfeito do indicativo",
  FuturoPresenteIndicativo = "Futuro do presente do indicativo",
  FuturoPreteritoIndicativo = "Futuro do pretérito do indicativo",
  PresenteSubjuntivo = "Presente do subjuntivo",
  PreteritoImperfeitoSubjuntivo = "Pretérito imperfeito do subjuntivo",
  FuturoSubjuntivo = "Futuro do subjuntivo",
  ImperativoAfirmativo = "Imperativo afirmativo",
  ImperativoNegativo = "Imperativo negativo",
  InfinitivoPessoal = "Infinitivo pessoal"
}

export interface Conjugacao {
  pessoa: string;
  forma: string;
}

export interface ResultadoConjugacao {
  verbo: string;
  tempo: string;
  infinitivo: string;
  gerundio: string;
  participioPassado: string;
  conjugacoes: Conjugacao[];
  significado: string;
  curiosidade?: string;
}
