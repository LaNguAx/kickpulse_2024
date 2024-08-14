import CategoryService from "../../services/dashboard/category_service.js";
import ProductService from "../../services/dashboard/product_service.js";
import BrandsService from '../../services/dashboard/brand_service.js';
export async function getIndex(req, res) {
  const { name } = req.params;
  try {
    console.log('test')
    const categories = await CategoryService.getCategories();
    const category = await CategoryService.getCategoryByName(name);
    const categoryProducts = await ProductService.getProductsByCategoryId(category._id);
    const brands = await BrandsService.getBrands();
    categories.brandNames = brands;

    res.render('../views/frontend/category', {
      categories,
      category,
      categoryProducts,
      brands,
      session: req.session,
    });
  }
  catch (e) {
    res.redirect('/404');
  }
}

export async function getSubCategoryIndex(req, res) {
  try {
    const { subcategory } = req.params;
    req.params.name = subcategory;
    getIndex(req, res);
  }
  catch (e) {
    res.redirect('/404');
  }
}


export async function categoryMiddleware(req, res) {
  const { id } = req.params;
  try {
    const category = await CategoryService.getCategory(id);
    res.redirect(`/category/${category.name.toLowerCase()}`);

  } catch (e) {
    console.error(e);
    res.redirect('/404');
  }
}



export async function getBrandIndex(req, res) {
  const { name } = req.params;

  try {
    const categories = await CategoryService.getCategories();
    const brand = await BrandsService.getBrandByName(name);
    // const categoryProducts = await ProductService.getProductsByCategoryId(category._id);
    // const brands = await BrandsService.getBrands();
    const brandProducts = await ProductService.getProductsByBrandName(brand.name);
    const brandNames = await BrandsService.getBrands();
    categories.brandNames = brandNames;

    res.render('../views/frontend/brand', {
      categories,
      brand,
      brandProducts,
      session: req.session,
      brandNames
    })

  } catch (e) {
    console.error(e);
    res.redirect('/404');
  }

}