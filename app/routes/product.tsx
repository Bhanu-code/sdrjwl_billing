import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React, { useState } from 'react';
import { ProductForm } from '~/components/Product/ProductForm';
import ProductTable from '~/components/Product/ProductTable';
import { createProduct, deleteProductById, getAllProducts, updateProduct } from '~/data/product.server';

const ProductsPage = () => {
  const productData = useLoaderData<typeof loader>();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <ProductForm />
      <ProductTable products={productData} />
    </div>
  );
};

export async function loader({ request }: LoaderFunctionArgs) {
  return await getAllProducts();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);

  const formType: any = userData?.form_type;

  if (formType === "create-form") {
    return createProduct(userData);
  } else if (formType === "delete-form") {
    return deleteProductById(Number(userData.productId));
  } else if (formType === "update-form") {
    return updateProduct(userData, Number(userData.productId));
  }
}

export default ProductsPage;