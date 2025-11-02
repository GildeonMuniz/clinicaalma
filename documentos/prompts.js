const PROMPT_FICHA_FRENTE = `Você está lendo a FRENTE de uma ficha de atendimento de uma clínica espiritual. A imagem contém texto impresso e manuscrito. Seu trabalho é extrair todas as informações visíveis.

IMPORTANTE: Leia com atenção todos os campos, inclusive os manuscritos à mão (ex: datas de sessões, observações, responsáveis). Retorne um JSON com a estrutura abaixo. Preencha com os dados disponíveis. Se algum campo não puder ser lido, use null.

{
  "codigo_consulente": string | null,
  "nome": string | null,
  "idade": number | null,
  "endereco": string | null,
  "bairro": string | null,
  "cidade": string | null,
  "estado": string | null,
  "cep": string | null,
  "telefone_fixo": string | null,
  "celular": string | null,
  "email": string | null,
  "data_cadastro": "DD/MM/AAAA" | null,
  "passes_humano_espirituais": string[] | null,
  "passes_magneticos": string[] | null,
  "sessoes": [
    {
      "tipo": string,
      "datas": string[]
    }
  ],
  "bioenergia": boolean,
  "apometria_energetica": boolean,
  "apometria_convencional": boolean,
  "evocacao": string[] | null,
  "campo_protecao": string[] | null,
  "exclusivo_tratamento_medico": string[] | null,
  "indicacoes_especificas": string | null,
  "responsavel_preenchimento": string | null,
  "responsavel_orientacao": string | null
}

Leia com atenção tudo que estiver escrito à mão, mesmo que esteja fora da estrutura. Retorne apenas o JSON sem explicações adicionais.`;

const PROMPT_FICHA_COSTA = `Você está analisando a parte de TRÁS (COSTA) da ficha de uma clínica espiritual. Ela contém prescrições, recomendações e observações. Leia todos os checkboxes e textos manuscritos com atenção.

Retorne um JSON com a seguinte estrutura:

{
  "agua_magnetizada": boolean,
  "agua_magnetizada_detalhes": string | null,
  "agua_viva": boolean,
  "gotas": boolean,
  "gotas_prescricao": string | null,
  "gel": boolean,
  "banho": boolean,
  "escalda_pes": boolean,
  "floral_rescue": boolean,
  "atendimento_terapeutico_pnl": boolean,
  "conversa_fraterna": boolean,
  "terapia_florais": boolean,
  "culto_evangelho_lar": boolean,
  "colegiado_guardioes": boolean,
  "reuniao_pais_velhos_caboclos": boolean,
  "reuniao_pais_velhos_caboclos_data": string | null,
  "leitura_recomendada": string | null,
  "orientacoes_complementares": string | null,
  "observacoes": string | null,
  "outros_itens_marcados": string[] | null
}

Observações:
- Extraia todos os textos escritos à mão com o máximo de fidelidade.
- Se existirem campos riscados, ainda tente reconhecer o que está escrito.
- "outros_itens_marcados" deve listar qualquer outro checkbox marcado que não esteja previsto na estrutura acima.

Retorne apenas o JSON, sem comentários ou explicações adicionais.`;

module.exports = { PROMPT_FICHA_FRENTE, PROMPT_FICHA_COSTA };