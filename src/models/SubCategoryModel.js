import { CategoryModel } from "./CategoryModel";

export class SubCategoryModel {
    constructor() {
      this.nombre = '';
      this.descripcion = '';
      this.categoria = CategoryModel;
    }

    setName(name) {
        this.nombreCompleto = name;
      }
  
    setDescription(description) {
      this.descripcion = description;
    }

    setCategory(category) {
        this.categoria = category;
      }
  
  }