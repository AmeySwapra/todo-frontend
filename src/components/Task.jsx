import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  useDisclosure,
  useToast,
  IconButton,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import Pagination from './Pagination';

const Task = () => {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentListId, setCurrentListId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // Responsive values for different screen sizes
  const textSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const boxPadding = useBreakpointValue({ base: 2, md: 4 });
  const borderSize = useBreakpointValue({ base: '1px', md: '2px' });

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 4; 

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await axiosInstance.get('/lists');
      setLists(response.data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const createNewList = async () => {
    try {
      const newList = { title, description, todos: [] };
      const response = await axiosInstance.post('/lists', newList);
      setLists([...lists, response.data]);
      onClose();
      setTitle('');
      setDescription('');
      toast({
        title: 'List created.',
        description: 'Your new list has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error creating new list:', error);
      toast({
        title: 'Error.',
        description: 'There was an error creating your list.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const deleteList = async (id) => {
    try {
      await axiosInstance.delete(`/lists/${id}`);
      setLists(lists.filter((list) => list.id !== id));
      toast({
        title: 'List deleted.',
        description: 'The list has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: 'Error.',
        description: 'There was an error deleting your list.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const viewList = (id) => {
    navigate(`/list/${id}`);
  };

  const editList = (list) => {
    setTitle(list.title);
    setDescription(list.description);
    setCurrentListId(list.id);
    onEditOpen();
  };

  const updateList = async () => {
    try {
      const updatedList = { title, description, todos: lists.find(list => list.id === currentListId).todos };
      await axiosInstance.put(`/lists/${currentListId}`, updatedList);
      setLists(
        lists.map((list) =>
          list.id === currentListId ? { ...list, title, description } : list
        )
      );
      onEditClose();
      setTitle('');
      setDescription('');
      setCurrentListId(null);
      toast({
        title: 'List updated.',
        description: 'The list has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error updating list:', error);
      toast({
        title: 'Error.',
        description: 'There was an error updating your list.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const totalPages = Math.ceil(lists.length / itemsPerPage); 

  const paginatedLists = lists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box p={6}>
      <HStack justifyContent="space-between" mb={4}>
        <Heading as="h1" size={textSize} textAlign="center" flex="1">
          Todo Application
        </Heading>
        <Button colorScheme="blue" onClick={onOpen} size="sm">
          Make New List
        </Button>
      </HStack>

      {paginatedLists.length === 0 ? (
        <VStack>
          <Text fontSize={textSize}>No lists available. Create a new one!</Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {paginatedLists.map((list) => (
            <Box
              key={list.id}
              p={boxPadding}
              borderWidth={borderSize}
              borderRadius="md"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize={textSize}>{list.title}</Text>
              <HStack spacing={4}>
                <IconButton
                  icon={<ViewIcon />}
                  onClick={() => viewList(list.id)}
                  aria-label="View List"
                  colorScheme="teal"
                  size={iconSize}
                />
                <IconButton
                  icon={<EditIcon />}
                  onClick={() => editList(list)}
                  aria-label="Edit List"
                  colorScheme="yellow"
                  size={iconSize}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => deleteList(list.id)}
                  aria-label="Delete List"
                  colorScheme="red"
                  size={iconSize}
                />
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modal for Creating New List */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New List</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size={textSize}
              />
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size={textSize}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createNewList} size={iconSize}>
              Add
            </Button>
            <Button onClick={onClose} size={iconSize}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Editing List */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit List</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size={textSize}
              />
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size={textSize}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={updateList} size={iconSize}>
              Update
            </Button>
            <Button onClick={onEditClose} size={iconSize}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Task;
