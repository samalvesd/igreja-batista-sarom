# Igreja Batista Sarom

Landing page institucional da **Igreja Batista Sarom**, com apresentação da igreja, horários de cultos, formulário de membros, galeria de fotos e canal de contato via WhatsApp.

Site em página única (single-page), 100% estático, escrito em HTML, CSS e JavaScript puro, sem necessidade de build ou back-end. Marcação, estilos e scripts ficam separados em arquivos próprios para facilitar manutenção.

## ✨ Funcionalidades

- **Hero animado** com efeito 3D (Three.js) e canvas de fundo.
- **Seção "Sobre"** com a proposta e missão da igreja.
- **Cultos**: horários e informações dos encontros.
- **Comunidade**: formulário "Quer fazer parte?" — envia nome e WhatsApp por e-mail para a igreja via [FormSubmit](https://formsubmit.co/), sem necessidade de back-end próprio.
- **Galeria de fotos** em formato carrossel, navegável por botões e teclado.
- **Contato**: botão direto para WhatsApp e vídeo de mensagem do pastor.
- Animações de entrada e rolagem com **GSAP** + **ScrollTrigger**.
- Design responsivo, com suporte a `prefers-reduced-motion` e foco visível para acessibilidade (navegação por teclado, `aria-label`s, skip link).

## 🛠️ Tecnologias

- HTML5 + CSS3 (variáveis CSS, layout responsivo)
- JavaScript (vanilla)
- [GSAP](https://gsap.com/) + ScrollTrigger (animações)
- [Three.js](https://threejs.org/) (efeito 3D no hero)
- Google Fonts (`Fraunces` e `Inter`)

Todas as bibliotecas externas são carregadas via CDN — não há dependências de build (`npm`, bundlers, etc.).

## 🚀 Como executar localmente

Por ser um site estático, basta abrir `index.html` diretamente no navegador ou servir a pasta com qualquer servidor HTTP simples:

```bash
# Python
python -m http.server 8000

# Node.js (npx)
npx serve .
```

Depois acesse `http://localhost:8000`.

## 📁 Estrutura

```
igreja-batista-sarom/
├── index.html          # marcação (HTML) das seções da página
├── assets/
│   ├── css/
│   │   └── styles.css  # estilos (variáveis, layout, componentes, responsividade)
│   ├── js/
│   │   └── main.js     # comportamento (animações, formulário, galeria, hero 3D)
│   └── hero-culto.jpeg # foto de fundo da seção hero
└── README.md
```

## 📌 Observações

- O formulário "Quer fazer parte?" envia os dados para `igrejabatistasarom@gmail.com` via FormSubmit. **Na primeira submissão real**, o FormSubmit envia um e-mail de confirmação para esse endereço — é preciso clicar no link de confirmação uma única vez para o serviço passar a entregar as mensagens seguintes.
- O botão do WhatsApp e o vídeo do pastor estão com placeholders e devem ser configurados com o link/arquivo definitivos antes da publicação em produção.

## 📄 Licença

Projeto pessoal — uso livre para fins da Igreja Batista Sarom.
