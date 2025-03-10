# Headless Checkbox Selection

A headless checkbox selection library for JavaScript front-end frameworks like React (and more later). Supports hierarchical data structures and allows selection tracking with full control.

## Installation

```sh
npm install option-select
```

or

```sh
yarn add option-select
```

## Features

- ✅ Store-based architecture (framework-agnostic)
- ✅ Supports hierarchical data structures
- ✅ Select, deselect, toggle items
- ✅ Select all & deselect all functionality
- ✅ Retrieve selected items on demand on every selection changes happen

## Usage

### React Example

```tsx
import { useOptionSelect } from "option-select";

const items = [
  {
    id: "1",
    name: "Parent 1",
    subItems: [
      { id: "1-1", name: "Child 1-1" },
      { id: "1-2", name: "Child 1-2" },
    ],
  },
  {
    id: "2",
    name: "Parent 2",
    subItems: [{ id: "2-1", name: "Child 2-1" }],
  },
];

const { getAllItems, selectAll, deselectAll, getSelectedItems } = useOptionSelect(
  items,
  (item) => item.id
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

### `useOptionSelect(items: T[], getId: (item: T) => string)`

Returns an object with the following methods:

- **`getAllItems(): { item: T; isSelected: boolean; toggleSelection: () => void; subItems?: any[] }[]`**
  - Returns items wrapped with selection controls.
- **`selectAll(): void`**
  - Selects all items.
- **`deselectAll(): void`**
  - Deselects all items.
- **`getSelectedItems(): T[]`**
  - Returns selected items in the same structure as the input.

## License

MIT

