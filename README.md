# 🎙️ Radar de Vagas de Áudio

Aplicação web responsiva (*mobile-first*) em português do Brasil criada para ajudar **locutores(as), radialistas, apresentadores, operadores de áudio, sonoplastas e produtores de podcast/audiovisual** a encontrar oportunidades em emissoras de rádio, produtoras, universidades e portais de vagas.

---

## ✨ Funcionalidades Principais

### 1. 🎛️ Painel de Palavras-Chave (`Radar de Buscas`)
- **4 grupos editáveis**:
  - **Cargos e Funções**: `locutor`, `locutora`, `radialista`, `apresentador de rádio`, `host de podcast`, `produtor de áudio`, `narrador`, `voz institucional`, `locutor operador`, `comunicador`, `assistente de estúdio`, `técnico audiovisual`, `sonoplasta`, `sonoplastia` e `operador de áudio`.
  - **Contexto e Formato**: `rádio`, `FM`, `web rádio`, `podcast`, `áudio`.
  - **Exclusões (Filtro Negativo)**: termos para evitar vagas fora do perfil (ex.: `telemarketing`, `vendas`, `voluntário`, `"carro de som"`).
  - **Localização**: `São Paulo`, `remoto`, `Brasil`.
- **Ações rápidas**: ativar/desativar termos com 1 clique, **Marcar todos**, **Limpar tudo**, **Modo Editar** (com confirmação antes de remover e **Desfazer** por 10 segundos) e **Restaurar padrões** por grupo ou geral.

### 2. 🔍 Gerador de Buscas Prontas
- **Filtro de período (`Publicadas há`)**: `24h`, `7 dias` ou `30 dias`, aplicado automaticamente aos parâmetros de URL de cada plataforma (`f_TPR` no LinkedIn, `fromage` no Indeed e `tbs=qdr` no Google).
- **Buscas individuais por cargo ativo**: gera um botão direto por cargo para **LinkedIn**, **Indeed** e **Google Vagas**, evitando consultas longas que retornam zero resultados.
- **Busca Ampla no Google**: combina até 5 cargos ativos com `OR` + termos de intenção de contratação (`vaga OR contratando OR "procura-se" OR seleção`) + localidade principal, com botão para copiar a expressão.
- **Buscas em Redes Sociais & Portais**: atalhos direcionados para `site:gupy.io`, `site:instagram.com`, `site:linkedin.com/posts` e `site:facebook.com`.
- **Perfis Prontos**: troca rápida entre combinações pré-salvas (*Assistente de Estúdio*, *Locutor Operador*, *Técnico Audiovisual*) ou criação de novos perfis.

### 3. 📻 Fontes, Emissoras & Universidades
- **Categorias organizadas**:
  - **Rádios de São Paulo**: Jovem Pan, CBN São Paulo, Band FM, Mix FM, Transamérica, Rádio USP, Rádio Disney, Alpha FM, Nova Brasil FM, Kiss FM, 89 FM A Rádio Rock, Rádio Eldorado e Cultura FM.
  - **Podcasts & Produtoras**: Rádio Novelo, B9 Studios, Não Inviabilize, Ciência Suja, O Assunto, Central 3, Tocalivros, Half Deaf e Podpah Studios.
  - **Cidades de SP**: seletor com 19 cidades e polos regionais do estado de São Paulo.
  - **Outros Estados**: emissoras selecionadas de RJ, MG (incluindo Rádio Itatiaia), ES, PR, SC e RS.
  - **Universidades**: USP, FAAP, Faculdade Cásper Líbero, Mackenzie, ESPM, PUC-SP, FIAP, Cruzeiro do Sul e Anhembi Morumbi com acesso direto ao perfil institucional no LinkedIn.
- **Queries ativas no painel**: alterne facilmente o cargo ativo na própria aba de Fontes para pesquisar vagas daquela função dentro de cada emissora.
- **Links personalizáveis**: adicione novas fontes ou edite campos (*Grupo/Empresa*, *Link de Vagas*, *Recrutamento*, *Contato*, *LinkedIn*, *Instagram* e *Notas*), com destaque visual `Links ✓` e busca automática de fallback no Google/LinkedIn.

