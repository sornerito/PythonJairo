from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
app = Flask(__name__)
app.config["MONGO_URI"]="mongodb://localhost/pythonreactdb"
mongo = PyMongo(app)

CORS(app)

db = mongo.db.animales

@app.route("/animales",methods=["POST"])
def crearAnimal():
    id = db.insert_one({
        "nombre":request.json["nombre"],
        "numeroEstomagos":request.json["numeroEstomagos"],
        "numeroCerebros":request.json["numeroCerebros"]
    }).inserted_id
    print(id)
    return jsonify({"id": str(id)}), 201

@app.route("/animales",methods=["GET"])
def listarAnimales():
    animales = []
    for doc in db.find():
        animales.append({
            "id": str(doc["_id"]),
            "nombre": doc["nombre"],
            "numeroEstomagos": doc["numeroEstomagos"],
            "numeroCerebros": doc["numeroCerebros"]
        })
    
    return jsonify(animales)

@app.route("/animal/<id>",methods=["GET"])
def listarAnimal(id):
    animal = db.find_one({"_id": ObjectId(id)})
    return jsonify({
        "id": str(animal["_id"]),
        "nombre": animal["nombre"],
        "numeroEstomagos": animal["numeroEstomagos"],
        "numeroCerebros": animal["numeroCerebros"]
    })

@app.route("/animal/<id>",methods=["DELETE"])
def borrarAnimal(id):
    db.delete_one({"_id": ObjectId(id)})
    return "Animal Eliminado"

@app.route("/animales/<id>",methods=["PUT"])
def editarAnimal(id):
    db.update_one({"_id":ObjectId(id)} ,{"$set":{
        "nombre":request.json["nombre"],
        "numeroEstomagos":request.json["numeroEstomagos"],
        "numeroCerebros":request.json["numeroCerebros"]
    }})
    return "Animal Actualizado"

def index():
    return "Hola mundo"
if __name__ == "__main__":
    app.run(debug=True)