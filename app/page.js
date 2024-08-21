"use client";
import image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Typography,
  Modal,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Roboto } from "next/font/google";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchItem, setSearchItem] = useState("");
  console.log(inventory);
  // update inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    setInventory(inventoryList);
  };

  // add item
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // delete item
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  //delete item
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity) {
        await deleteDoc(docRef);
      }
    }

    await updateInventory();
  };

  // filter inventory
  const filterInventory = inventory.filter((item) =>
    item.name.includes(searchItem.toLowerCase())
  );

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      bgColor="whitesmoke"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="whitesmoke"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
        color="success"
      >
        ADD NEW ITEM
      </Button>
      <Stack>
        <TextField
          value={searchItem}
          variant="outlined"
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Search Item..."
        />
      </Stack>
      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#e7ecef"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h3" color="#333" sx={{ fontFamily: "Roboto" }}>
            Inventory Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="400px"
          spacing={4}
          overflow="auto"
          padding={4}
        >
          {filterInventory?.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgColor="#f0f0f0"
              padding={2}
              border="1px solid #101"
              borderRadius={2}
            >
              <Typography
                variant="h3"
                color="#333"
                textAlign="center"
                sx={{ fontFamily: "Roboto", fontSize: "30px" }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography
                variant="h3"
                color="#333"
                textAlign="center"
                sx={{ fontFamily: "Roboto", fontSize: "30px" }}
              >
                Qty: {quantity}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  -
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    deleteItem(name);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
