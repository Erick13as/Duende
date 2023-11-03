export class DireccionModel {
    constructor() {
      this.idDireccion = 0;
      this.provincia = '';
      this.canton = '';
      this.distrito = '';
    }
  
    setIdDireccion(id) {
      this.idDireccion = id;
    }
  
    setProvincia(provincia) {
      this.provincia = provincia;
    }
  
    setCanton(canton) {
      this.canton = canton;
    }
  
    setDistrito(distrito) {
      this.distrito = distrito;
    }
  
  }
  