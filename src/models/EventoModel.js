export class EventoModel {
    constructor() {
      this.description = '';
      this.end = '';
      this.id = '';
      this.numeroOrden = '';
      this.start = '';
      this.tipo = '';
      this.title = '';
    }

    setDescription(description) {
        this.descripcion = description;
    }
  
    setEnd(end) {
      this.fin = end;
    }

    setId(id) {
        this.identificador = id;
    }

    setNumeroOrden(numeroOrden) {
        this.orden = numeroOrden;
    }

    setStart(start) {
        this.inicio = start;
    }

    setTipo(tipo) {
        this.type = tipo;
    }

    setTitle(title) {
        this.nombre = title;
    }
  }