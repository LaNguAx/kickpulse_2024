import BrandsService from '../../services/dashboard/brand_service.js';
export async function brandsIndex(req, res) {
  const allBrands = await BrandsService.getBrands();
  res.render('../views/dashboard/brands', {
    brands: allBrands,
  });
}
