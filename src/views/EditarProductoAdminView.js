import React from 'react';
import { Carousel } from 'react-responsive-carousel';

function EditarProductoAdmin(props) {
    const {
        id,
        productos,
        product,
        isEditing,
        editedProduct,
        editedProductImage,
        handleNavigate,
        handleEdit,
        handleCancelEdit,
        handleSaveEdit,
        handleImageChange,
        handleDelete,
        handlesetProductos,
        handlesetProduct,
        handlesetIsEditing,
        handlesetEditedProduct,
        handlesetEditedProductImage,
    } = props;
    
    return (
        <div className="vmasC-container">
          <div className="header-container">
            <button className="header-button inicio-button" onClick={() => handleNavigate('/AccederTiendaAdminController')}>
              Inicio
            </button>
            <button className="header-button" id="ordenes-button" >
              Gestion Ordenes
            </button>
            <button className="header-button" id="carrito-button">
              Añadir Producto
            </button>
          </div>
    
          <div className="image-info-container">
            <div className="image-button-container">
              <img
                className="imagen-galeria-container2"
                src={isEditing ? editedProductImage ? URL.createObjectURL(editedProductImage) : editedProduct.imagen : product.imagen}
                alt={isEditing ? editedProduct.nombre : product.nombre}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
              {!isEditing && (
                <button className="edit-button" onClick={handleEdit}>
                  Editar Producto
                </button>
              )}
              {!isEditing && (
                <button className="cancel-button" onClick={handleDelete}>
                  Eliminar Producto
                </button>
              )}
              {isEditing && (
                <button className="edit-button" onClick={handleSaveEdit}>
                  Guardar
                </button>
              )}
              {isEditing && (
                <button className="cancel-button" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          <div className="product-info">
            <h1>Detalles del Producto</h1>
            {isEditing ? (
              <div>
                <div className="input-field">
                  <label htmlFor="nombre">Nombre del Producto:</label>
                  <input
                    type="text"
                    value={editedProduct.nombre}
                    onChange={(e) => handlesetEditedProduct({ ...editedProduct, nombre: e.target.value })}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="precio">Precio:</label>
                  <input
                    type="number"
                    value={editedProduct.precio}
                    onChange={(e) => handlesetEditedProduct({ ...editedProduct, precio: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="descripcion">Descripción:</label>
                  <input
                    type="text"
                    value={editedProduct.descripcion}
                    onChange={(e) => handlesetEditedProduct({ ...editedProduct, descripcion: e.target.value })}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input
                    type="number"
                    value={editedProduct.cantidad}
                    onChange={(e) => handlesetEditedProduct({ ...editedProduct, cantidad: parseInt(e.target.value) })}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="marca">Marca:</label>
                  <input
                    type="text"
                    value={editedProduct.marca}
                    onChange={(e) => handlesetEditedProduct({ ...editedProduct, marca: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h2>Nombre del Producto: {product.nombre}</h2>
                <p>Precio: {product.precio}</p>
                <p>Descripción: {product.descripcion}</p>
                <p>Cantidad: {product.cantidad}</p>
                <p>Marca: {product.marca}</p>
              </div>
            )}
          </div>
    
          </div>
        </div>
      );
}

export default EditarProductoAdmin;