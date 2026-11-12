# David Portela — site

Landing page e página de links (link na bio) de **David Portela**, advogado. Assessoria e consultoria jurídica.

Site estático: HTML, CSS e JavaScript puros, sem build e sem dependências.

## Estrutura

Todos os arquivos ficam na raiz do repositório:

```
index.html              landing page (menu fixo, animações e formulário via WhatsApp)
links.html              página de links para a bio do Instagram
landing.css             estilos, animações e ajustes para celular da landing
links.css               estilos da página de links
landing.js              menu fixo e menu do celular, revelação ao rolar, transição de slide e formulário
dp-monograma.png        monograma DP
favicon.png             ícone da aba
david-terno-azul.webp   foto do topo
david-terno-cinza.webp  foto da seção "Sobre"
```

## Rodar localmente

Abra o `index.html` no navegador ou sirva a pasta:

```bash
npx serve .
```

## Publicar no GitHub Pages

1. Envie os arquivos para a raiz de um repositório no GitHub (branch `main`).
2. No repositório, abra **Settings → Pages** e escolha publicar a partir da branch `main`, pasta `/ (root)`.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`, e a página de links em `.../links.html`.

## Como funcionam as animações

- **Abertura:** ao carregar, um painel com o monograma cobre a tela e sai como um slide (`.wipe.intro`, só CSS); em seguida o conteúdo do topo entra deslizando.
- **Celular:** abaixo de 860 px o menu vira um botão que abre um menu em tela cheia; os links dele usam a mesma transição de slide.
- **Rolagem:** cada bloco com `data-rv` aparece quando entra na tela (`IntersectionObserver` + classes `.rv`, `.rv-l`, `.rv-r`, `.rv-z`, `.rv-pop`, `.rv-line`).
- **Menu:** links com `data-go` disparam a transição de slide (`.wipe`) e reanimam a seção de destino com a classe `.replay`.
- **Parallax e barra de progresso:** usam CSS scroll-driven animations (`animation-timeline`), com `@supports`. Navegadores sem suporte mostram a página sem esses efeitos.
- `prefers-reduced-motion` é respeitado: sem animações, o menu faz só rolagem suave.

## Formulário de contato

O formulário "Converse comigo" envia a mensagem direto para o e-mail do David usando o [FormSubmit](https://formsubmit.co), um serviço gratuito que funciona em sites estáticos como o GitHub Pages, sem servidor próprio.

- **Ativação (uma vez só):** no primeiro envio pelo site publicado, o FormSubmit manda um e-mail de confirmação para `davidportelaadv@gmail.com`. É preciso clicar em **Activate Form** nesse e-mail (confira também a caixa de spam). Antes disso, as mensagens não são entregues.
- O campo de e-mail de quem escreve vira o "Responder para" da mensagem, então basta responder pelo Gmail.
- Há um campo escondido contra spam (`_honey`).
- Os links de e-mail do site abrem a tela de escrever do Gmail.

## Pendências de conteúdo

- [ ] Fotos originais em alta resolução (as atuais vieram de prints do Instagram)
- [ ] Endereço do escritório e modalidade de atendimento (presencial e/ou online), se quiser exibir

A publicidade de advogados segue o Provimento 205/2021 do CFOAB: conteúdo informativo e sóbrio, sem promessa de resultado, preços ou captação de clientela.
