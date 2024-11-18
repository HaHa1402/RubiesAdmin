"use client"

import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import React, { useEffect, useState } from 'react'

// khai báo sản phẩm chi tiết và nhận params(Tham số) từ productID
const ProductDetails = ({ params }: { params: { productId: string }}) => {
  //  khai báo dấu loading :để đang tải dữ liệu
  const [loading, setLoading] = useState(true)
    //  ProductDetails để lưu trữ dữ liệu sau khi tải xong
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)
   // Khai báo hàm getProductDetails để gọi API và lấy dữ liệu của sanr phẩm.
  const getProductDetails = async () => {
    try { 
      // lấy thông tin chi tiết của sản phẩm từ API
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
       // catch: Bắt lỗi nếu có vấn đề xảy ra khi gọi API.
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }

  // đảm bảo rằng thông tin sản phẩm được tải ngay khi component được render.
  useEffect(() => {
    getProductDetails()
  }, [])

  // báo cho người dùng biết rằng dữ liệu đang được tải.
  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails} />
  )
}

export default ProductDetails