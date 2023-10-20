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

  // Estado para almacenar las categorías y subcategorías de la imagenQuery
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

  const handleEliminarClick = async () => {
  try {
    const querySnapshot = await getDocs(imagenQuery);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;

      // Obtén la URL de la imagen y el nombre del archivo
      const imagenData = querySnapshot.docs[0].data();
      const imagenPath = imagenData.imagenUrl;
      console.log(imagenPath)

      // Crear una referencia para el archivo en Firebase Storage
      const storageRef = ref(storage, imagenPath);

      // Borra el archivo en Firebase Storage
      await deleteObject(storageRef);
      
      // Borra el documento en Firestore
      await deleteDoc(docRef);

      alert("Imagen eliminada correctamente");
      navigate('/galeriaAdmin'); // Redirige a la página de la galería u otra página según tus necesidades
    }
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
  }
};

  
  const handleActualizarClick = async () => {
    if (
      (categoriaEncontrada !== categoriaSeleccionada && subcategoriaAnterior === subcategoriaSeleccionada) ||
      subcategoriaSeleccionada === "..." ||
      subcategoriaSeleccionada === ".."
    ) {
      alert("Datos inválidos");
    } else {
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

  const handleReemplazarImagen = async () => {
    if (newImage) {
      try {
        const querySnapshot = await getDocs(imagenQuery);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;

          // Obtén la URL de la imagen actual para eliminarla
          const imagenData = querySnapshot.docs[0].data();
          const imagenPath = imagenData.imagenUrl;

          // Borra el archivo anterior en Firebase Storage
          const storageRef = ref(storage, imagenPath);
          await deleteObject(storageRef);

          // Sube la nueva imagen a Firebase Storage
          const newImageRef = ref(storage, `imagen/${newImage.name}`);
          await uploadBytes(newImageRef, newImage);

          // Obtiene la nueva URL de la imagen
          const newImageUrl = await getDownloadURL(newImageRef);

          // Actualiza la URL de la imagen en Firestore
          await updateDoc(docRef, { imagenUrl: newImageUrl });

          alert("Imagen reemplazada correctamente");
          navigate('/galeriaAdmin');
        }
      } catch (error) {
        console.error("Error al reemplazar la imagen:", error);
      }
    } else {
      alert("Por favor, selecciona una nueva imagen.");
    }
  };

  return (
    <div className="info-container">
      <button className="botonFijo" onClick={() => navigate('/galeriaAdmin')}>
        Galería
      </button>
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
        <button className="buttons" type="button" onClick={handleEliminarClick} id="hola">
          Eliminar Imagen
        </button>
        <button className="buttons" type="button" onClick={handleCambiarClick}>
        Cambiar Imagen
        </button>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        <button className="buttons" type="button" onClick={handleReemplazarImagen}>
          Reemplazar Imagen
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
        />
        <br />
        <label htmlFor="categoria">Categoría:</label>
        <br />
        <select
          className="textBox"
          id="categoria"
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
        >
          {categoriasOptions}
        </select>
        <br />
        <label htmlFor="subcategoria">Subcategoría:</label>
        <br />
        <select
          className="textBox"
          id="subcategoria"
          value={subcategoriaSeleccionada}
          onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
        >
          {subcategoriasOptions}
        </select>
        <br />
        <button onClick={handleActualizarClick} className="buttons">Actualizar</button>
      </div>
    </div>
  );
}

export default InfoImagenAdmin;
