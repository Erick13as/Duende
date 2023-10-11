import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { collection, query, getDocs, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

function InfoImagenAdmin() {
  const location = useLocation();
  const imagenUrl = location.state && location.state.imagenUrl;
  const imagenQuery = query(collection(db, 'imagen'), where('imagenUrl', '==', imagenUrl));
  const [descripcion, setDescripcion] = useState("");
  const [listaEtiquetas, setListaEtiquetas] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState("");

  // Estado para almacenar las categorías y subcategorías de la imagenQuery
  const [categoriaEncontrada, setCategoriaEncontrada] = useState("");
  const [subcategoriaEncontrada, setSubcategoriaEncontrada] = useState("");

  const [subcategoriaAnterior, setsubcategoriaAnterior] = useState("");

  useEffect(() => {
    // Realiza la consulta para obtener la descripción y etiquetas solo cuando se monta el componente
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setDescripcion(data.descripcion || "");
          // Convierte el array de etiquetas en una cadena separada por espacios
          setListaEtiquetas(data.etiquetas ? data.etiquetas.join(' ') : "");

          // Obtener categoría y subcategoría relacionadas
          setCategoriaEncontrada(data.categoria);
          setSubcategoriaEncontrada(data.subcategoria);
          setCategoriaSeleccionada(data.categoria);
          setSubcategoriaSeleccionada(data.subcategoria);
        } 
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Consulta todas las categorías desde Firestore
  useEffect(() => {
    const fetchCategorias = async () => {
      const categoriasRef = collection(db, 'categoria');
      const categoriasSnapshot = await getDocs(categoriasRef);
      const categoriasData = categoriasSnapshot.docs.map((doc) => doc.data().nombre);
      setCategorias(categoriasData);
    };
    fetchCategorias();
  }, []);

  // Consulta todas las subcategorías desde Firestore
  useEffect(() => {
    const fetchSubcategorias = async () => {
      // Verifica si se ha seleccionado una categoría
      if (categoriaSeleccionada) {
        const subcategoriasRef = collection(db, 'subcategoria');
        const subcategoriasQuery = query(subcategoriasRef, where('categoria', '==', categoriaSeleccionada));
        const subcategoriasSnapshot = await getDocs(subcategoriasQuery);
        const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
        if ((categoriaEncontrada!==categoriaSeleccionada && subcategoriaEncontrada!=="...")){
          setsubcategoriaAnterior(subcategoriaEncontrada)
          setSubcategoriaEncontrada("...")
        }
        if(categoriaEncontrada===categoriaSeleccionada && subcategoriaEncontrada==="..."){
          setsubcategoriaAnterior(subcategoriaSeleccionada)
        }
        console.log(subcategoriaEncontrada, "--", subcategoriaAnterior);
        setSubcategorias(subcategoriasData);
      } else {
        // Si no se ha seleccionado una categoría, muestra todas las subcategorías
        const subcategoriasRef = collection(db, 'subcategoria');
        const subcategoriasSnapshot = await getDocs(subcategoriasRef);
        const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
        setSubcategorias(subcategoriasData);
      }
    };
    fetchSubcategorias();
  }, [categoriaSeleccionada, categoriaEncontrada, subcategoriaEncontrada, subcategoriaAnterior, subcategoriaSeleccionada]);

  const handleActualizarClick = async () => {
    if ((categoriaEncontrada!==categoriaSeleccionada && subcategoriaAnterior===subcategoriaSeleccionada) || subcategoriaSeleccionada==="..." || subcategoriaSeleccionada===".."){
      alert("Datos invalidos");
    } else{
      try {
        // Actualiza los datos en Firestore
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          // Divide la cadena de etiquetas en un arreglo
          const etiquetas = listaEtiquetas.split(' ');

          // Actualiza el documento
          await updateDoc(docRef, {
            descripcion,
            etiquetas,
            categoria: categoriaSeleccionada,
            subcategoria: subcategoriaSeleccionada,
          });
          alert("Datos actualizados correctamente");
        }
      } catch (error) {
        console.error("Error al actualizar datos:", error);
      }
    }
  };

  // Lógica para construir las opciones de categoría y subcategoría
  const categoriasOptions = [
    <option key={categoriaEncontrada} value={categoriaEncontrada}>
      {categoriaEncontrada}
    </option>,
    ...categorias
      .filter((categoria) => categoria !== categoriaEncontrada)
      .map((categoria) => (
        <option key={categoria} value={categoria}>
          {categoria}
        </option>
      ))
  ];

  const subcategoriasOptions = [
    <option key={subcategoriaEncontrada} value={subcategoriaEncontrada}>
      {subcategoriaEncontrada}
    </option>,
    ...subcategorias
      .filter((subcategoria) => subcategoria !== subcategoriaEncontrada)
      .map((subcategoria) => (
        <option key={subcategoria} value={subcategoria}>
          {subcategoria}
        </option>
      ))
  ];

  return (
    <div className="galeria-container">
      <div className="imagen-container">
        {imagenUrl ? (
          <img src={imagenUrl} alt="Imagen" />
        ) : (
          <p>No se ha proporcionado una URL de imagen válida.</p>
        )}
      </div>
      <div className="form-container">
        <label htmlFor="descripcion">Descripción:</label>
        <input
          type="text"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <label htmlFor="etiquetas">Etiquetas:</label>
        <input
          type="text"
          id="listaEtiquetas"
          value={listaEtiquetas}
          onChange={(e) => setListaEtiquetas(e.target.value)}
        />
        <label>Categoría Encontrada: {categoriaEncontrada}</label>
        <label>Subcategoría Encontrada: {subcategoriaEncontrada}</label>
        <label htmlFor="categoria">Categoría:</label>
        <select
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categoriasOptions}
        </select>
        <label htmlFor="subcategoria">Subcategoría:</label>
        <select
          id="subcategoria"
          value={subcategoriaSeleccionada}
          onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
        >
          {subcategoriasOptions}
        </select>
        <button onClick={handleActualizarClick}>Actualizar</button>
      </div>
    </div>
  );
}

export default InfoImagenAdmin;
