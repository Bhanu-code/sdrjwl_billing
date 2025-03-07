import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { ProductForm } from '~/components/Product/ProductForm';
import ProductTable from '~/components/Product/ProductTable';
import { createProduct, deleteProductById, getAllProducts, updateProduct } from '~/data/product.server';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    product_name: 'Gold Ring',
    gross_weight: 10.5,
    net_weight: 9.8,
    huid_no: 'HUID12345',
    hsn_code: '7113',
    sales_rate: 50000,
    unit: 'Weight(W)',
    making_charges: 1500,
    barcode: '123456789012',
    hallmark_no: 'HALL67890',
    other_charges: 200,
    product_code: 'GR001',
    created_at: '2023-10-01T12:00:00Z',
  },
  {
    id: 2,
    product_name: 'Silver Bracelet',
    gross_weight: 25.0,
    net_weight: 24.5,
    huid_no: null,
    hsn_code: '7114',
    sales_rate: 20000,
    unit: 'Piece(P)',
    making_charges: 1000,
    barcode: '987654321098',
    hallmark_no: null,
    other_charges: null,
    product_code: 'SB002',
    created_at: '2023-10-02T12:00:00Z',
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState(mockProducts);

  const productData:any = useLoaderData()


  // Mock function to simulate fetching products
  const fetchProducts = () => {
    console.log('Fetching products...');
    // In a real implementation, this would call the backend API
  };

  // Mock function to handle product submission
  const handleProductSubmit = async (formFields: any) => {
    console.log('Product submitted:', formFields);
    // Simulate adding a new product to the list
    const newProduct = {
      id: products.length + 1,
      ...formFields,
      gross_weight: parseFloat(formFields.gross_weight),
      net_weight: parseFloat(formFields.net_weight),
      sales_rate: parseFloat(formFields.sales_rate),
      making_charges: parseFloat(formFields.making_charges),
      other_charges: formFields.other_charges ? parseFloat(formFields.other_charges) : null,
      barcode: null,
      created_at: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <ProductForm onSubmit={handleProductSubmit} />
      <ProductTable products={productData} fetchProducts={fetchProducts} />
    </div>
  );
};

export async function loader({request}:LoaderFunctionArgs) {
  return await getAllProducts()
}


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  console.log("productDetails", userData);

  const formType: any = userData?.form_type;

  if (formType === "create-form") {
    return createProduct(userData);
  }else if(formType === "delete-form"){
    return deleteProductById(Number(userData.productId))
  }
  else if(formType === "update-form") {
    console.log("updated triggered")
    console.log("product Data", userData)
    return updateProduct(userData, Number(userData.productId));
  }

}


export default ProductsPage;