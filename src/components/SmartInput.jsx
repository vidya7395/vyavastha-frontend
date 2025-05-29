import {
  Textarea,
  Button,
  Box,
  Title,
  Group,
  Text,
  Stack,
  Paper,
  Divider,
  ScrollArea
} from '@mantine/core';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetParseTransactionsMutation } from '../services/aiApi';

const SmartInput = ({ onParse }) => {
  const [rawText, setRawText] = useState('');
  const [touchedLines, setTouchedLines] = useState(new Set());
  const parseLine = (line, index) => {
    const clean = line.replace(/^•\s*/, '').replace(/⚠️.*$/, '').trim();
    const isTouched = touchedLines.has(index);

    let isValid = false;
    let decorated = `• ${clean}`;
    let reason = '';

    const descAmountMatch = clean.match(/^(.+?)\s+([-+]?\d+(?:\.\d+)?$)/);
    const amountDescMatch = clean.match(/^([-+]?\d+(?:\.\d+)?)(\s+.+?)$/);

    if (descAmountMatch) {
      const desc = descAmountMatch[1]?.trim();
      if (!desc || !isNaN(desc)) {
        reason = 'Missing or invalid description';
      } else {
        isValid = true;
      }
    } else if (amountDescMatch) {
      const desc = amountDescMatch[2]?.trim();
      if (!desc || !isNaN(desc)) {
        reason = 'Missing or invalid description';
      } else {
        isValid = true;
      }
    } else {
      const amountOnly = clean.match(/^[-+]?\d+(\.\d+)?$/);
      if (amountOnly) {
        reason = 'Missing description';
      } else {
        reason = 'No amount found';
      }
    }

    if (isTouched && !isValid && clean.length > 3) {
      decorated += `   ⚠️ ${reason}`;
    }

    return {
      original: line,
      clean,
      isValid,
      decorated
    };
  };

  const handleChange = (e) => {
    const newText = e.currentTarget.value;
    const oldLineCount = rawText.split('\n').length;
    const newLineCount = newText.split('\n').length;

    if (newLineCount > oldLineCount) {
      setTouchedLines((prev) => new Set([...prev, newLineCount - 2]));
    }

    setRawText(newText);
  };
  const [getParseTransactions] = useGetParseTransactionsMutation();

  const handleParse = async () => {
    const lines = rawText.split('\n');
    const entries = lines.map((line, i) => parseLine(line, i));
    const errors = entries.filter(
      (entry) => !entry.isValid && entry.clean.length > 3
    );
    const formatted = entries.map((entry) => entry.decorated).join('\n');
    setRawText(formatted);
    setTouchedLines(new Set(lines.map((_, i) => i)));

    if (errors.length > 0) return;

    try {
      const { parsed } = await getParseTransactions(formatted).unwrap();
      onParse(parsed); // optional
    } catch (err) {
      console.error('RTK parse error:', err);
    }
  };

  const parsedLines = rawText
    .split('\n')
    .map((line, index) => parseLine(line, index));

  const totalAmount = parsedLines.reduce((sum, entry) => {
    const match = entry.clean.match(/[-+]?\d+(\.\d+)?/);
    return match ? sum + parseFloat(match[0]) : sum;
  }, 0);

  const validCount = parsedLines.filter((e) => e.isValid).length;
  const invalidCount = parsedLines.filter(
    (e) => !e.isValid && e.clean.length > 3
  ).length;

  return (
    <Box mt="md" style={{ position: 'relative', paddingBottom: 70 }}>
      <Title order={2} mb="lg" ta="center">
        💡 Smart Transaction Input
      </Title>

      <Group align="start" grow wrap="wrap" spacing="xl" dir="row">
        {/* Input Area */}
        <Box style={{ flex: 1 }}>
          <Box style={{ maxHeight: 340, overflowY: 'auto' }}>
            <Textarea
              placeholder={`e.g.\n120 clothes\n12000 freelancing\nbajaj 5000`}
              value={rawText}
              onChange={handleChange}
              autosize="false"
              minRows={14}
              radius="md"
            />
          </Box>
        </Box>

        {/* Live Preview */}
        <Box style={{ flex: 1 }}>
          <Paper p="sm" radius="md" withBorder h={340} bg="gray.9">
            <Title order={5} mb="xs">
              Live Preview
            </Title>
            <Divider mb="sm" />
            <ScrollArea h={300}>
              <Stack spacing="xs">
                {parsedLines.map((entry, idx) => (
                  <Text
                    key={idx}
                    size="sm"
                    c={
                      entry.clean.length <= 2
                        ? 'gray'
                        : entry.isValid
                        ? 'teal'
                        : 'red'
                    }
                  >
                    {entry.decorated}
                  </Text>
                ))}
              </Stack>
            </ScrollArea>
          </Paper>
        </Box>
      </Group>
      <Group justify="space-between" mt="sm">
        <Text size="sm" c="dimmed">
          ✅ {validCount} valid
        </Text>
        <Text size="sm" c={invalidCount > 0 ? 'red' : 'dimmed'}>
          ⚠️ {invalidCount} invalid
        </Text>
        <Text size="sm">
          💰 Total: <strong>₹{totalAmount.toFixed(2)}</strong>
        </Text>
      </Group>
      {/* Sticky Button */}
      <Box
        pos="sticky"
        bottom={0}
        left={0}
        right={0}
        p="sm"
        style={{ zIndex: 999 }}
        mt={'xl'}
        bg={'gray.9'}
      >
        <Button
          fullWidth
          onClick={handleParse}
          disabled={invalidCount > 0}
          size="md"
        >
          🚀 Parse Transactions
        </Button>
      </Box>
    </Box>
  );
};

SmartInput.propTypes = {
  onParse: PropTypes.func.isRequired
};

export default SmartInput;
