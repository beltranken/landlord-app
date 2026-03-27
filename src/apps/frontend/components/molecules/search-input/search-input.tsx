import {
  TextInput,
  TextInputProps,
} from "@/components/atoms/text-input/text-input";

export default function SearchInput(props: TextInputProps) {
  return <TextInput leftIconName="search" placeholder="Search" {...props} />;
}
