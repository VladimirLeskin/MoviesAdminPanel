export interface InputProps<ValueType, MetaType = void> {
  value: ValueType;
  onChange: (value: ValueType) => void;
  metaData?: MetaType;
  disabled?: boolean;
}
