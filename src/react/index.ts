import { useCallback, useEffect, useState } from "react";
import { DATA_CENTRE } from "../modal";
import {
  ID,
  Option,
  OptionSelectProps,
  OptionSelectReturnProps,
} from "../types";
import { setToggleSelectedFunctionRecursively } from "../utils";

export const useOptionSelect = <T extends ID>(
  props: OptionSelectProps<T>
): OptionSelectReturnProps<T> => {
  const { options } = props;

  const selectedOptions = options.filter(
    (option) => option.isSelected === true
  );

  const [data] = useState(() => new DATA_CENTRE(options, selectedOptions));

  const [optionsFromDataCentre, setOptionsFromDataCentre] = useState(
    data.getOptions()
  );

  useEffect(() => {
    // Subscribe to changes and update state
    const unsubscribe = data.subscribe(() => {
      setOptionsFromDataCentre(data.getOptions());
    });
    return unsubscribe; // Cleanup on unmount
  }, [data]);

  const toggle = useCallback(
    (option: Option<T>, value: boolean) => {
      data.toggleSelected(option, value);
    },
    []
  );

  useEffect(() => {
    setToggleSelectedFunctionRecursively(optionsFromDataCentre, toggle);
    // optionsFromDataCentre.map((option) => {
    //   option.toggleSelected = (value: boolean) =>
    //     data.toggleSelected(option, value);
    //   option.isSelected = data.isSelected(option);
    // });
  }, [optionsFromDataCentre]);

  const getSelectedOptions = useCallback(() => {
    return data.getSelectedOptions();
  }, []);

  const onSelectionChange = useCallback(
    (fn: (options: Option<T>[]) => void) => {
      fn(data.getSelectedOptions());
    },
    [data]
  );

  const getOptions = useCallback(() => {
    return optionsFromDataCentre;
  }, [optionsFromDataCentre]);

  return {
    getOptions,
    getSelectedOptions,
    onSelectionChange,
  };
};
