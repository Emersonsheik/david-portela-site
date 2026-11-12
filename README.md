# David Portela — site

Landing page e página de links (link na bio) de **David Portela**, advogado. Assessoria e consultoria jurídica.

Site estático: HTML, CSS e JavaScript puros, sem build e sem dependências.

## Estrutura

```
index.html                landing page (menu fixo, animações e formulário via WhatsApp)
links.html                página de links para a bio do Instagram
assets/css/landing.css    estilos e animações da landing
assets/css/links.css      estilos da página de links
assets/js/landing.js      menu fixo, revelação ao rolar, transição de slide e formulário
assets/img/               monograma DP, favicon e fotos
```

## Rodar localmente

Abra o `index.html` no navegador ou sirva a pasta:

```bash
npx serve .
```

## Publicar no GitHub Pages

1. Envie os arquivos para um repositório no GitHub (branch `main`, na raiz).
2. No repositório, abra **Settings → Pages** e escolha publicar a partir da branch `main`, pasta `/ (root)`.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`, e a página de links em `.../links.html`.

## Como funcionam as animações

- **Abertura:** ao carregar, um painel com o monograma cobre a tela e sai como um slide (`.wipe.intro`, só CSS); em seguida o conteúdo do topo entra deslizando.
- **Rolagem:** cada bloco com `data-rv` aparece quando entra na tela (`IntersectionObserver` + classes `.rv`, `.rv-l`, `.rv-r`, `.rv-z`, `.rv-pop`, `.rv-line`).
- **Menu:** links com `data-go` disparam a transição de slide (`.wipe`) e reanimam a seção de destino com a classe `.replay`.
- **Parallax e barra de progresso:** usam CSS scroll-driven animations (`animation-timeline`), com `@supports`. Navegadores sem suporte mostram a página sem esses efeitos.
- `prefers-reduced-motion` é respeitado: sem animações, o menu faz só rolagem suave.

## Formulário

O formulário não envia nada para servidor. Ele monta a mensagem com os campos preenchidos e abre o WhatsApp (`wa.me`). Nenhum dado fica salvo no site.

## Pendências de conteúdo

Trechos entre colchetes `[ ]` precisam ser preenchidos com informações do David:

- [ ] Número e UF da OAB (topo, seção "Sobre" e rodapé — exigência da OAB na publicidade)
- [ ] Cidade/UF e modalidade de atendimento (presencial e/ou online)
- [ ] Áreas de atuação
- [ ] Apresentação curta e formação (seção "Sobre")
- [ ] Endereço do escritório (rodapé)
- [ ] Fotos originais em alta resolução (as atuais vieram de prints do Instagram)

A publicidade de advogados segue o Provimento 205/2021 do CFOAB: conteúdo informativo e sóbrio, sem promessa de resultado, preços ou captação de clientela.
