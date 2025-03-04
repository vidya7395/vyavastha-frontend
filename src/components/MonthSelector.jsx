import { useState } from "react";
import { Group, Button, Combobox, Flex, Divider } from "@mantine/core";
import PropTypes from "prop-types";

const MonthSelector = ({ onMonthChange }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0"); // Get current month (1-based)

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
  const [opened, setOpened] = useState(false);

  // ✅ Generate month options in "Jan-YYYY" format
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map((month, index) => ({
    value: `${selectedYear}-${String(index + 1).padStart(2, "0")}`, // ✅ API format "YYYY-MM"
    label: `${month}-${selectedYear}`, // ✅ Display format "Jan-YYYY"
  }));

  return (
    <Combobox
      withinPortal
      width="auto"
      position="bottom-start"
      opened={opened}
      onClose={() => setOpened(false)}
      onOpen={() => setOpened(true)}
      onOptionSubmit={(value) => {
        setSelectedMonth(value);
        setOpened(false);
        onMonthChange(value);
      }}
    >
      <Combobox.Target>
        <Button variant="white" color="dark"  onClick={() => setOpened((o) => !o)}>
          {months.find((m) => m.value === selectedMonth)?.label || "Select Month"}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        {/* 🔹 Year Navigation Above the List */}
        <Group position="apart">
          <Flex direction="row">
            <Button size="xs" variant="subtle" onClick={() => setSelectedYear((prev) => prev - 1)}>
              ◀ {selectedYear - 1}
            </Button>
            <strong>{selectedYear}</strong>
            <Button size="xs" variant="subtle" onClick={() => setSelectedYear((prev) => prev + 1)}>
              {selectedYear + 1} ▶
            </Button>
          </Flex>
        </Group>
        <Divider />

        {/* 🔹 Month List with Highlighted Selected Value */}
        {months.map((month) => (
          <Combobox.Option 
            key={month.value} 
            value={month.value} 
            selected={month.value === selectedMonth} // ✅ Highlight selected value
          >
            {month.label}
          </Combobox.Option>
        ))}
      </Combobox.Dropdown>
    </Combobox>
  );
};

MonthSelector.propTypes = {
  onMonthChange: PropTypes.func.isRequired,
};

export default MonthSelector;
