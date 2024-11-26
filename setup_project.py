import os

# Estrutura de diretórios
dirs = [
    "static/js",
    "static/css",
    "static/images",
    "templates"
]

# Criar as pastas
for directory in dirs:
    os.makedirs(directory, exist_ok=True)

# Criar os arquivos básicos
with open("app.py", "w") as app_file:
    app_file.write("""from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
""")

with open("templates/index.html", "w") as index_file:
    index_file.write("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flask + p5.js</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.js"></script>
</head>
<body>
    <h1>Flask com p5.js</h1>
    <script src="{{ url_for('static', filename='js/sketch.js') }}"></script>
</body>
</html>
""")

with open("static/js/sketch.js", "w") as sketch_file:
    sketch_file.write("""function setup() {
    createCanvas(800, 800);
    background(200);
}

function draw() {
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 50, 50);
}
""")

with open("requirements.txt", "w") as req_file:
    req_file.write("flask\n")

print("Estrutura do projeto Flask + p5.js criada com sucesso!")
