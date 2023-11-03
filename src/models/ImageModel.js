export class ImageModel {
    constructor() {
      this.imageUrls = '';
      this.selectedCategory = '';
      this.selectedSubcategory = '';
      this.categories = [];
      this.subcategories = [];
    }
  
    setImages(images) {
      this.imageUrls = images;
    }
  
    setCategories(categories) {
      this.categories = categories;
    }
  
    setSubcategories(subcategories) {
      this.subcategories = subcategories;
    }
  
    setSelectedCategory(category) {
      this.selectedCategory = category;
    }
  
    setSelectedSubcategory(subcategory) {
      this.selectedSubcategory = subcategory;
    }
  }
  