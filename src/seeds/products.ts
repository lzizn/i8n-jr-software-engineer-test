import _ from 'lodash';
import { v4 } from 'uuid';

import { FieldsMapper } from '../utils';
import { initializeModels } from '../models';
import type { BrSupplierProduct, EuSupplierProduct, Product } from '../types';

import brazilianSupplierProducts from '../mocks/brazilian-suplier.json';
import europeanSupplierProducts from '../mocks/european-supplier.json';

const materialNameByDbId: Record<string, string> = {};
const departmentNameByDbId: Record<string, string> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const departmentsRecords: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const materialsRecords: any[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productsRecords: any[] = [];

const getOrCreateEntityId = (
  mappedProduct: Product,
  entity: 'department' | 'material',
) => {
  const _entityName = mappedProduct[entity];

  const entityNameByIdDict =
    entity === 'department' ? departmentNameByDbId : materialNameByDbId;

  if (!_entityName) {
    return null;
  }

  const _entityId = entityNameByIdDict[_entityName] || v4();

  entityNameByIdDict[_entityName] = _entityId;

  return _entityId;
};

async function seed() {
  const fieldMapper = new FieldsMapper();
  const models = initializeModels();

  const suppliers = [
    {
      products: brazilianSupplierProducts as BrSupplierProduct[],
      localization: 'br',
    },
    {
      products: europeanSupplierProducts as EuSupplierProduct[],
      localization: 'eu',
    },
  ] as const;

  suppliers.forEach(({ localization, products }) => {
    products.forEach((product) => {
      const mappedProduct = fieldMapper.mapProduct(product, localization);
      const _product = {
        name: mappedProduct.name,
        description: mappedProduct.description,
        price: Number(mappedProduct.price),
        materialId: '' as string | null,
        departmentId: '' as string | null,
      };

      const _departmentId = getOrCreateEntityId(mappedProduct, 'department');
      _product['departmentId'] = _departmentId;

      const _materialId = getOrCreateEntityId(mappedProduct, 'material');
      _product['materialId'] = _materialId;

      productsRecords.push(_product);
    });
  });

  _.forEach(departmentNameByDbId, (depId, depName) => {
    departmentsRecords.push({
      id: depId,
      name: depName,
    });
  });

  _.forEach(materialNameByDbId, (materialId, materialName) => {
    materialsRecords.push({
      id: materialId,
      name: materialName,
    });
  });

  // eslint-disable-next-line no-console
  console.log(
    {
      departmentsCount: _.size(departmentsRecords),
      materialsCount: _.size(materialsRecords),
    },
    'seeded departments and materials',
  );

  // eslint-disable-next-line no-console
  console.log(_.size(productsRecords), 'seeded products');

  const insertMaterials = models.product.Material.query()
    .insert(materialsRecords)
    .onConflict()
    .ignore();

  const insertDepartments = models.product.Department.query()
    .insert(departmentsRecords)
    .onConflict()
    .ignore();

  await Promise.all([insertDepartments, insertMaterials]);

  const insertProducts = models.product.Product.query().insert(productsRecords);

  await insertProducts;
}

async function clean() {
  const models = initializeModels();

  await models.product.Product.query().del();

  await Promise.all([
    models.product.Material.query().del(),
    models.product.Department.query().del(),
  ]);
}

export { clean, seed };
export default { clean, seed };
