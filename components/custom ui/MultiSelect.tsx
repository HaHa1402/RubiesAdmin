// Mục Collectiontrong product 
// (MultiSelect):chọn một hoặc nhiều bộ sưu tập từ danh sách collections có sẵn và hiển thị các bộ sưu tập đã chọn dưới dạng "badge". 
"use client";

// các thành phần UI phục vụ cho chức năng chọn.
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
// quản lý trạng thái của các biến trong thành phần.
import { useState } from "react";
// thành phần dùng để hiển thị các mục đã chọn.
import { Badge } from "../ui/badge";
// icon dùng cho nút xoá.
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;  //ô nhập liệu
  collections: CollectionType[];//Mảng các bộ sưu tập 
  value: string[]; //hiển thị các mục đã chọn dưới dạng "badge".
  onChange: (value: string) => void;//thêm một bộ sưu tập mới
  onRemove: (value: string) => void;//bỏ một mục khỏi danh sách đã chọn.
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove, 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // lựa tab chọn bộ sưu tập hiện trên thanh chính collection và button (x)
  let selected: CollectionType[];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  const selectables = collections.filter((collection) => !selected.includes(collection)); 

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((collection) => (
          <Badge key={collection._id}>
            {collection.title}
            <button type="button" className="ml-1 hover:text-red-1" onClick={() => onRemove(collection._id)}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((collection) => (
              <CommandItem
                key={collection._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(collection._id);
                  setInputValue("");
                }}
                // nền khi di chuột tới
                className="hover:bg-grey-2 cursor-pointer"
              >
                {collection.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
