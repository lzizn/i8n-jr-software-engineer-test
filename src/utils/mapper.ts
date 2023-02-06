import _ from 'lodash';

import type {
  Product,
  ValueOf,
  BrSupplierProduct,
  EuSupplierProduct,
  ProductMapperPaths,
} from '../types';

class FieldsMapper {
  br: ProductMapperPaths = {
    name: 'nome',
    description: 'descricao',
    material: 'material',
    price: 'preco',
    pictures: 'imagem',
    department: 'departamento',
  };
  eu: ProductMapperPaths = {
    name: 'name',
    description: 'description',
    material: 'details.material',
    price: 'price',
    pictures: 'gallery',
    department: '',
  };

  mapProduct(
    product: BrSupplierProduct | EuSupplierProduct,
    localization: 'br' | 'eu',
  ) {
    const mappedProduct: Product = {
      name: '',
      description: '',
      price: 0,
      pictures: '',
      department: '',
      material: '',
    };

    const productFieldToSuppliedFieldPath = this[localization];
    _.map(
      productFieldToSuppliedFieldPath,
      (
        supplierPath: ValueOf<ProductMapperPaths>,
        productField: keyof Product,
      ) => {
        // TODO: ??? why is this failing? FIX THIS!
        const _v = _.get(product, supplierPath) as never;
        mappedProduct[productField] = _v;
      },
    );

    return mappedProduct;
  }
}

export { FieldsMapper };
