export class OrdenModel {
    constructor() {
        this.idOrden = "";
        this.listaProductos = [];
        this.montoTotal = "";
        this.direccionEntrega = "";
        this.cliente = "";
        this.fechaEntrega = "";
        this.imagenPagoUrl = "";
        this.estado = "";
    }

    setIdOrden(id) {
        this.idOrden = id;
    }

    setListaProductos(listaP) {
        this.listaProductos = listaP;
    }

    setMontoTotal(total) {
        this.montoTotal = total;
    }

    setDireccionEntrega(direccion) {
        this.direccionEntrega = direccion;
    }

    setCliente(user) {
        this.cliente = user;
    }

    setFechaEntrega(fecha) {
        this.fechaEntrega = fecha;
    }

    setImagenPagoUrl(Url) {
        this.imagenPagoUrl = Url;
    }

    setEstado(estate) {
        this.estado = estate;
    }
}