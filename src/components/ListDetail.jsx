import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Checkbox,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import axiosInstance from '../axiosInstance'; 

const ListDetail = () => {
  const { id } = useParams(); 
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchListDetail = async () => {
      try {
        const response = await axiosInstance.get(`/lists/${id}`);
        setList(response.data);
      } catch (error) {
        toast({
          title: 'Error loading list',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListDetail();
  }, [id, toast]);

  const handleAddTodo = () => {
    setIsEditing(false);
    setTodoTitle('');
    setIsCompleted(false);
    onOpen();
  };

  const handleEditTodo = (todo) => {
    setIsEditing(true);
    setCurrentTodo(todo);
    setTodoTitle(todo.title);
    setIsCompleted(todo.completed);
    onOpen();
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const updatedTodos = list.todos.filter((todo) => todo.id !== todoId);
      const updatedList = { ...list, todos: updatedTodos };

      await axiosInstance.put(`/lists/${id}`, updatedList);
      setList(updatedList);

      toast({
        title: 'Todo deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting todo',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveTodo = async () => {
    if (todoTitle.trim() === '') {
      toast({
        title: 'Title is required',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      let updatedTodos;

      if (isEditing) {
        updatedTodos = list.todos.map((todo) =>
          todo.id === currentTodo.id
            ? { ...todo, title: todoTitle, completed: isCompleted }
            : todo
        );
      } else {
        const newTodo = {
          id: `t${Date.now()}`, 
          title: todoTitle,
          completed: isCompleted,
        };
        updatedTodos = [...list.todos, newTodo];
      }

      const updatedList = { ...list, todos: updatedTodos };

      await axiosInstance.put(`/lists/${id}`, updatedList);
      setList(updatedList);

      toast({
        title: `Todo ${isEditing ? 'updated' : 'added'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: `Error ${isEditing ? 'updating' : 'adding'} todo`,
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!list) {
    return <Text>List not found</Text>;
  }

  return (
    <Box p={5}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {list.title}
      </Text>
      <VStack spacing={4} align="stretch">
        {list.todos.length === 0 ? (
          <Text>No todos are available, please add new ones.</Text>
        ) : (
          list.todos.map((todo) => (
            <HStack key={todo.id} justifyContent="space-between">
              <Text
                as={todo.completed ? 's' : 'span'}
                fontSize="lg"
                color={todo.completed ? 'gray.500' : 'black'}
              >
                {todo.title}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Edit Todo"
                  icon={<EditIcon />}
                  onClick={() => handleEditTodo(todo)}
                />
                <IconButton
                  aria-label="Delete Todo"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              </HStack>
            </HStack>
          ))
        )}
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={handleAddTodo}
        >
          Add Todo
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Todo' : 'Add Todo'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter todo title"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              mb={3}
            />
            <Checkbox
              isChecked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            >
              Completed
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSaveTodo}>
              {isEditing ? 'Save Changes' : 'Add Todo'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListDetail;







