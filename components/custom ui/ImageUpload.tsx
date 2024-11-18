import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";

import { Button } from "../ui/button";
import Image from "next/image";

interface ImageUploadProps {
  // Mảng chứa các URL của hình ảnh.
  value: string[];
  // Hàm để cập nhật giá trị hình ảnh mới.
  onChange: (value: string) => void;
  // Hàm để xóa hình ảnh.
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  // Xử lý kết quả tải lên từ Cloudinary
  const onUpload = (result: any) => {
    // cập nhật URL của hình ảnh mới 
    onChange(result.info.secure_url);
  };

  // hiển thị danh sách các hình ảnh đã tải lên và cung cấp nút xóa cho từng hình ảnh
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button type="button" onClick={() => onRemove(url)} size="sm" className="bg-red-1 text-white">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      {/* nút để mở widget tải lên ảnh */}
      <CldUploadWidget uploadPreset="truongthanha14" onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button type="button" onClick={() => open()} className="bg-grey-1 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tải hình ảnh
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
