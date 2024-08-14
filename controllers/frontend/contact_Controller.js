import BrandService from '../../services/dashboard/brand_service.js';

export async function getIndex(req, res) {
  const brandNames = await BrandService.getBrands();
  res.render('../views/frontend/home', {
  });
}
