# 🌍 World Explorer

Aplicação web desenvolvida para consultar informações de países utilizando uma API pública.

## 👨‍💻 Autor

Miguel Andrade

## 🔌 API utilizada

**countries.dev**

Documentação: https://countries.dev/docs

Endpoint utilizado:

```text
https://countries.dev/countries?fields=name,nativeName,alpha2Code,alpha3Code,capital,population,region,subregion,languages,currencies,flags,maps
```

A API não exige chave de acesso e permite requisições diretamente do navegador por CORS. A aplicação usa o endpoint `/countries` porque ele retorna todos os países em JSON e permite selecionar os campos necessários.

## ✨ Funcionalidades

- Pesquisa de países pelo nome
- Consulta assíncrona com `fetch` e filtro por nome, nome nativo, código ou capital
- Exibição de:
  - Nome
  - Código ISO
  - Capital
  - População
  - Região
  - Sub-região
  - Idiomas
  - Moeda
  - Bandeira
- Link para localização no mapa quando disponível
- Botões de pesquisa rápida
- Tema claro/escuro
- Estado de carregamento
- Mensagens amigáveis de erro
- Layout responsivo para computador e celular

## 📁 Estrutura

```text
world-explorer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## ▶️ Como executar localmente

1. Baixe ou clone o projeto.
2. Abra a pasta no VS Code.
3. Instale/ative a extensão **Live Server**.
4. Clique com o botão direito em `index.html`.
5. Selecione **Open with Live Server**.
6. Pesquise um país no campo de busca.

> O projeto deve ser executado pelo Live Server para facilitar o desenvolvimento local. É necessário estar conectado à internet para consultar a API.

## 🐙 GitHub

Repositório:

`https://github.com/miguel-andrade-lima/world_explorer`

GitHub Pages:

`https://github.com/miguel-andrade-lima`

## 📝 Sugestão de commits

Para atender ao requisito mínimo de 5 commits, você pode organizar assim:

1. `feat: cria estrutura inicial do projeto`
2. `feat: adiciona layout responsivo`
3. `feat: integra API de países`
4. `feat: adiciona tratamento de erros e loading`
5. `docs: adiciona README e instruções`

## ⚠️ Observação sobre a API anterior

A primeira versão utilizava `restcountries.com/v3.1`. Essa versão foi substituída por `countries.dev` porque o REST Countries atual informa que as versões v1–v4 estão depreciadas e que requisições feitas diretamente do navegador dependem das configurações de CORS da API. O novo endpoint é gratuito, não exige chave e documenta suporte a CORS para chamadas pelo navegador.
