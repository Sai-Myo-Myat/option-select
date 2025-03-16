# Headless Option Selection

A headless option selection library for JavaScript front-end frameworks like React (and more later). Supports hierarchical data structures and allows selection tracking with full control.

Live demo :  [option-select-demo](https://stackblitz.com/edit/sb1-mtgegjcy?file=src%2FApp.tsx)

## Installation

```sh
npm install option-select
```

or

```sh
yarn add option-select
```

## Features

- ✅ Supports hierarchical data structures (parent item and  sub items)
- ✅ Select, deselect, toggle items
- ✅ Select all & deselect all functionality
- ✅ Retrieve selected items on demand or on every selection changes happen
- ✅ Accept isSelected for default selection, but if an item has subItems and not all subItems have isSelected: true, the parent’s isSelected state will be ignored.
- ✅ Store-based architecture (framework-agnostic)

## Usage

### React Example

```tsx
import { useOptionSelect } from "option-select";

const items = [
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

const handleOnChange = useCallback((items) => {
    console.log("selected items", items);
},[])

const { getAllItems, selectAll, deselectAll, getSelectedItems } = useOptionSelect(
  {
    items: items,
    getId: (item) => item.id,
    onSelectionChange: handleOnChange
  }
);

function renderItem({ item, isSelected, toggleSelection, subItems }) {
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
```

## API

### `useOptionSelect({items: T[], getId: (item: T) => string, onSelectionChange?: (item: T[]) => void})`

Returns an object with the following methods:

- **`getAllItems(): { item: T; isSelected: boolean; toggleSelection: () => void; subItems?: T[] }[]`**
  - Returns items wrapped with selection controls.
- **`selectAll(): void`**
  - Selects all items.
- **`deselectAll(): void`**
  - Deselects all items.
- **`getSelectedItems(): T[]`**
  - Returns selected items in the same hierarchical structure as the input.

## License

MIT

