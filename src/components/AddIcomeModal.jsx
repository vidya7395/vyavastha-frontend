import { useState } from "react";
import PropTypes from 'prop-types';
import { TextInput, Group, Card, Stack, NumberInput, Select, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconTrash } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { closeModal } from "../store/modalSlice";

const AddIncome = ({ onAddIncome }) => {
  const dispatch = useDispatch();
  const [incomes, setIncomes] = useState([
    { id: Date.now(), date: "", category: "", newCategory: "", spendingType: "", description: "", amount: "" }
  ]);

  // ✅ Add a new income field dynamically
  const addIncomeField = () => {
    setIncomes([...incomes, { id: Date.now(), date: "", category: "", newCategory: "", spendingType: "", description: "", amount: "" }]);
  };

  // ✅ Remove an income field
  const removeIncomeField = (id) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // ✅ Update field values
  const handleChange = (id, field, value) => {
    setIncomes(incomes.map((income) => income.id === id ? { ...income, [field]: value } : income));
  };

  // ✅ Handle form submission
  const handleSubmit = () => {
    if (incomes.some(income => !income.date || (!income.category && !income.newCategory) || !income.spendingType || !income.amount)) {
      alert("Please fill all required fields.");
      return;
    }

    const formattedIncomes = incomes.map(income => ({
      date: income.date,
      category: income.newCategory ? income.newCategory : income.category, // Use new category if entered
      type: "income",
      spendingType: income.spendingType,
      description: income.description,
      amount: Number(income.amount),
    }));

    onAddIncome(formattedIncomes); // ✅ Send data to parent/API
    dispatch(closeModal()); // ✅ Close modal after submission
  };

  return (
    <Stack>
      {incomes.map((income, index) => (
        <Card key={income.id} shadow="sm" padding="md" withBorder>
          <Group position="apart">
            <span>Income {index + 1}</span>
            {incomes.length > 1 && (
              <Button variant="subtle" size="xs" color="red" onClick={() => removeIncomeField(income.id)}>
                <IconTrash size={16} />
              </Button>
            )}
          </Group>

          {/* Income Date */}
          <DateInput
            mb={10}
            placeholder="Select date"
            value={income.date}
            onChange={(value) => handleChange(income.id, "date", value)}
            required
            size="sm"
          />

          {/* Category Selection */}
          <Select
            label="Category"
            placeholder="Select a category"
            data={[]}
            value={income.category}
            onChange={(value) => handleChange(income.id, "category", value)}
          />

          {/* Spending Type Selection */}
          <Select
            label="Spending Type"
            placeholder="Select type"
            data={[
              { value: "needs", label: "Needs" },
              { value: "wants", label: "Wants" },
              { value: "savings", label: "Savings" }
            ]}
            value={income.spendingType}
            onChange={(value) => handleChange(income.id, "spendingType", value)}
            required
          />

          {/* Income Description */}
          <TextInput
            label="Description"
            placeholder="Enter details (optional)"
            value={income.description}
            onChange={(e) => handleChange(income.id, "description", e.target.value)}
          />

          {/* Income Amount */}
          <NumberInput
            label="Amount (₹)"
            placeholder="Enter amount"
            value={income.amount}
            min={1}
            onChange={(value) => handleChange(income.id, "amount", value)}
            required
          />
        </Card>
      ))}

      <Button variant="outline" onClick={addIncomeField}>Add More Income</Button>
      <Button fullWidth onClick={handleSubmit}>Save Incomes</Button>
    </Stack>
  );
};
AddIncome.propTypes = {
  onAddIncome: PropTypes.func.isRequired,
};

export default AddIncome;
