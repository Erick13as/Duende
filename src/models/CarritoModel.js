export class CarritoModel {
    constructor() {
      this.idCarrito = '';
      this.listaProductos = [];
      this.cliente = '';
    }

    setIdCarrito(id) {
        this.idCarrito = id;
    }

    setListaProductos(listaP) {
        this.listaProductos = listaP;
    }

    setCliente(user) {
        this.cliente = user;
    }
  }
  
  