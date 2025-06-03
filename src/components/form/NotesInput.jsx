import { Flex, Text, Textarea } from '@mantine/core';
import PropTypes from 'prop-types';

const NotesInput = ({ register, error }) => {
  return (
    <Flex gap="sm" direction="column">
      <Text size="md" mb={0}>
        Notes
      </Text>
      <Textarea
        variant="default"
        size="sm"
        {...register('description')}
        placeholder="Add Notes"
        error={error}
      />
    </Flex>
  );
};

NotesInput.propTypes = {
  register: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default NotesInput;
