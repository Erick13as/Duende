import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where, updateDoc, deleteDoc} from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

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

  const [categoriaEncontrada, setCategoriaEncontrada] = useState("");
  const [subcategoriaEncontrada, setSubcategoriaEncontrada] = useState("");

  const [subcategoriaAnterior, setSubcategoriaAnterior] = useState("");
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState(null);

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
      try {
        const categoriasRef = collection(db, 'categoria');
        const categoriasSnapshot = await getDocs(categoriasRef);
        const categoriasData = categoriasSnapshot.docs.map((doc) => doc.data().nombre);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Consulta todas las subcategorías desde Firestore
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        // Verifica si se ha seleccionado una categoría
        if (categoriaSeleccionada) {
          const subcategoriasRef = collection(db, 'subcategoria');
          const subcategoriasQuery = query(subcategoriasRef, where('categoria', '==', categoriaSeleccionada));
          const subcategoriasSnapshot = await getDocs(subcategoriasQuery);
          const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
          if ((categoriaEncontrada !== categoriaSeleccionada && subcategoriaEncontrada !== "...")) {
            setSubcategoriaAnterior(subcategoriaEncontrada);
            setSubcategoriaEncontrada("...");
          }
          if (categoriaEncontrada === categoriaSeleccionada && subcategoriaEncontrada === "...") {
            setSubcategoriaAnterior(subcategoriaSeleccionada);
          }
          setSubcategorias(subcategoriasData);
        } else {
          // Si no se ha seleccionado una categoría, muestra todas las subcategorías
          const subcategoriasRef = collection(db, 'subcategoria');
          const subcategoriasSnapshot = await getDocs(subcategoriasRef);
          const subcategoriasData = subcategoriasSnapshot.docs.map((doc) => doc.data().nombre);
          setSubcategorias(subcategoriasData);
        }
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    };
    fetchSubcategorias();
  }, [categoriaSeleccionada, categoriaEncontrada, subcategoriaEncontrada, subcategoriaAnterior, subcategoriaSeleccionada]);

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

  const handleCambiarClick = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  return (
    <div className="info-container">
      <form className='formTopOA'>
        <div>
          <button className="botonFijo" onClick={() => navigate('/galeriaCliente')}>
            Galería
          </button>
          <button className="botonOA" onClick={() => navigate('/AccederTiendaClienteController')}>
            Tienda
          </button>      
        </div>
      </form>

      <form className="formImagenInfo">
        <div className="imagen-container-info">
          {newImage ? (
            <img src={URL.createObjectURL(newImage)} alt="Nueva Imagen" />
          ) : (
            imagenUrl ? (
              <img src={imagenUrl} alt="Imagen Actual" />
            ) : (
              <p>No se ha proporcionado una URL de imagen válida.</p>
            )
          )}
        </div>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button className="buttons" type="button" onClick={() => navigate('/galeriaCliente')} >
          Enviar Referencia
        </button>
      </form>
      <div className="formContainerInfo">
        <label htmlFor="descripcion">Descripción:</label>
        <br />
        <input
          className="textBox"
          type="text"
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled
        />
        <br />
        <label htmlFor="etiquetas">Etiquetas:</label>
        <br />
        <input
          className="textBox"
          type="text"
          id="listaEtiquetas"
          value={listaEtiquetas}
          onChange={(e) => setListaEtiquetas(e.target.value)}
          disabled
        />
        <br />
        <label htmlFor="categoria">Categoría:</label>
        <br />
        <input
          className="textBox"
          type="text"
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          disabled
        />
        <br />
        <label htmlFor="subcategoria">Subcategoría:</label>
        <br />
        <input
          className="textBox"
          type="text"
          id="subcategoria"
          value={subcategoriaSeleccionada}
          onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
          disabled
        />
        <br />
  
      </div>
    </div>
  );
}

export default InfoImagenAdmin;
