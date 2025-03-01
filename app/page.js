'use client';

import { useState } from 'react';
import { firestore } from '../firebase';
import { Box, Typography, Modal, Stack, TextField, Button, AppBar, Toolbar, Container, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

const theme = createTheme({
  palette: {
    primary: {
      main: '#81c784', // Light green
    },
    secondary: {
      main: '#ff8a65', // Light orange
    },
    background: {
      default: '#f0f4c3', // Light yellowish green
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
    },
  },
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [page, setPage] = useState('welcome');
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const q = query(collection(firestore, 'inventory'));
    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      inventoryList.push({
        name: doc.id,
        quantity: data.quantity || 0,
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: (quantity || 0) + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: (quantity || 1) - 1 });
      }
    }
    await updateInventory();
  };

  const editItem = async (oldItem, newItem) => {
    const oldDocRef = doc(collection(firestore, 'inventory'), oldItem);
    const newDocRef = doc(collection(firestore, 'inventory'), newItem);
    const oldDocSnap = await getDoc(oldDocRef);

    if (oldDocSnap.exists()) {
      const { quantity } = oldDocSnap.data();
      await setDoc(newDocRef, { quantity });
      await deleteDoc(oldDocRef);
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInputChange = (e) => setItemName(e.target.value);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleAddItem = () => {
    addItem(itemName);
    setItemName('');
    handleClose();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      {page === 'welcome' ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="background.default"
          textAlign="center"
          style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp4763059.jpg)' }}
        >
          <Typography variant="h1" color="primary">
            Hello!
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Let&apos;s get started with our inventory items
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage('inventory')}
            sx={{ mt: 4 }}
          >
            Get Started
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" minHeight="100vh" style={{ backgroundImage: 'url(https://i.pinimg.com/originals/e9/2a/18/e92a18e197cb4d3b62dd65ee81329ed3.png)', backgroundSize: 'cover' }}> 
          <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
            <Toolbar>
              <Typography variant="h6" color="text.primary">Inventory Management</Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="md" sx={{ flexGrow: 1, mb: 4 }}>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              mt={4}
            >
              <TextField
                id="search-bar"
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
                fullWidth
                sx={{ mb: 4 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
              >
                Add New Item
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modalStyle}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Item
                  </Typography>
                  <Stack width="100%" direction="row" spacing={2}>
                    <TextField
                      id="outlined-basic"
                      label="Item"
                      variant="outlined"
                      fullWidth
                      value={itemName}
                      onChange={handleInputChange}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddItem}
                      sx={{ bgcolor: 'primary.main', color: 'text.primary' }}
                    >
                      Add
                    </Button>
                  </Stack>
                </Box>
              </Modal>
              <Box width="100%" border="1px solid #333" borderRadius={4} boxShadow={2} bgcolor="background.paper">
                <Box
                  width="100%"
                  height="100px"
                  bgcolor="primary.main"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                >
                  <Typography variant="h2" color="text.primary" textAlign="center">
                    Inventory Items
                  </Typography>
                </Box>
                <Stack
                  width="100%"
                  maxHeight="400px"
                  spacing={2}
                  overflow="auto"
                  padding={2}
                  sx={{ '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' } }}
                >
                  {filteredInventory.map(({ name, quantity }) => (
                    <Box
                      key={name}
                      width="100%"
                      minHeight="150px"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      bgcolor="#e0f7fa"
                      padding={3}
                      borderRadius={2}
                      boxShadow={1}
                      sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <Typography variant="h5" color="text.primary" textAlign="center">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Typography>
                      <Typography variant="h5" color="text.primary" textAlign="center">
                        Quantity: {quantity}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => removeItem(name)} sx={{ color: 'secondary.main' }}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const newName = prompt('Enter new item name', name);
                            if (newName) {
                              editItem(name, newName);
                            }
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Container>
          <Box
            component="footer"
            width="100%"
            py={2}
            bgcolor="primary.main"
            color="text.primary"
            display="flex"
            justifyContent="center"
            mt={4}
          >
            <Typography>&copy; {new Date().getFullYear()} Raneen Kakar</Typography>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}




