# PRD — Meu Plantão

**Versão:** 1.0
**Data:** 04/09/2026
**Status:** Em elaboração (pré-desenvolvimento)

## Histórico de Versões

| Versão | Data       | Alterações                                                                 |
|--------|------------|------------------------------------------------------------------------------|
| 1.0    | 04/09/2026 | Consolidação inicial de todas as regras de negócio em formato de PRD        |

---

## 1. Visão Geral

**Meu Plantão** é um sistema web para controle pessoal de escalas de trabalho (plantões 12x36) de enfermeiros, técnicos de enfermagem e profissionais da saúde, incluindo o registro de coberturas avulsas e o cálculo de ganhos previstos e realizados.

- Uso individual: cada profissional usa no próprio aparelho, controlando apenas seus próprios plantões
- Projeto de estudo pessoal, com objetivo de também ser usado na prática
- Público-alvo tem pouco contato com tecnologia → **simplicidade e clareza de uso são prioridade máxima**

## 2. Escopo

**Dentro do escopo (fase atual):**
- Cadastro e acompanhamento de plantões fixos (recorrentes) e coberturas avulsas
- Cálculo automático de escala 12x36 e de ganhos, com tratamento de exceções (falta, doença, troca, internação, férias)
- Relatórios visuais (sem exportação de arquivo)
- Aplicação 100% frontend, com dados salvos localmente no dispositivo

**Fora do escopo (por ora — ver seção 8):**
- Múltiplos usuários / sincronização entre dispositivos
- Backend ou banco de dados remoto
- Valor diferenciado por feriado ou adicional noturno
- Notificações/lembretes

## 3. Stack Tecnológica

- **Build/Dev:** Vite
- **Frontend:** React + Tailwind CSS
- **Persistência:** `localStorage` do navegador
- **Hospedagem:** plataforma gratuita com deploy automático via Git (Vercel ou GitHub Pages)

## 4. Controle de Versão e Repositório

- Projeto versionado em repositório **GitHub**
- Este documento (PRD) deve ser versionado junto ao repositório (ex: `/docs/PRD.md`), atualizando a tabela de Histórico de Versões a cada alteração relevante
- Sugestão: usar tags de release no GitHub alinhadas à versão do PRD quando houver mudança de escopo relevante

## 5. Requisitos Funcionais

### 5.1 Entidades Principais

**Plantão** (vínculo recorrente)
- Campos: nome, tipo (dia 07h–19h / noite 19h–07h), valor, data de início, cor, status (`ativo` / `encerrado`)
- Escala 12x36 (alterna Plantão/Folga a partir da data de início, indefinidamente)
- Profissional pode ter até 3 plantões cadastrados (mais comum: 1 a 2)
- Cor escolhida no cadastro ou gerada aleatoriamente; editável depois

**Plantão Efetivado** (ocorrência concreta de um dia)
- Campos: plantão de origem, data, tipo, valor (snapshot no momento da efetivação), status
- Status possíveis: `realizado`, `falta`, `doença`, `troca`, `internação`
- Não guarda snapshot de cor — a exibição sempre usa a cor **atual** do plantão de origem

**Cobertura** (plantão avulso)
- Campos: nome, tipo (dia/noite), valor, data, cor própria e fixa (padrão para todas as coberturas)
- Só pode ser cadastrada no turno oposto a um plantão já existente no mesmo dia
- Não pode ser cadastrada se os dois turnos do dia já estiverem ocupados por plantões fixos

**Pausa de Plantão** (período de férias)
- Campos: plantão de origem, data início, data fim, motivo (opcional)
- Durante o período de pausa, o plantão não gera P/F nem valor — nenhum registro diário é criado
- Relatórios calculam "dias de férias" cruzando o período consultado com as pausas registradas

### 5.2 Cálculo de Recorrência (Plantão/Folga)

- Cálculo dinâmico: diferença de dias entre a data consultada e a data de início (par = Plantão, ímpar = Folga)
- Preenchimento indefinido da visão de calendário (mês e semana)
- Plantão noturno é sempre referenciado e contabilizado no **dia de início**
- **Máximo de 2 plantões ativos (P) no mesmo dia** (um diurno e um noturno) — o sistema deve impedir ou alertar caso a configuração gere um terceiro plantão ativo simultaneamente no mesmo dia
- Dias dentro de uma Pausa de Plantão não geram P/F para aquele plantão

### 5.3 Efetivação e Status

