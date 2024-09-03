import React from 'react';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <HStack spacing={2} justifyContent="center" mt={4}>
      <IconButton
        aria-label="Previous Page"
        icon={<ArrowLeftIcon />}
        isDisabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
      <IconButton
        aria-label="Next Page"
        icon={<ArrowRightIcon />}
        isDisabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </HStack>
  );
};

export default Pagination;
