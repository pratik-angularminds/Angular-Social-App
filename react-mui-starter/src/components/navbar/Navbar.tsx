import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Logout, UploadFile, Visibility } from "@mui/icons-material";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import {
  Button,
  CardHeader,
  CardMedia,
  Grid,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Menu,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import history from "../../routes/history";
import { useLocation } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import CollectionsIcon from "@mui/icons-material/Collections";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ImageUploading from "react-images-uploading";
import Avatar from "@mui/material/Avatar";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LockResetIcon from "@mui/icons-material/LockReset";
import InputEmoji from "react-input-emoji";
import Picker from "emoji-picker-react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import axios from "axios";
import { ChangeEvent } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ProgressBar from "@ramonak/react-progress-bar";
import EditProfile from "./EditProfile";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "42%",
  height: "85%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  outline: "none",
};
const style_list = {
  position: "absolute" as "absolute",
  top: "20%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: "16%",
  height: "22%",
  bgcolor: "background.paper",
  borderRadius: 2,
  outline: "none",
};
const style1 = {
  position: "absolute" as "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "22%",
  bgcolor: "rgba(0, 0, 0,0.6)",
  boxShadow: 24,
  borderRadius: 2,
  outline: "none",
};
const Createpost = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "80%",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  outline: "none",
};
export type NavbarProps = {
  onLogout?: any;
};

export const Navbar = ({ onLogout }: NavbarProps) => {
  const [id, setId] = useState(true);
   let formData = new FormData();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const emoji = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloses = () => {
    setAnchorEl(null);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open1, setOpen1] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("currentUser") || "");
  const handleOpen1 = () => setOpen1(!open1);
  const handleClose1 = () => setOpen1(false);
  const [list, setList] = React.useState(false);
  const handleOpenList = () => setList(true);
  const handleCloseList = () => setList(false);
  const [limit, setLimit] = useState(0);
  const [file, setFile] = useState([] as any);
  const [images, setImages] = useState([] as any);
  const [stage, setStage] = useState(0);
  const [text, setText] = useState("");

  const [chosenEmoji, setChosenEmoji] = useState("");