- Ao abrir o sistema, gerar automaticamente os registros de Plantão Efetivado para todos os dias pendentes desde a última abertura até hoje
- Um dia só é efetivado após o horário de término do plantão já ter passado
- Campo de controle (`ultimaSincronizacao`) para saber de onde continuar
- Usuário pode alterar o status de qualquer dia (passado, atual ou futuro) para: `falta`, `doença`, `troca` ou `internação`
- **Falta/doença:** valor do dia pode contar como R$ 0 ou normalmente — escolha do usuário em cada caso
- **Troca:** valor do dia pode contar ou não como ganho próprio — escolha do usuário em cada caso; campo de texto livre para o nome do colega que cobriu
- **Internação (paciente internado):** plantão continua ativo, o dia é registrado e descrito no relatório, mas o valor é sempre R$ 0 (não é uma escolha do usuário)

### 5.4 Visualização no Calendário

- Dia com 1 plantão ativo → célula preenchida inteira com a cor do plantão
- Dia com 2 plantões ativos → célula dividida horizontalmente em 2, uma cor para cada
- Cobertura no dia → célula dividida em duas partes, cobertura sempre na cor padrão de cobertura
- Clique no dia abre detalhamento com todos os plantões e/ou cobertura daquele dia
- Duas visões: Mês e Semana, alternadas por controle na parte superior da tela
- Navegação entre meses/semanas por gesto de arrastar (swipe) — **requisito crítico**
- Manter também botões de navegação (anterior/próximo) visíveis, como reforço de acessibilidade

### 5.5 Resumo/Previsão na Tela Principal

- Exibir na tela principal um resumo do valor e da quantidade de dias de plantão previstos para o mês/semana em exibição
- Cálculo deve considerar plantões normais, faltas, trocas, internação e coberturas (refletindo as escolhas do usuário sobre o que conta ou não)

### 5.6 Cadastro e Edição

- Criar plantão: clicando no dia do calendário ou por botão dedicado (nome, tipo, valor, data de início, cor)
- Criar cobertura: clicando no dia do calendário (nome, tipo, valor)
- **Excluir plantão:** remove o plantão e todo o histórico de efetivações (irreversível, exige confirmação explícita)
- **Encerrar plantão:** marca o vínculo como inativo, preservando todo o histórico
- Diferenciar visualmente (cor/ícone) as ações de excluir e encerrar

### 5.7 Relatórios

- Relatório semanal e mensal, acessado por botão/menu, visual (sem exportação de arquivo)
- Exibir quantidade de dias, destacando por plantão (quando houver mais de um) e coberturas separadamente
- Exibir também dias de falta, doença, troca, internação e férias, de forma descritiva
- Totais de ganho (R$) por período, respeitando as escolhas do usuário sobre falta/troca
- Filtro por plantão específico ou apenas coberturas

### 5.8 Navegação e Estrutura de Telas

- Parte superior da tela: alternância entre visualização Mês / Semana
- Parte inferior da tela: menu de abas — Plantões (calendário), Relatório, e outras abas futuras (ex: Usuário)
- Nota: detalhamento visual (wireframes/mockups) pode ficar para um documento de design/UX específico numa fase posterior

### 5.9 Persistência e Backup

- Dados salvos em `localStorage`
- **Exportar dados:** botão para baixar um arquivo `.json` com todo o conteúdo salvo
- **Importar dados:** opção para restaurar a partir de um arquivo `.json` exportado anteriormente

## 6. Requisitos Não-Funcionais

- Interface simples e intuitiva, adequada a usuários com pouca familiaridade tecnológica
- Mobile first
- Deploy gratuito com HTTPS (Vercel ou GitHub Pages)

## 7. Registro de Decisões

| Decisão | Justificativa |
|---|---|
| Não guardar snapshot de cor no Plantão Efetivado | Simplicidade suficiente para uso pessoal; o registro referencia o plantão de origem, e reatribuição de cores é um cenário raro nesse contexto |
| Férias tratadas como período (`PausaPlantao`), sem registro diário | Evita duplicar lógica de cálculo; relatório pode cruzar datas sob demanda sem custo de armazenar dezenas de registros repetidos |
| Máximo de 2 plantões ativos por dia | Reflete a realidade física (1 turno diurno + 1 turno noturno); um terceiro plantão ativo no mesmo dia é tratado como conflito |
| Valor do plantão único (sem adicional noturno/feriado) | Não há esse tratamento na região do usuário; mantém o modelo mais simples |

## 8. Backlog / Fora do Escopo Atual

- Sincronização entre múltiplos dispositivos
- Notificações/lembretes de plantão (Notification API)
- Reavaliação de histórico de vigência de valor (hoje resolvido via snapshot no plantão efetivado)
