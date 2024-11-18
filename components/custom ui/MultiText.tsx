// (Mục Tab trong product)nhập thủ công nhiều giá trị văn bản vào một danh sách, hiển thị chúng dưới dạng "badge," và xóa từng giá trị khi không cần thiết.
"use client";

import { useState } from "react";

import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface MultiTextProps {
  placeholder: string;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiText: React.FC<MultiTextProps> = ({
  placeholder,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  // chỉ hiện 1 badge khi nhập
  const addValue = (item: string) => {
    // Kiểm tra xem giá trị đã tồn tại trong value chưa và không rỗng
    if (!value.includes(item) && item.trim() !== "") {
      onChange(item);
    }
    setInputValue(""); // Đặt lại giá trị input
  };


  return (
    <>
    {/* Khi người dùng nhấn "Enter," inputValue sẽ được thêm vào danh sách qua hàm addValue. */}
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValue(inputValue);
          }
        }}
      />

      {/* Nút "X": nút này sẽ gọi onRemove để loại bỏ giá trị tương ứng khỏi danh sách. */}
      <div className="flex gap-1 flex-wrap mt-4">
        {value.map((item, index) => (
          <Badge key={index} className="bg-grey-1 text-white">
            {item}
            <button
              className="ml-1 rounded-full outline-none hover:bg-red-1"
              onClick={() => onRemove(item)}
              type="button"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
};

export default MultiText;
