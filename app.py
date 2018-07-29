from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/howto')
def howto():
    return render_template("howto.html")
    
if __name__ == "__main__":
	app.run()
