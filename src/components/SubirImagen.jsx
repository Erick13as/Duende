import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
    }
  };

  const handleUpload = async () => {
    if (image) {
      setUploading(true);

      try {
        // Subir la imagen al almacenamiento de Firebase
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);

        // Obtener la URL de descarga de la imagen
        const downloadURL = await getDownloadURL(storageRef);

        // Guardar la URL de la imagen en Firestore
        const docRef = await addDoc(collection(db, 'images'), {
          imageUrl: downloadURL,
        });

        setImageUrl(downloadURL);
        console.log('Imagen subida con éxito. ID del documento:', docRef.id);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="subir_imagen-container">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        Subir imagen
      </button>
      {uploading && <p>Subiendo imagen...</p>}
      {imageUrl && (
        <div className="imagen-container">
          <p>Imagen subida con éxito:</p>
          <img src={imageUrl} alt="Imagen subida" />
        </div>
      )}
    </div>
    
  );
}

export default ImageUpload;
