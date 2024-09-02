import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import ListDetail from './components/ListDetail'; // Ensure correct path
import Task from './components/Task';

const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <Box p={4}>
          <Routes>
            <Route path="/" element={<Task />} />
            <Route path="/list/:id" element={<ListDetail />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
