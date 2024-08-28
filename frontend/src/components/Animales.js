import React, { useState } from "react";


export const Animales = () =>{
    const [animales, setAnimales] = React.useState([])
    const [nombre, setNombre] = React.useState("")
    const [numeroEstomagos, setNEstomagos] = React.useState("")
    const [numeroCerebros, setNCerebros] = React.useState("")
    const [idEditar, setId] = useState("")
    const [editando, setEditando] = useState(false)

    const traerAnimales = async () =>{
        const respuesta = await fetch('http://localhost:5000/animales')
        const datos = await respuesta.json()
        setAnimales(datos)
        console.log(datos)
    }
     React.useEffect(
     () =>{
        traerAnimales()
     },[]
    )

    const enviarDatos = async (e) =>{
        e.preventDefault();
        if(editando){
            await fetch('http://localhost:5000/animales/'+idEditar, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                numeroEstomagos,
               numeroCerebros
                })
              })
        }else{
            await fetch('http://localhost:5000/animales', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                numeroEstomagos,
               numeroCerebros
                })
              })
              .catch(error => console.error('Error:', error));
        }
        await traerAnimales()
        setEditando(false)
          setNombre("")
          setNEstomagos("")
          setNCerebros("")
    }

    const eliminarAnimal = async(id)=>{
        const respuestaConfirm = window.confirm("¿Desea borrar el animal?")
        if(respuestaConfirm){
            await fetch('http://localhost:5000/animal/'+id,{
            method: 'DELETE',
        })
        await traerAnimales()
        }
         
    }
    const editarAnimal = async(id)=>{
        const respuesta = await fetch('http://localhost:5000/animal/'+id)
        const datos = await respuesta.json()
        setNombre(datos.nombre)
        setNEstomagos(datos.numeroEstomagos)
        setNCerebros(datos.numeroCerebros)
        setId(id)
        setEditando(true)
    }
    const reestablecerCrear = () =>{
        setNombre("")
        setNEstomagos("")
        setNCerebros("")
        setEditando(false)
    }
    return(
        <>
  <h1 className="title">Animales</h1>
  <form onSubmit={enviarDatos} className="animal-form">
    <input 
      placeholder="NOMBRE" 
      type="text" 
      onChange={(e) => setNombre(e.target.value)} 
      value={nombre} 
      className="input-field"
    />
    <br/>
    <input 
      placeholder="NUMERO DE ESTOMAGOS" 
      type="number" 
      onChange={(e) => setNEstomagos(e.target.value)} 
      value={numeroEstomagos}
      className="input-field"
    />
    <br/>
    <input 
      placeholder="NUMERO DE CEREBROS" 
      type="number" 
      onChange={(e) => setNCerebros(e.target.value)} 
      value={numeroCerebros}
      className="input-field"
    />
    <br/>
    <button type="submit" className="submit-button">
      {editando ? "Editar" : "Crear"}
    </button>
    <br/>
    {editando && (
      <>
        <p className="edit-warning">Estas editando ahora mismo</p>
        <button type="button" onClick={() => reestablecerCrear()} className="cancel-button">Dejar de editar</button>
      </>
    )}
  </form>
  <br/><br/>

  <table className="animal-table">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Numero de Estomagos</th>
        <th>Numero de Cerebros</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {animales.map(animal =>(
        <tr key={animal.id}>
          <td>{animal.nombre}</td>
          <td>{animal.numeroEstomagos}</td>
          <td>{animal.numeroCerebros}</td>
          <td>
            <button onClick={(e) => editarAnimal(animal.id)} className="edit-button">Editar</button>
            <button onClick={(e) => eliminarAnimal(animal.id)} className="delete-button">Eliminar</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</>
    )
}