import { Avatar, Button } from "@material-ui/core";
import {
  Box,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import axios from "axios";
import { styled } from "@mui/material/styles";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: "90%",
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  padding: 3,
  display: "flex",
  justifyContent: "center",
};
  const Input = styled("input")({
    display: "none",
  });

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function EditProfile() {
  let token = getCookie("_token");

  function getCookie(cName: any) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }
  let formData = new FormData();
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser") || "");
  const [data, setData] = useState({} as any);
  const [phone, setPhone] = useState(data.contact || "");
  const [image,setImage]=useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setUpload(true);
  };
  const handleClickClose = () => {
    setUpload(false);
  };

  function getUser() {
    axios
      .get(`http://localhost:8080/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setPhone(res.data.contact);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUser();
  }, []);

  function finalSubmit() {
   Object.keys(data).map((key: any,value:any) => {
     formData.append(`${key}`, data[key]);
     });
    axios
      .put(
        `http://localhost:8080/users/${data._id}`,
        { ...data, contact: phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => console.log(res));

  }

  return (
    <React.Fragment>
      <Button onClick={handleOpen}> Edit Profile</Button>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ height: "5%" }}>
              <Button onClick={() => handleClose()} style={{ float: "right" }}>
                <CloseIcon sx={{ color: "gray" }} />
              </Button>
              <h3 id="child-modal-title" style={{ textAlign: "center" }}>
                Profile Update{" "}
              </h3>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", padding: 1 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Avatar
                    style={{
                      height: 30,
                      width: 30,
                      border: "1px solid white",
                      padding: 2,
                      backgroundColor: "white",
                    }}
                    onClick={handleClickOpen}
                  >
                    {" "}
                    <AddAPhotoIcon sx={{ color: "#1890FF" }} />
                  </Avatar>
                }
              >
                {/* {data.profile !== "" && image!==""? (
                  <Avatar
                    style={{ height: 100, width: 100 }}
                    src={require(`../../../../nodejs-starter/src/images/${user.profile}`)}
                  />
                ) : (
                  ""
                )} */}
                <Avatar
                  style={{ height: 100, width: 100 }}
                  src={`/home/am-pc-39/Downloads/my.jpeg`}
                />
              </Badge>
              <Dialog
                open={upload}
                TransitionComponent={Transition}
                onClose={handleClickClose}
                PaperProps={{ sx: { top: -95, padding: 0.3 } }}
              >
                {/* <div
                  style={{
                    position: "absolute",
                    top: "-20%",
                    right: "10%",
                    borderLeft: "20px solid transparent",
                    borderRight: "20px solid transparent",
                    borderBottom: "50px solid red",
                  }}
                ></div> */}
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={(e: any) => {
                      // setFile(Array.from(e.target.files));
                      setImage(e.target.files[0].name);
                      formData.append("image", e.target.files[0]);
                      setUpload(false);
                    }}
                  />
                  <ListItem
                  // onClick={() => handleListItemClick(email)}
                  >
                    <ListItemAvatar>
                      <AddAPhotoOutlinedIcon />
                    </ListItemAvatar>
                    <ListItemText primary={"Upload Photo"} />
                  </ListItem>
                </label>

                <ListItem onClick={() => setUpload(false)}>
                  <ListItemAvatar>
                    <DeleteOutlineOutlinedIcon />
                  </ListItemAvatar>
                  <ListItemText primary={"Remove Photo"} />
                </ListItem>

                <ListItem
                  onClick={() => setUpload(false)}
                  sx={{ borderTop: "1px solid #D3D3D3" }}
                >
                  <ListItemAvatar>
                    <CloseIcon />
                  </ListItemAvatar>
                  <ListItemText primary={"Cancel"} />
                </ListItem>
              </Dialog>
            </Grid>
            <Grid container item>
              <TextField
                id="outlined-basic"
                value={data.name}
                label="Name"
                fullWidth
                variant="outlined"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />

              <TextField
                id="outlined-basic"
                fullWidth
                value={data.email}
                label="Email id"
                variant="outlined"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />

              <textarea
                placeholder="Enter your bio here..."
                rows={5}
                id="comment_text"
                cols={20}
                value={data.bio}
                className="ui-autocomplete-input"
                autoComplete="off"
                role="textbox"
                onChange={(e) => setData({ ...data, bio: e.target.value })}
                maxLength={2000}
                style={{
                  color: "black",
                  border: "1px solid #D3D3D3",
                  borderRadius: "5px",
                  width: "100%",
                }}
              />

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={data.gender}
                  onChange={(e) => setData({ ...data, gender: e.target.value })}
                  sx={{ padding: 2 }}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                id="date"
                label="Date of Birth"
                type="date"
                value={data.DOB}
                sx={{ width: 220 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setData({ ...data, DOB: e.target.value })}
              />
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#1890FF", color: "white" }}
                fullWidth
                onClick={finalSubmit}
              >
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default EditProfile;
