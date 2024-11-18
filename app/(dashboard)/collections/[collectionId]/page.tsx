"use client"

import { useEffect, useState } from "react"

import Loader from "@/components/custom ui/Loader"
import CollectionForm from "@/components/collections/CollectionForm"

// khai báo CollectionDetails(bộ sưu tập chi tiết) và nhận params(Tham số) từ collectionID
const CollectionDetails = ({ params }: { params: { collectionId: string }}) => {
//  khai báo dấu loading :để đang tải dữ liệu
  const [loading, setLoading] = useState(true)
  //  Colle ctionDetails để lưu trữ dữ liệu sau khi tải xong
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)

  // Khai báo hàm getCollectionDetails để gọi API và lấy dữ liệu của bộ sưu tập.
  const getCollectionDetails = async () => {
    try { 
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCollectionDetails(data)
      setLoading(false)
      // catch: Bắt lỗi nếu có vấn đề xảy ra khi gọi API.
    } catch (err) {
      console.log("[collectionId_GET]", err)
    }
  }

  useEffect(() => {
    getCollectionDetails()
  }, [])

  // báo cho người dùng biết rằng dữ liệu đang được tải.
  return loading ? <Loader /> : (
    <CollectionForm initialData={collectionDetails}/>
  )
}
// Xuất component CollectionDetails để sử dụng ở nơi khác.
export default CollectionDetails