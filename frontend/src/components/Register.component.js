import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
const Register = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(null);
  const [number, setNumber] = useState("");
  const [age, setAge] = useState("");
  const [batch, setBatch] = useState('');
  const [vendor, setType] = useState("false");
  const [shop_name, setShop] = useState("");
  const [open_timings, setOpen] = useState("");
  const [close_timings, setClose] = useState("");
const BuyerInput = (props) => {
    if (props.vendor === "false") {
        return (
            <Grid item xs={12}>
            {props.children}
            </Grid>
        );
    }
    else return null;
}
const VendorInput = (props) => {
    if (props.vendor === "true") {
        return (
            <Grid item xs={12}>
            {props.children}
            </Grid>
        );
    }
    else return null;
}

  const onChangeUsername = (event) => {
    setName(event.target.value);
  };
  
  const onChangeOpen = (event) => {
    setOpen(event.target.value);
  };
  const onChangeClose = (event) => {
    setClose(event.target.value);
  };

  const onChangeType = (event) => {
    setType(event.target.value);
    console.log(vendor);
  };
  const onChangeShop = (event) => {
    setShop(event.target.value);
  };
  const onChangeNumber = (event) => {
    setNumber(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
  };
  
  const onChangeBatch = (event) => {
      setBatch(event.target.value);
  };
  const resetInputs = () => {
    setName("");
    setEmail("");
    setNumber("");
    setAge("");
    setBatch("");
    setDate(null);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (vendor) {
        const newUser = {
        name: name,
        email: email,
        contact_number: number,
        age: age,
        batch_name: batch,
        wallet: 0,
        date: Date.now(),
        };

        axios
        .post("http://localhost:5000/buyer/register", newUser)
        .then((response) => {
            alert("Created Buyer");
            console.log(response.data);
        });
    }
    else {
        const newVendor = {
            manager_name: name,
            shop_name: shop_name,
            email: email,
            contact_number: number,
            canteen_timings: [open_timings, close_timings],
            order_stats: [0,0,0]
        };
        axios
        .post("http://localhost:5000/vendor/register", newVendor)
        .then((response) => {
            alert("Created Vendor");
            console.log(response.data);
        });
    }
    resetInputs();
  };
  return (
    <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
    minWidth="200vh"
    sx={{width:200}}
    >
    <Grid container align={"center"} spacing={4}>
      <Grid item xs={12}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={onChangeUsername}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <BuyerInput vendor={vendor}>
        <TextField
          label="Contact Number"
          variant="outlined"
          value={number}
          onChange={onChangeNumber}
        />
       </BuyerInput>
      <BuyerInput vendor={vendor}>
        <TextField
          label="Age"
          variant="outlined"
          value={age}
          onChange={onChangeAge}
        />
      </BuyerInput>
      <BuyerInput vendor={vendor}>
        
        <FormControl required fullWidth>
        <InputLabel id="demo-simple-select-label">Batch</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={batch}
            label="Batch"
            onChange={onChangeBatch}
            
        >
            <MenuItem value="UG1">UG1</MenuItem>
            <MenuItem value="UG2">UG2</MenuItem>
            <MenuItem value="UG3">UG3</MenuItem>
            <MenuItem value="UG4">UG4</MenuItem>
            <MenuItem value="UG5">UG5</MenuItem>
        </Select>
        </FormControl>
      </BuyerInput>
      <VendorInput vendor={vendor}>
        <TextField
          label="Shop Name"
          variant="outlined"
          value={shop_name}
          onChange={onChangeShop}
        />
      </VendorInput>
      <Grid item xs={12}>
      <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
        <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={vendor}
            onChange={onChangeType}
        >
            <FormControlLabel value={false} control={<Radio />} label="Buyer" />
            <FormControlLabel value={true} control={<Radio />} label="Vendor" />
        </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Register
        </Button>
      </Grid>
    </Grid>
    </Box>
  );
};

export default Register;