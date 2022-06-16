import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Avatar, CardHeader, Grid } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import moment from "moment";
import axios from "axios";
import InputEmoji from "react-input-emoji";
import Paper from "@mui/material/Paper";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import "./ViewModal.css";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
// import { MentionsInput, Mention } from "react-mentions";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { WindowSharp } from "@mui/icons-material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function ViewModal(props: any) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [mentions, setMentions] = useState("");
  const [mention, setMention] = useState("");
  const [commentId, setCommentId] = useState("");
  const [id, setId] = useState(-1);
  const user = JSON.parse(localStorage.getItem("currentUser") || "");
  const [expanded, setExpanded] = useState(false);
  const inputref = useRef(null);
  const handleExpandClick = (i: any) => {
    setId(i);
    setExpanded(!expanded);
  };
  function getCookie(cName: string) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res: any;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
  }

  useEffect(() => {
    let token = getCookie("_token");
    axios
      .get("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.results);
      });
  }, []);

  function stringToColor(string: string) {
    let hash = 0;
    let i: number;

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

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split("")[0]}${name.split("")[1]}`,
    };
  }
  function stringAvatar1(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        height: 30,
        width: 30,
        fontSize: 17,
      },
      children: `${name.split("")[0]}${name.split("")[1]}`,
    };
  }
  const postlikes = (i: any) => {
    console.log(user._id);
    axios
      .put(
        `http://localhost:8080/posts/likes/${user._id}`,
        { postId: i },
        {
          headers: { Authorization: `Bearer ${props.token}` },
        }
      )
      .then((res) => props.getPostss());
  };
  function handleOnEnter(t: any) {
    if (mention !== "" && mentions !== " ") {
      axios
        .post(
          `http://localhost:8080/posts/reply/${t}`,
          {
            userId: user._id,
            commentId: commentId,
            replyUserId: mentions,
            reply: mention,
          },
          {
            headers: { Authorization: `Bearer ${props.token}` },
          }
        )
        .then((res) => {
          console.log(res);
          setMentions("");
          setMention("");
          setCommentId("");
          props.getPostss();
        });
    }
      if (mention !== "" && mentions === "") {
        axios
          .post(
            `http://localhost:8080/posts/comment/${t}`,
            {
              userId: user._id,
              comment: mention,
            },
            {
              headers: { Authorization: `Bearer ${props.token}` },
            }
          )
          .then((res) => {
            console.log(res);
            setMentions("");
            setMention("");
            setCommentId("");
            props.getPostss();
          });
      }
  }
  return (
    <div>
      {props.message === "Comment" ? (
        <IconButton
          aria-label="comment"
          sx={{ color: "black" }}
          onClick={() => setOpen(true)}
        >
          <ChatBubbleOutlineOutlinedIcon />
        </IconButton>
      ) : props.message === "Comments" ? (
        <Typography
          variant="subtitle2"
          gutterBottom
          component="div"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        >
          View all {props.data.comments.length + " "}Comments
        </Typography>
      ) : (
        <Carousel showThumbs={false}>
          {props.data.image.map((img) => (
            <div onClick={() => setOpen(true)} style={{ cursor: "pointer" }} key={img}>
              <CardMedia
                component="img"
                height="350"
                width="350"
                image={require(`../../../../nodejs-starter/src/images/${img}`)}
              />
            </div>
          ))}
        </Carousel>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card
          sx={{
            position: "absolute",
            display: "flex",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1100,
            height: 600,
            bgcolor: "background.paper",
            outline: "none",
          }}
        >
          <div style={{ display: "flex", border: "none" }}>
            <Grid container>
              <Grid item xs={7}>
                <div>
                  <Carousel showThumbs={false}>
                    {props.data.image.map((img: any, i: any) => (
                      <CardMedia
                        component="img"
                        key={i}
                        height="600"
                        width="550"
                        image={require(`../../../../nodejs-starter/src/images/${img}`)}
                      />
                    ))}
                  </Carousel>
                </div>
              </Grid>
              <Grid item xs={5}>
                <div>
                  <div style={{ width: 450, height: 530, paddingLeft: 6 }}>
                    <CardHeader
                      avatar={users.map((u: any) =>
                        u._id === props.data.userId && u.profile !== "" ? (
                          <Avatar
                            src={require(`../../../../nodejs-starter/src/images/${u.profile}`)}
                            key={u._id}
                          />
                        ) : u._id === props.data.userId && u.profile === "" ? (
                          <Avatar {...stringAvatar(u.name)} key={u._id} />
                        ) : (
                          ""
                        )
                      )}
                      // action={

                      // }
                      title={props.data.userName}
                      subheader={
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>{props.data.location}</div>
                            <div style={{ float: "right" }}>
                              {moment
                                .utc(props.data.createdAt)
                                .local()
                                .startOf("seconds")
                                .fromNow()}
                            </div>
                          </div>
                        </>
                      }
                    />

                    <CardContent sx={{ padding: 0 }}>
                      <div
                        style={{
                          color: "black",
                          paddingLeft: 70,
                          fontSize: 15,
                        }}
                      >
                        {props.data.title}
                      </div>
                    </CardContent>
                    <br></br>
                    <Paper variant="outlined">
                      <div className="scroller">
                        {props.data.comments.map((cmnt: any, i: any) => (
                          <div key={cmnt._id}>
                            <CardHeader
                              avatar={users.map((u: any) =>
                                u._id === cmnt.userId && u.profile !== "" ? (
                                  <Avatar
                                    src={require(`../../../../nodejs-starter/src/images/${u.profile}`)}
                                    key={u._id}
                                  />
                                ) : u._id === cmnt.userId &&
                                  u.profile === "" ? (
                                  <Avatar
                                    {...stringAvatar(u.name)}
                                    key={u._id}
                                  />
                                ) : (
                                  ""
                                )
                              )}
                              key={cmnt._id}
                              action={
                                <>
                                  <IconButton>
                                    <FavoriteBorderOutlinedIcon
                                      fontSize="small"
                                      sx={{ color: "gray" }}
                                    />
                                  </IconButton>
                                </>
                              }
                              title={users.map((u: any) =>
                                u._id === cmnt.userId ? (
                                  <div key={u._id}>
                                    <b> {u.name}</b>
                                    <span style={{ color: "#808080" }}>
                                      {" " + cmnt.comment}
                                    </span>
                                  </div>
                                ) : (
                                  ""
                                )
                              )}
                              subheader={
                                <div
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <div style={{ float: "right" }}>
                                    {moment
                                      .utc(cmnt.createdAt)
                                      .local()
                                      .startOf("seconds")
                                      .fromNow()}
                                  </div>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <div>
                                    <Button
                                      sx={{ color: "gray", fontSize: 11 }}
                                      size="small"
                                      onClick={() => {
                                        let mname: any;
                                        users.map((data: any) =>
                                          data._id === cmnt.userId
                                            ? (mname = "@" + data.name)
                                            : ""
                                        );
                                        setMention(mname + " ");
                                        setMentions(cmnt.userId);
                                        setCommentId(cmnt._id);
                                        //  inputref.current.focus();
                                      }}
                                    >
                                      <b>Reply</b>
                                    </Button>
                                  </div>
                                </div>
                              }
                            />

                            <Typography
                              onClick={() => handleExpandClick(i)}
                              style={{
                                fontSize: 11,
                                color: "gray",
                                marginLeft: 150,
                                marginTop: -15,
                              }}
                            >
                              {cmnt.reply.length !== 0
                                ? "--" + cmnt.reply.length + " Replies"
                                : ""}
                            </Typography>
                            <Collapse
                              in={expanded && id == i}
                              timeout="auto"
                              unmountOnExit
                              style={{ marginLeft: "10%" }}
                            >
                              {cmnt.reply.map((rpl: any) => (
                                <CardHeader
                                  // style={{maxWidth:300}}
                                  avatar={users.map((u: any) =>
                                    u._id === rpl.userId && u.profile !== "" ? (
                                      <Avatar
                                        src={require(`../../../../nodejs-starter/src/images/${u.profile}`)}
                                        key={u._id}
                                        sx={{ width: 30, height: 30 }}
                                      />
                                    ) : u._id === rpl.userId &&
                                      u.profile === "" ? (
                                      <Avatar
                                        {...stringAvatar1(u.name)}
                                        // sx={{ width: 24, height: 24 }}
                                        key={u._id}
                                      />
                                    ) : (
                                      ""
                                    )
                                  )}
                                  key={rpl._id}
                                  action={
                                    <>
                                      <IconButton>
                                        <FavoriteBorderOutlinedIcon
                                          fontSize="small"
                                          sx={{ color: "gray" }}
                                        />
                                      </IconButton>
                                    </>
                                  }
                                  title={users.map((u: any) =>
                                    u._id === rpl.userId ? (
                                      <div key={u._id} style={{ fontSize: 13 }}>
                                        <b> {u.name}</b>
                                        <span style={{ color: "#808080" }}>
                                          {" " + rpl.reply}
                                        </span>
                                      </div>
                                    ) : (
                                      ""
                                    )
                                  )}
                                  subheader={
                                    <div
                                      style={{
                                        display: "flex",
                                        fontSize: 13,
                                        color: "#919EAB",
                                      }}
                                    >
                                      <div
                                        style={{
                                          float: "right",
                                          fontSize: 12,
                                          padding: 3,
                                        }}
                                      >
                                        {moment
                                          .utc(rpl.createdAt)
                                          .local()
                                          .startOf("seconds")
                                          .fromNow()}
                                      </div>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      <div>
                                        <Button
                                          sx={{
                                            color: "gray",
                                            fontSize: 10,
                                          }}
                                          size="small"
                                          onClick={() => {
                                            let mname: any;
                                            users.map((data: any) =>
                                              data._id === rpl.userId
                                                ? (mname = "@" + data.name)
                                                : ""
                                            );
                                            setMention(mname + " ");
                                            setMentions(rpl.userId);
                                            setCommentId(cmnt._id);
                                            //  inputref.current.focus();
                                          }}
                                        >
                                          <b>Reply</b>
                                        </Button>
                                      </div>
                                    </div>
                                  }
                                />
                              ))}
                            </Collapse>
                          </div>
                        ))}
                      </div>
                    </Paper>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        {!props.data.likes.includes(user._id) ? (
                          <IconButton
                            aria-label="likes"
                            sx={{ color: "black" }}
                          >
                            <FavoriteBorderOutlinedIcon
                              fontSize="medium"
                              sx={{
                                color: "black",
                                padding: "10px",
                                paddingBottom: 0,
                              }}
                              color="primary"
                              onClick={() => postlikes(props.data._id)}
                            />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="likes"
                            sx={{ color: "black" }}
                          >
                            <FavoriteIcon
                              fontSize="medium"
                              sx={{
                                color: "red",
                                padding: "10px",
                                paddingBottom: 0,
                              }}
                              onClick={() => postlikes(props.data._id)}
                            />
                          </IconButton>
                        )}
                        <div style={{ paddingLeft: "13px", fontSize: 13 }}>
                          {props.data.likes.length + " likes"}
                        </div>
                      </div>
                      <div style={{ float: "right", padding: "10px" }}>
                        <IconButton
                          aria-label="Save"
                          onClick={() => props.savePosts(props.data._id)}
                        >
                          {!user.savedPost.includes(props.data._id) ? (
                            <BookmarkBorderOutlinedIcon
                              fontSize="medium"
                              sx={{ color: "black" }}
                            />
                          ) : (
                            <BookmarkIcon
                              fontSize="medium"
                              sx={{ color: "black" }}
                            />
                          )}
                        </IconButton>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "13px",
                        fontSize: 15,
                        color: "#888888",
                      }}
                    >
                      {moment
                        .utc(props.data.createdAt)
                        .local()
                        .startOf("seconds")
                        .fromNow()}
                    </div>
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "5px",
                      paddingBottom: 0,
                    }}
                  >
                    <InputEmoji
                      value={mention}
                      onChange={setMention}
                      height="100%"
                      cleanOnEnter
                      ref={inputref}
                      // borderColor="white"
                      // onEnter={handleOnEnter}
                      placeholder="Type a message"
                    />

                    <Button
                      variant="text"
                      onClick={() => {
                        handleOnEnter(props.data._id);
                      }}
                    >
                      Post
                    </Button>
                  </Box>
                </div>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Modal>
    </div>
  );
}

export default ViewModal;