const [progress,setProgress]=useState(1);
  const onEmojiClick = (event, emojiObject) => {
    if (chosenEmoji.length < 2000)
    setChosenEmoji(chosenEmoji + emojiObject.emoji);
  };
 
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue
  } = usePlacesAutocomplete();
  
  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);

    setId(true);
  };

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

  const handleSelect = (val: string): void => {
    setValue(val, false);
  };

  const renderSuggestions = (): JSX.Element => {
  
    console.log(data)
    const suggestions = data.map(({ place_id, terms, description }: any) => (
      <ListItem
        key={place_id}
        alignItems="flex-start"
        onClick={() =>{ setValue(description)
          setText(terms[0].value)
          setId(false)
        }}
        className="lists"
      >
        <ListItemText
          primary={terms[0] && terms[0].value}
          secondary={
            <React.Fragment>{terms[1] && terms[1].value}</React.Fragment>
          }
        />
      </ListItem>
    ));
    return <>{suggestions}</>;
  };

  const Input = styled("input")({
    display: "none",
  });


  function stringToColor(string: any) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }
  function stringAvatar(name: any) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split("")[0]}${name.split("")[1]}`,
    };
  }
  const location = useLocation();
  function HomeIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }
function progressBar(){
  for(let i=1;i<=100;i++)
  {
    setTimeout(() => {
      setProgress(i)
    }, 1000);
  }
  setTimeout(() => {
    setFile("");
    setStage(0)
    setChosenEmoji("");
    setValue("");
    setProgress(0)
   setOpen(false);
  }, 2500);
}

  function headers() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ padding: 10, paddingLeft: 20 }}>
          {stage !== 2 ? <ArrowBackIcon /> : ""}
        </div>
        <div style={{ padding: 5, paddingRight: 10 }}>
          {stage === 2 ? (
            <Button onClick={() => {
                 Object.values(file).forEach((files:any) => {
                   formData.append("image", files);
                 });
                formData.append("title", chosenEmoji);
                formData.append("userId",user._id);
                formData.append("userName", user.name);
                formData.append("location", text);
                
                axios
                  .post(
                    `http://localhost:8080/posts`,formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                  .then((response) => console.log(response));
              setStage(stage + 1)
              progressBar()
            }}>
              <b>Upload</b>
            </Button>
          ) : (
            <Button onClick={() => setStage(stage + 1)}>
              <b>next</b>
            </Button>
          )}
        </div>{" "}
      </div>
    );
  }

  return (
    <AppBar position="static" style={{ background: "#ffffff", color: "black" }}>
      <Toolbar variant="dense">
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Typography
              component="div"
              style={{ flex: 1, float: "right", paddingTop: "13px" }}
            >
              <img src={require("../../assets/amframe.png")} />
            </Typography>
          </Grid>
          <Grid item xs={4}></Grid>

          <Grid item xs={2}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div>
                {location.pathname === "/home" ? (
                  <HomeIcon
                    sx={{ fontSize: 30, padding: 1 }}
                    onClick={() => {
                      history.push("/home");
                      window.location.reload();
                    }}
                  />
                ) : (
                  <HomeOutlinedIcon
                    sx={{ fontSize: 30, padding: 1 }}
                    onClick={() => {
                      history.push("/home");
                      window.location.reload();
                    }}
                  />
                )}
              </div>
              <div>
                <AddAPhotoOutlinedIcon
                  sx={{
                    padding: 1,
                    paddingTop: "10px",
                    paddingLeft: "30px",
                    fontSize: 26,
                  }}
                  onClick={handleOpen}
                />
                {/* <Button>Open modal</Button> */}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <>
                    {stage === 0 || stage === 3 ? (
                      <Box sx={style}>
                        <Grid
                          container
                          spacing={9}
                          sx={{ textAlign: "center" }}
                        >
                          <Grid item xs={12} sx={{ marginTop: 10 }}>
                            <img src={require(`../../assets/bro.png`)} />
                          </Grid>
                          <Grid item xs={12} sx={{ marginTop: -4 }}>
                            <Typography
                              variant="subtitle1"
                              gutterBottom
                              component="div"
                              sx={{ color: "#919EAB" }}
                            >
                              Drag photo from device to upload
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sx={{ marginTop: "10%" }}>
                            {stage === 0 ? (
                              <label htmlFor="contained-button-file">
                                <Input
                                  accept="image/*"
                                  id="contained-button-file"
                                  multiple
                                  type="file"
                                  onChange={(e: any) => {
                                    setFile(Array.from(e.target.files));
                                    setImages(e.target.files);
                                    setStage(stage + 1);
                                  }}
                                />

                                <Button
                                  variant="contained"
                                  component="span"
                                  sx={{ bgcolor: "#1890FF", padding: "12px" }}
                                >
                                  <b>Upload from device</b>
                                </Button>
                              </label>
                            ) : stage === 3 ? (
                              <ProgressBar
                                completed={progress}
                                ariaValuemin={0}
                                ariaValuemax={100}
                              />
                            ) : (
                              ""
                            )}
                          </Grid>
                        </Grid>
                      </Box>
                    ) : stage === 1 ? (
                      <Box sx={style}>
                        {headers()}
                        <Slide
                          infinite={false}
                          autoplay={false}
                        >
                          {file.map((img: any, i) => (
                            <CardMedia
                              key={i}
                              component="img"
                              height="609"
                              image={URL.createObjectURL(img)}
                              sx={{
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                              }}
                            />
                          ))}
                        </Slide>
                        <Avatar
                          sx={{
                            float: "right",
                            position: "absolute",
                            bottom: "8%",
                            right: "10%",
                          }}
                          onClick={handleOpen1}
                        >
                          <CollectionsIcon />
                        </Avatar>
                        {open1 ? (
                          <Box sx={style1}>
                            <Grid
                              container
                              spacing={2}
                              sx={{ padding: "0px 10px 10px 10px" }}
                            >
                              {file
                                .slice(limit, limit + 4)
                                .map((files: any, i: any) => (
                                  <Grid
                                    item
                                    xs={3}
                                    key={i}
                                    sx={{ marginTop: -1 }}
                                  >
                                    <CancelIcon
                                      sx={{
                                        float: "right",
                                        position: "relative",
                                        top: "20%",
                                        right: 0,
                                        color: "#525252",
                                      }}
                                      onClick={() => {
                                        file.splice(i + limit, 1);
                                        setFile([...file]);
                                      }}
                                    />
                                    <CardMedia
                                      component="img"
                                      height="120"
                                      image={URL.createObjectURL(files)}
                                    />
                                  </Grid>
                                ))}
                              {console.log(file.length, limit)}
                              {file.length + 1 - 4 < limit ||
                              file.length < limit ||
                              file.length - limit < 4 ? (
                                <Grid item xs={3} sx={{ marginTop: "8%" }}>
                                  <label
                                    htmlFor="contained-button-file"
                                    style={{
                                      padding: "40%",
                                      backgroundColor: "white",
                                    }}
                                  >
                                    <Input
                                      accept="image/*"
                                      id="contained-button-file"
                                      multiple
                                      type="file"
                                      onChange={(e: any) => {
                                        setFile([
                                          ...file,
                                          ...Array.from(e.target.files),
                                        ]);
                                        setImages(images.push(e.target.files));
                                      }}
                                    />
                                    <AddAPhotoIcon
                                      fontSize="large"
                                      sx={{ color: "gray" }}
                                    />
                                  </label>
                                </Grid>
                              ) : (
                                ""
                              )}
                            </Grid>
                            {limit > 0 ? (
                              <ArrowCircleLeftIcon
                                sx={{
                                  color: "white",
                                  position: "absolute",
                                  left: 10,
                                  top: "40%",
                                }}
                                onClick={() => {
                                  if (limit > 0) setLimit(limit - 4);
                                }}
                              />
                            ) : (
                              ""
                            )}
                            {file.length + 1 - 4 > limit ? (
                              <ArrowCircleRightIcon
                                sx={{
                                  color: "white",
                                  position: "absolute",
                                  right: 10,
                                  top: "40%",
                                }}
                                onClick={() => {
                                  if (file.length + 1 - 4 > limit)
                                    setLimit(limit + 4);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </Box>
                        ) : (
                          ""
                        )}
                      </Box>
                    ) : stage === 2 ? (
                      <Box sx={Createpost}>
                        {headers()}
                        <Grid container>
                          <Grid item xs={7}>
                            <Slide infinite={false} autoplay={false}>
                              {file.map((img: any, i) => (
                                <CardMedia
                                  key={i}
                                  component="img"
                                  height="571"
                                  image={URL.createObjectURL(img)}
                                  sx={{
                                    borderBottomLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                  }}
                                />
                              ))}
                            </Slide>
                          </Grid>
                          <Grid item xs={5}>
                            <CardHeader
                              avatar={
                                user.profile !== "" ? (
                                  <Avatar
                                    src={require(`../../../../nodejs-starter/src/images/${user.profile}`)}
                                  />
                                ) : (
                                  <Avatar {...stringAvatar(user.name)} />
                                )
                              }
                              title={
                                <div
                                  style={{
                                    fontSize: 16,
                                    fontFamily: "Public Sans",
                                  }}
                                >
                                  {user.name}
                                </div>
                              }
                              sx={{ padding: 1 }}
                            />

                            <textarea
                              placeholder="Write a caption..."
                              rows={50}
                              id="comment_text"
                              value={chosenEmoji}
                              cols={20}
                              className="ui-autocomplete-input"
                              autoComplete="off"
                              role="textbox"
                              onChange={(e) => {
                                // if(chosenEmoji.length<2000 || e.target.value.length<2000)
                                setChosenEmoji(e.target.value);
                              }}
                              maxLength={2000}
                              style={{ color: "black" }}
                            ></textarea>
                            <Grid
                              container
                              xs={12}
                              sx={{
                                padding: 1,
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #D3D3D3",
                              }}
                            >
                              <div>
                                <Button
                                  id="basic-button"
                                  aria-controls={
                                    emoji ? "basic-menu" : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={emoji ? "true" : undefined}
                                  onClick={handleClick}
                                >
                                  <SentimentSatisfiedAltIcon
                                    sx={{ color: "gray" }}
                                  />
                                </Button>
                                <Menu
                                  id="basic-menu"
                                  anchorEl={anchorEl}
                                  open={emoji}
                                  onClose={handleCloses}
                                  MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                  }}
                                >
                                  <Picker onEmojiClick={onEmojiClick} />
                                </Menu>
                              </div>
                              <div style={{ color: "gray", padding: 10 }}>
                                {chosenEmoji.length + "/2000"}
                              </div>
                            </Grid>
                            <Grid
                              container
                              xs={12}
                              sx={{
                                padding: 1,
                                display: "flex",
                                justifyContent: "center",
                                borderBottom: "1px solid #D3D3D3",
                              }}
                            >
                              <TextField
                                id="input-with-icon-textfield"
                                placeholder="Add Location"
                                type="search"
                                autoComplete="off"
                                variant="standard"
                                value={value}
                                onChange={handleInput}
                                InputProps={{
                                  disableUnderline: true,
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <LocationOnOutlinedIcon />
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{ fontSize: 5, width: "94%" }}
                              />
                              <div className={status && id ? "scroller" : ""}>
                                <List
                                  sx={{
                                    width: "100%",
                                    bgcolor: "background.paper",
                                  }}
                                >
                                  {status === "OK" && id && renderSuggestions()}
                                </List>
                              </div>
                            </Grid>
                            <Grid
                              container
                              xs={12}
                              sx={{
                                padding: "15px",
                                color: "gray",
                                borderBottom: "1px solid #D3D3D3",
                              }}
                            >
                              <label
                                htmlFor="contained-button-file"
                                style={{
                                  backgroundColor: "white",
                                  width: "100%",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div>Add images</div>
                                  <div>
                                    <Input
                                      accept="image/*"
                                      id="contained-button-file"
                                      multiple
                                      type="file"
                                      onChange={(e: any) => {
                                        setFile([
                                          ...file,
                                          ...Array.from(e.target.files),
                                        ]);
                                        setImages(images.push(e.target.files));
                                      }}
                                    />
                                    <AddAPhotoOutlinedIcon
                                      fontSize="medium"
                                      sx={{ color: "gray" }}
                                    />
                                  </div>
                                </div>
                              </label>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    ) : (
                      ""
                    )}
                  </>
                </Modal>
              </div>
              <div>
                {location.pathname === "/home" ? (
                  <BookmarkBorderOutlinedIcon
                    sx={{
                      padding: 1,
                      paddingTop: "10px",
                      paddingLeft: "30px",
                      fontSize: 28,
                    }}
                    onClick={() => {
                      history.push("/Bookmark");
                      window.location.reload();
                    }}
                  />
                ) : (
                  <BookmarkOutlinedIcon
                    sx={{
                      padding: 1,
                      paddingTop: "10px",
                      paddingLeft: "30px",
                      fontSize: 28,
                    }}
                    onClick={() => {
                      history.push("/Bookmark");
                      window.location.reload();
                    }}
                  />
                )}
              </div>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Box
              onClick={handleOpenList}
              sx={{ display: "flex", cursor: "pointer" }}
            >
              <CardHeader
                avatar={
                  user.profile !== "" ? (
                    <Avatar
                      src={require(`../../../../nodejs-starter/src/images/${user.profile}`)}
                    />
                  ) : (
                    <Avatar {...stringAvatar(user.name)} />
                  )
                }
                title={
                  <div style={{ fontSize: 18 }}>
                    <b>{user.name}</b>
                  </div>
                }
                sx={{ padding: 1 }}
              />
            </Box>
            <Modal
              open={list}
              onClose={handleCloseList}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style_list}>
                <div
                  style={{
                    position: "absolute",
                    top: "-5%",
                    right: "10%",
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "9px solid white",
                  }}
                ></div>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    padding: 2,
                    paddingTop: 3,
                    marginLeft: "-4%",
                    justifyContent: "center",
                    width: "110%",
                  }}
                >
                  <Grid item xs={2} sx={{ cursor: "pointer" }}>
                    <ManageAccountsIcon sx={{ color: "gray" }} />
                  </Grid>
                  <Grid item xs={9} sx={{ cursor: "pointer" }}>
                   <EditProfile/>
                  </Grid>
                  <Grid item xs={3} sx={{ padding: 1, cursor: "pointer" }}>
                    <LockResetIcon sx={{ color: "gray" }} />
                  </Grid>
                  <Grid item xs={9} sx={{ padding: 1, cursor: "pointer" }}>
                    Change Password
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{ borderTop: "1px solid #E8E8E8", cursor: "pointer" }}
                    onClick={onLogout}
                  >
                    <Logout sx={{ color: "gray" }} />
                  </Grid>
                  <Grid
                    item
                    xs={9}
                    sx={{ borderTop: "1px solid	#E8E8E8", cursor: "pointer" }}
                    onClick={onLogout}
                  >
                    Logout
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
