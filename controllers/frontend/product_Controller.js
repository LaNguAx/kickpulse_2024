
import CategoryService from "../../services/dashboard/category_service.js";
import ProductService from "../../services/dashboard/product_service.js";
import BrandService from '../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const { name } = req.params;
  try {
    const categories = await CategoryService.getCategories();
    const brandNames = await BrandService.getBrands();
    categories.brandNames = brandNames;
    
    const product = await ProductService.getProductByName(name);

    res.render('../views/frontend/product', {
      categories,
      product,
      session: req.session
    });
  }
  catch (e) {
    res.redirect('/404');
  }
}


export async function productMiddleware(req, res) {
  const { id } = req.params;
  try {
    const product = await ProductService.getProduct(id);
    res.redirect(`/product/${product.name.toLowerCase()}`);

  } catch (e) {
    console.error(e);
    res.redirect('/404');
  }
}