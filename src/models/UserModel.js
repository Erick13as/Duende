export class UserModel {
    constructor() {
      this.correo = '';
      this.nombreCompleto = '';
      this.rol = '';
    }
  
    setEmail(email) {
      this.correo = email;
    }
  
    setName(name) {
      this.nombreCompleto = name;
    }
  
    setRole(role) {
      this.rol = role;
    }
  }