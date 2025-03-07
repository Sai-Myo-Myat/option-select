import { OptionSelectProps, OptionSelectReturnProps } from "../types";

export const useOptionSelect = <T extends { subItems?: T[] }>(
  props: OptionSelectProps<T>
) => {};
