import { ChangeEventHandler } from "react";

interface InputProps {
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({ placeholder, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="w-full bg-transparent border px-4 py-2 rounded-lg"
      onChange={onChange}
    />
  );
};
