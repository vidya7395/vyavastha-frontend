import {
  Box,
  Paper,
  Group,
  Text,
  Divider,
  TextInput,
  Button,
  Loader,
  Title,
  ActionIcon
} from '@mantine/core';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useGetParseTransactionsMutation } from '../services/aiApi';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

const SmartInput = ({ onParse }) => {
  const [lines, setLines] = useState([{ text: '', isValid: true, error: '' }]);
  const [loading, setLoading] = useState(false);
  const [getParseTransactions] = useGetParseTransactionsMutation();
  const inputRefs = useRef([]);

  const parseLine = (line) => {
    const clean = line.trim();
    let isValid = false;
    let reason = '';

    const descAmountMatch = clean.match(/^(.+?)\s+([-+]?\d+(?:\.\d+)?)$/);
    const amountDescMatch = clean.match(/^([-+]?\d+(?:\.\d+)?)(\s+.+?)$/);

    if (descAmountMatch) {
      const desc = descAmountMatch[1]?.trim();
      isValid = desc && isNaN(desc);
      if (!isValid) reason = 'Missing or invalid description';
    } else if (amountDescMatch) {
      const desc = amountDescMatch[2]?.trim();
      isValid = desc && isNaN(desc);
      if (!isValid) reason = 'Missing or invalid description';
    } else if (clean.match(/^[-+]?\d+(\.\d+)?$/)) {
      reason = 'Missing description';
    } else {
      reason = 'No amount found';
    }

    return { isValid, error: reason };
  };

  const handleChange = (idx, newText) => {
    // Only update text while typing
    setLines((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, text: newText } : line))
    );
  };

  const handleEnter = (idx) => {
    const { isValid, error } = parseLine(lines[idx].text);

    setLines((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, isValid, error } : line))
    );

    if (lines[idx].text.trim() !== '') {
      const newLine = { text: '', isValid: true, error: '' };
      setLines((prev) => [
        ...prev.slice(0, idx + 1),
        newLine,
        ...prev.slice(idx + 1)
      ]);

      setTimeout(() => {
        if (inputRefs.current[idx + 1]) {
          inputRefs.current[idx + 1].focus();
        }
      }, 0);
    }
  };

  const handleClear = (idx) => {
    if (lines.length === 1) {
      setLines([{ text: '', isValid: true, error: '' }]);
    } else {
      setLines((prev) => prev.filter((_, i) => i !== idx));
    }
    setTimeout(() => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].focus();
      }
    }, 0);
  };

  // Replace existing handleSave with this!
  const handleSave = async () => {
    const anyErrors = lines.some(
      (l) => l.text.trim() !== '' && (!l.isValid || l.error !== '')
    );

    if (anyErrors) {
      showNotification({
        title: 'Invalid entries',
        message: 'Please fix the errors before proceeding!',
        color: 'red'
      });
      return;
    }

    const validLines = lines.filter((l) => l.isValid && l.text.trim() !== '');
    const validText = validLines.map((l) => l.text).join('\n');

    if (validText === '') {
      showNotification({
        title: 'No entries',
        message: 'Please enter valid entries to review!',
        color: 'red'
      });
      return;
    }

    try {
      setLoading(true);
      const { parsed } = await getParseTransactions(validText).unwrap();
      onParse(parsed);
      showNotification({
        title: 'Review successful',
        message: 'Your transactions have been parsed.',
        color: 'teal'
      });
      setLines([{ text: '', isValid: true, error: '' }]);
      inputRefs.current = [];
    } catch (err) {
      console.error('API error:', err);
      showNotification({
        title: 'Review failed',
        message: 'Failed to parse transactions. Please try again later.',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      radius="md"
      withBorder={false}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '75vh',
        background: '#1a1a1a',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
      }}
    >
      {loading && (
        <Box
          pos="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.5)"
          style={{ backdropFilter: 'blur(3px)', zIndex: 1000 }}
        >
          <Group justify="center" align="center" h="100%">
            <Loader size="lg" color="yellow" />
          </Group>
        </Box>
      )}

      {/* Sticky Header */}
      <Box
        p="sm"
        style={{
          position: 'sticky',
          top: 0,
          background: '#1a1a1a',
          borderBottom: '1px solid #333',
          zIndex: 10
        }}
      >
        <Title order={4} c="blue" mb="xs">
          List your transactions below, one per line.
        </Title>
      </Box>

      {/* Scrollable Area */}
      <Box p="sm" style={{ flex: 1, overflowY: 'auto' }}>
        {lines.map((line, idx) => (
          <Box key={idx} mb="sm">
            <Group spacing="xs" noWrap align="center" position="apart">
              <Group spacing="xs" noWrap align="center" style={{ flex: 1 }}>
                {/* Circle indicator */}
                <Box
                  w={8}
                  h={8}
                  style={{
                    borderRadius: '50%',
                    backgroundColor:
                      line.text.trim() === ''
                        ? '#666'
                        : line.isValid
                        ? 'teal'
                        : 'red'
                  }}
                />
                <TextInput
                  w="80%"
                  ref={(el) => (inputRefs.current[idx] = el)}
                  value={line.text}
                  onChange={(e) => handleChange(idx, e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEnter(idx);
                    }
                  }}
                  variant="unstyled"
                  placeholder={
                    idx === 0
                      ? 'e.g. 200 coffee'
                      : idx === 1
                      ? 'e.g. 5000 freelancing'
                      : idx === 2
                      ? 'e.g. 1500 electricity'
                      : 'e.g. groceries'
                  }
                  styles={{
                    input: {
                      fontSize: '16px',
                      padding: '10px 0',
                      background: 'transparent',
                      color: '#eee'
                    }
                  }}
                />
              </Group>
              <ActionIcon
                size="sm"
                color="gray"
                variant="transparent"
                onClick={() => handleClear(idx)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
            {!line.isValid && (
              <Text size="xs" c="red.4" mt="2px">
                {line.error}
              </Text>
            )}
            <Divider my="xs" />
          </Box>
        ))}
      </Box>

      {/* Sticky Footer */}
      <Box
        p="sm"
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#1a1a1a',
          borderTop: '1px solid #333',
          zIndex: 10
        }}
      >
        <Group justify="flex-end">
          <Button color="blue" variant="light" onClick={handleSave}>
            Review
          </Button>
        </Group>
      </Box>
    </Paper>
  );
};

SmartInput.propTypes = {
  onParse: PropTypes.func.isRequired
};

export default SmartInput;
