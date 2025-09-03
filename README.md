# Headless Option Selection

A headless option selection library for JavaScript front-end frameworks like React and Nextjs (and more later). It simplifies building **hierarchical selectors**, **multi-select dropdowns**, and **multi level nexted structures** — while giving you full control over UI.

Live demo :  [option-select-demo](https://stackblitz.com/edit/sb1-mtgegjcy?file=src%2FApp.tsx)

## Features

- ✅ **Headless**: Bring your own UI (works with React, Nextjs).
- ✅ **Hierarchical Selection**: Handles nested data with parent-child relationships.
- ✅ Select, deselect, toggle items
- ✅ Select all & deselect all functionality
- ✅ Retrieve selected items on demand or on every selection changes happen
- ✅ Accept isSelected for default selection, but if an item has subItems and not all subItems have isSelected: true, the parent’s isSelected state will be ignored.
- ✅ Store-based architecture (framework-agnostic)

## Installation

```sh
npm install option-select
```

or

```sh
yarn add option-select
```

## Usage

### React Example ( Typescript )

```tsx
import { useCallback } from "react";
import { useOptionSelect, OptionItem } from "option-select";

interface ItemProps {
  id: string;
  name: string;
  age?: number;
  isSelected?: boolean;
  subItems?: ItemProps[];
}

const items: ItemProps[] = [
    {
      id: "1",
      name: "Parent 1",
      subItems: [
        { id: "1-1", name: "Child 1-1", isSelected: true },
        { id: "1-2", name: "Child 1-2", isSelected: true },
      ],
    },
    {
      id: "2",
      name: "Parent 2",
      subItems: [
        {
          id: "2-1",
          name: "Child 2-1",
          isSelected: true,
          subItems: [{ id: "2-1-1", name: "Child 2-1-1" }],
        },
        {
          id: "2-2",
          name: "Child 2-2",
          subItems: [{ id: "2-2-1", name: "Child 2-2-1" }],
        },
      ],
    },
  ];

const Demo = () => {

    const { getAllItems, selectAll, deselectAll, getSelectedItems } = useOptionSelect(
      {
        items: items,
        getId: (item) => item.id,
        onSelectionChange: handleOnChange
      }
    );

    const handleOnChange = useCallback((items) => {
        console.log("selected items", items);
    },[])

    // render item and it's sub items Recursively
    function renderItem({ item, isSelected, toggleSelection, subItems }: OptionItem<ItemProps>) {
      return (
        <div key={item.id}>
          <label>
            <input type="checkbox" checked={isSelected} onChange={toggleSelection} />
            {item.name}
          </label>
          {subItems && (
            <div style={{ paddingLeft: 20 }}>
              {subItems.map((subItem) => renderItem(subItem))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div>
        <button onClick={selectAll}>Select All</button>
        <button onClick={deselectAll}>Deselect All</button>
        <button onClick={() => console.log("Selected Items:", getSelectedItems())}>
          Get Selected Items
        </button>
        {getAllItems().map((item) => renderItem(item))}
      </div>
    );
}
```

## API

#### `useOptionSelect({items: T[], getId: (item: T) => string, onSelectionChange?: (selectedItems: T[]) => void})`

uesOptionSlect hook accept three props

- **items**
  - Selection item array, each with isSelected ( default is false ) and subItems (optional) fields.
- **getId**
  - Unique id selector function.
- **onSelectionChange** `(optional)`
  - Callback function you want to call on every selection changes.

useOptionSelect returns an object with the following methods:

- **`getAllItems(): { item: T; isSelected: boolean; toggleSelection: () => void; subItems?: T[] }[]`**
  - Returns items with it's corresponding sub items wrapped with selection controls (isSelected, toggleSelection).
- **`selectAll(): void`**
  - Selects all items.
- **`deselectAll(): void`**
  - Deselects all items.
- **`getSelectedItems(): T[]`**
  - Returns selected items in the same hierarchical structure as the input.
 
## 🤝 Contributing

Contributions are welcome!

- Fork the repo and create your branch (git checkout -b feature/amazing-feature).

- Install dependencies with yarn install.

- Open a Pull Request.

See [CONTRIBUTING.md](https://github.com/Sai-Myo-Myat/option-select/blob/main/.github/CONTRIBUTING.md) for more details.

## License

MIT