### 4. 📚 Histórico de Buscas & Biblioteca de Vagas
- **Perfis de Busca**: salve combinações exatas de cargos, contextos, exclusões, local e período para reutilizar com 1 clique.
- **Biblioteca de Vagas Salvas**: cadastre oportunidades com empresa, link, contato do recrutador, anotações e status:
  - `💖 Salva`
  - `⭐ Candidatura Enviada`
  - `🌈 Entrevista / Teste`
  - `📦 Arquivada`
- **Turminha do Áudio reativa**: mascotes autorais em SVG (*Miczinho*, *Radinho Vintage*, *Fita Cassete Carteira* e *Mesa DJ Arco-Íris*) que mudam de expressão conforme o filtro e a presença de vagas.
- **Exportar Lista**: copia um resumo formatado de todas as vagas para compartilhar no WhatsApp ou por e-mail.

### 5. 🎨 Visual & Experiência
- Estética **Kawaii Pastel** com tipografia `Fredoka` e `Nunito`, selo animado `ON AIR`, corações flutuantes e alternância entre **Modo Claro** e **Modo Escuro**.
- Botão **Compartilhar** no cabeçalho para copiar rapidamente a URL pública da aplicação.

---

## 🔒 Privacidade e Armazenamento Local

Não é necessário criar conta nem fazer login. Todas as personalizações — palavras-chave, perfis salvos, vagas cadastradas, fontes editadas e preferência de tema — ficam armazenadas **exclusivamente no `localStorage` do navegador do usuário**.

Isso significa que você pode compartilhar o link livremente com outras pessoas: cada usuário terá seu próprio ambiente independente no aparelho em que estiver acessando, sem interferir nos dados de ninguém.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Servidor**: [Express](https://expressjs.com/) integrado ao middleware do Vite em desenvolvimento (`server.ts` com `tsx`)

---

## 📁 Estrutura do Projeto

```text
├── index.html                        # HTML principal, metadados e fontes (Fredoka & Nunito)
├── metadata.json                     # Metadados do aplicativo
├── package.json                      # Dependências e scripts
├── server.ts                         # Servidor Express + Vite middleware / arquivos estáticos
├── vite.config.ts                    # Configuração do Vite e Tailwind CSS v4
└── src/
    ├── App.tsx                       # Estado global, persistência localStorage e navegação por abas
    ├── main.tsx                      # Ponto de entrada React
    ├── index.css                     # Estilos globais, variáveis de tema e utilitários kawaii
    ├── types.ts                      # Interfaces TypeScript
    ├── constants/
    │   └── initialData.ts            # Palavras-chave padrão, emissoras, cidades, estados e presets
    └── components/
        ├── AudioCrewMascots.tsx      # Mascotes da biblioteca (Radinho, Fita Cassete, Mesa DJ, MiczinhoSad)
        ├── FloatingHearts.tsx        # Animação de corações flutuantes
        ├── Header.tsx                # Cabeçalho, botão Compartilhar, tema e abas principais
        ├── HiddenSourcesSection.tsx  # Painel de emissoras, produtoras, cidades e universidades
        ├── KeywordsPanel.tsx         # Editor de palavras-chave com Modo Editar e Desfazer
        ├── LibrarySection.tsx        # Perfis salvos e gerenciador de vagas
        ├── MiczinhoMascot.tsx        # Mascote principal no cabeçalho
        └── SearchGenerator.tsx       # Gerador de links de busca por cargo, Google e redes sociais
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Gerenciador de pacotes `npm` (ou compatível)

### Passos

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento** (porta `3000`):
   ```bash
   npm run dev
   ```

3. **Acesse no navegador**:
   ```text
   http://localhost:3000
   ```

### Outros Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Sobe o servidor Express com Vite em modo de desenvolvimento (`tsx server.ts`) |
| `npm run build` | Gera o bundle de produção em `dist/` via `vite build` |
| `npm start` | Executa o servidor (`tsx server.ts`) |
| `npm run lint` | Verifica tipagem TypeScript sem emitir arquivos (`tsc --noEmit`) |
| `npm run clean` | Remove os artefatos de build (`dist` e `server.js`) |
