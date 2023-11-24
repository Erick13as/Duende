export class NotificacionModel {
    constructor() {
      this.estado = '';
      this.fecha = '';
      this.mensaje = '';
      this.ordenId = '';
      this.userId = '';
    }

    setEstado(estado) {
        this.estate = estado;
    }
  
    setFecha(fecha) {
      this.envio = fecha;
    }

    setMensaje(mensaje) {
        this.message = mensaje;
    }
  
    setOrdenId(ordenId) {
      this.orden = ordenId;
    }
    setUserId(userId) {
        this.user = userId;
    }
  
  }