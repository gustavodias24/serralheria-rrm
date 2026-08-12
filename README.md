# Site Serralheria RRM

Site institucional responsivo desenvolvido com Python e Flask. O projeto inclui apresentação dos serviços, portfólio, perguntas frequentes, formulário que monta o pedido de orçamento no WhatsApp e contatos de Monica e Anderson.

## Como executar

1. Instale Python 3.10 ou superior.
2. Abra o terminal dentro desta pasta.
3. Crie e ative um ambiente virtual:

   ```bash
   python -m venv .venv
   ```

   No Windows:

   ```powershell
   .venv\Scripts\activate
   ```

   No Linux ou macOS:

   ```bash
   source .venv/bin/activate
   ```

4. Instale as dependências e inicie:

   ```bash
   pip install -r requirements.txt
   python app.py
   ```

5. Acesse `http://127.0.0.1:5000`.

## Estrutura

- `app.py`: aplicação Flask, conteúdo e rotas.
- `templates/index.html`: página principal.
- `static/css/style.css`: identidade visual e responsividade.
- `static/js/main.js`: menu, galeria, formulário e interações.
- `static/img`: logo e imagens tratadas para o site.

## Publicação

O projeto já inclui `wsgi.py`, `Procfile` e Gunicorn para publicação em serviços compatíveis com aplicações Python.
