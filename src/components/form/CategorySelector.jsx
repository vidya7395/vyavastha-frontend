import { Combobox, ScrollArea, TextInput, Button } from '@mantine/core';
import PropTypes from 'prop-types';

const CategorySelector = ({
  value,
  onChange,
  options,
  combobox,
  isCreating,
  onCreateCategory,
  error,
  clearErrors
}) => {
  const filteredOptions = options.filter(
    (item) =>
      typeof item.name === 'string' &&
      item.name.toLowerCase().includes(String(value).toLowerCase().trim())
  );

  const optionItems = filteredOptions.map((item) => (
    <Combobox.Option value={item.name} key={item._id}>
      {item.name}
    </Combobox.Option>
  ));

  return (
    <Combobox
      flex={1}
      value={value}
      onChange={onChange}
      onOptionSubmit={(optionValue) => {
        onChange(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          variant="default"
          size="sm"
          placeholder="Choose or create"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            clearErrors('category');
          }}
          onClick={combobox.openDropdown}
          onFocus={combobox.openDropdown}
          onBlur={combobox.closeDropdown}
          error={error}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200}>
            {optionItems.length === 0 ? (
              <Combobox.Empty>
                No categories found.{' '}
                <Button
                  variant="subtle"
                  size="xs"
                  onClick={() => onCreateCategory(value)} // ✅ value passed
                  loading={isCreating}
                >
                  {`Create "${value}"`}
                </Button>
              </Combobox.Empty>
            ) : (
              optionItems
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

CategorySelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  combobox: PropTypes.object.isRequired,
  isCreating: PropTypes.bool,
  onCreateCategory: PropTypes.func.isRequired,
  error: PropTypes.string,
  clearErrors: PropTypes.func.isRequired
};

export default CategorySelector;
