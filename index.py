import os
from datetime import datetime, timezone

from flask import Flask, Response, render_template, request, url_for


app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False


SERVICES = [
    {
        "number": "01",
        "title": "Coberturas metálicas",
        "description": "Estruturas sob medida para áreas residenciais, comerciais e espaços de trabalho.",
        "image": "02-estrutura-galpao.webp",
        "alt": "Estrutura metálica ampla preparada para receber cobertura",
    },
    {
        "number": "02",
        "title": "Portões metálicos",
        "description": "Soluções robustas para proteger o acesso sem abrir mão de um bom acabamento.",
        "image": "03-portao-metalico.webp",
        "alt": "Portão metálico grafite instalado em área externa",
    },
    {
        "number": "03",
        "title": "Portas sob medida",
        "description": "Fabricação e instalação de portas metálicas adequadas a cada vão e necessidade.",
        "image": "04-porta-sob-medida.webp",
        "alt": "Porta metálica sob medida com acabamento profissional",
    },
    {
        "number": "04",
        "title": "Grades e proteção",
        "description": "Grades, fechamentos e estruturas de proteção com desenho funcional e resistente.",
        "image": "05-grade-seguranca.webp",
        "alt": "Grade metálica de proteção fabricada sob medida",
    },
    {
        "number": "05",
        "title": "Soldas em geral",
        "description": "Uniões firmes, reparos e reforços executados com atenção à segurança e ao detalhe.",
        "image": "08-solda-precisao.webp",
        "alt": "Profissional executando solda de precisão em estrutura de aço",
    },
    {
        "number": "06",
        "title": "Escadas e estruturas",
        "description": "Escadas, suportes e peças metálicas personalizadas para aproveitar melhor cada espaço.",
        "image": "07-escada-metalica.webp",
        "alt": "Escada metálica fabricada para um espaço residencial",
    },
]


PROJECTS = [
    {
        "image": "06-guarda-corpo.webp",
        "title": "Guarda-corpo metálico",
        "category": "Proteção",
        "alt": "Guarda-corpo metálico instalado em passagem externa",
        "size": "wide",
    },
    {
        "image": "09-trelica-metalica.webp",
        "title": "Treliça sob medida",
        "category": "Estrutura",
        "alt": "Treliça metálica longa fabricada sob medida",
        "size": "standard",
    },
    {
        "image": "10-pintura-acabamento.webp",
        "title": "Acabamento em portão",
        "category": "Finalização",
        "alt": "Aplicação de acabamento em portão metálico",
        "size": "tall",
    },
    {
        "image": "11-cobertura-comercial.webp",
        "title": "Cobertura comercial",
        "category": "Cobertura",
        "alt": "Cobertura metálica em frente a estabelecimento comercial",
        "size": "standard",
    },
    {
        "image": "12-telhado-interno.webp",
        "title": "Cobertura de grande vão",
        "category": "Cobertura",
        "alt": "Vista interna de cobertura metálica de grande vão",
        "size": "wide",
    },
    {
        "image": "13-cobertura-curva.webp",
        "title": "Estrutura curva",
        "category": "Projeto especial",
        "alt": "Estrutura metálica curva preparada para cobertura",
        "size": "standard",
    },
    {
        "image": "15-cobertura-residencial.webp",
        "title": "Cobertura residencial",
        "category": "Residencial",
        "alt": "Cobertura metálica finalizada em área residencial",
        "size": "standard",
    },
]


@app.context_processor
def inject_globals():
    return {
        "current_year": datetime.now(timezone.utc).year,
        "whatsapp_monica": "5521964573117",
        "whatsapp_anderson": "5521987561059",
    }


@app.get("/")
def home():
    return render_template("index.html", services=SERVICES, projects=PROJECTS)


@app.get("/robots.txt")
def robots():
    sitemap_url = request.url_root.rstrip("/") + url_for("sitemap")
    body = f"User-agent: *\nAllow: /\nSitemap: {sitemap_url}\n"
    return Response(body, mimetype="text/plain")


@app.get("/sitemap.xml")
def sitemap():
    home_url = request.url_root.rstrip("/") + url_for("home")
    xml = (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
        f"<url><loc>{home_url}</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>"
        "</urlset>"
    )
    return Response(xml, mimetype="application/xml")


@app.get("/saude")
def health():
    return {"status": "ok"}


@app.after_request
def add_security_headers(response):
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault(
        "Permissions-Policy", "camera=(), microphone=(), geolocation=()"
    )
    if request.path.startswith("/static/"):
        response.headers.setdefault("Cache-Control", "public, max-age=2592000")
    return response


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
