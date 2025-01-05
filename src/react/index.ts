import { useState } from "react";
import { DATA_CENTRE } from "../modal";
import {
  ID,
  Option,
  OptionSelectProps,
  OptionSelectReturnProps,
} from "../types";

export const useOptionSelect = <T extends ID>(
  props: OptionSelectProps<T>
): OptionSelectReturnProps<T> => {
  const { options } = props;

  const [ops] = useState(options);

  console.log("options: ", ops)

  const selectedOptions = options.filter(
    (option) => option.isSelected === true
  );

  const data = new DATA_CENTRE(options, selectedOptions);

  const optionsFromDataCentre = data.getOptions();

  optionsFromDataCentre.map((option) => {
    option.toggleSelected = (value: boolean) =>
      data.toggleSelect(option, value);
    option.isSelected = data.isSelected(option);
  });

  const getSelectedOptions = () => {
    return data.getSelectedOptions();
  };

  const onSelectionChange = (fn: (options: Option<T>[]) => void) => {
    fn(data.getSelectedOptions());
  };

  const getOptions = () => {
    return data.getOptions();
  };

  return {
    getOptions,
    getSelectedOptions,
    onSelectionChange,
  };
};
