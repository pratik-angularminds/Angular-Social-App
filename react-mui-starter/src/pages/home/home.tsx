import React, { useEffect, useState, useRef } from "react";
import "./home.scss";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InputEmoji from "react-input-emoji";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import axios from "axios";
import moment from "moment";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Button, Grid, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ViewModal from "../CommentModal/ViewModal";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { MentionsInput, Mention } from "react-mentions";

export default function Login() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const [mention, setMention] = useState("");
  const [umention, setUmention] = useState([]);

  const [id, setId] = useState(-1);
  const user = JSON.parse(localStorage.getItem("currentUser") || "");
  let token = getCookie("_token");

  const [text, setText] = useState("");

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

  function getPostss() {
    axios
      .get("http://localhost:8080/posts?sortBy=_id:desc", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPosts(res.data.results);
        console.log(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const postlikes = (i: any) => {
    console.log(user._id);
    axios
      .put(
        `http://localhost:8080/posts/likes/${user._id}`,
        { postId: i },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => getPostss());
  };

  useEffect(() => {
    getPostss();
    axios
      .get("http://localhost:8080/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(
          res.data.results.map((data: any) => {
            return { ...data, display: data.firstName };
          })
        );
        setUmention(
          res.data.results.map((data: any) => {
            return {
              id: data.firstName + data.lastName,
              display: data.firstName,
            };
          })
        );
        console.log(res.data.results);
      });
  }, []);

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
  function savePosts(postid: any) {
    axios
      .put(
        `http://localhost:8080/users/savePost/${user._id}`,
        { postId: postid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res) {
          localStorage.setItem("currentUser", JSON.stringify(res.data));
          getPostss();
        }
      });
  }

  function handleOnEnter(t: any) {
    if (text !== "" && text !== " ") {
      axios
        .post(
          `http://localhost:8080/posts/comment/${t}`,
          {
            userId: user._id,
            comment: text,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          console.log(res);
          setText("");
          getPostss();
        });
      console.log(text);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, marginTop: 0 }}>
        {posts.map((data: any, i) => (
          <Card sx={{ maxWidth: 600, marginTop: 3 }} key={i}>
            <CardHeader
              avatar={users.map((u: any) =>
                u._id === data.userId && u.profile !== "" ? (
                  <Avatar
                    src={require(`../../../../nodejs-starter/src/images/${u.profile}`)}
                    key={u._id}
                  />
                ) : u._id === data.userId && u.profile === "" ? (
                  <Avatar {...stringAvatar(u.name)} key={u._id} />
                ) : (
                  ""
                )
              )}
              // action={
              //   <IconButton aria-label="settings">
              //     <MoreVertIcon />
              //   </IconButton>
              // }
              title={users.map((u: any) =>
                u._id === data.userId ? (
                  <div key={u._id}>
                    <b> {u.name}</b>
                  </div>
                ) : (
                  <div key={u._id}></div>
                )
              )}
              subheader={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{data.location}</div>
                  <div style={{ float: "right" }}>
                    {moment
                      .utc(data.createdAt)
                      .local()
                      .startOf("seconds")
                      .fromNow()}
                  </div>
                </div>
              }
            />
            {data.image.length === 1 ? (
              <CardMedia
                component="img"
                height="500"
                width="600"
                image={require(`../../../../nodejs-starter/src/images/${data.image[0]}`)}
              />
            ) : (
              <Carousel showThumbs={false}>
                {data.image.map((img: any, i) => (
                  <CardMedia
                    key={i}
                    component="img"
                    height="500"
                    width="600"
                    image={require(`../../../../nodejs-starter/src/images/${img}`)}
                  />
                ))}
              </Carousel>
            )}
            <CardActions>
              {!data.likes.includes(user._id) ? (
                <IconButton
                  aria-label="likes"
                  sx={{ color: "black" }}
                  onClick={() => postlikes(data._id)}
                >
                  <FavoriteBorderOutlinedIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="likes"
                  sx={{ color: "black" }}
                  onClick={() => postlikes(data._id)}
                >
                  <FavoriteIcon
                    sx={{ color: "red" }}
                    onClick={() => postlikes(data._id)}
                  />
                </IconButton>
              )}
             
                <ViewModal
                  data={data}
                  message="Comment"
                  getPostss={getPostss}
                  token={token}
                  savePosts={savePosts}
                  text={text}
                  setText={setText}
                  handleOnEnter={handleOnEnter}
                />
            
              <div
                style={{ marginLeft: 400 }}
                onClick={() => savePosts(data._id)}
              >
                <IconButton aria-label="Save">
                  {!user.savedPost.includes(data._id) ? (
                    <BookmarkBorderOutlinedIcon sx={{ color: "black" }} />
                  ) : (
                    <BookmarkIcon sx={{ color: "black" }} />
                  )}
                </IconButton>
              </div>
            </CardActions>

            <CardContent>
              {data.title !== "" ? (
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  component="div"
                  sx={{ fontSize: 15 }}
                >
                  <b>
                    {users.map((u: any) =>
                      u._id === data.userId ? (
                        <div key={u._id}>
                          <b>{u.name}</b>
                          {" - " + data.title}
                        </div>
                      ) : (
                        <div key={u._id}></div>
                      )
                    )}
                  </b>
                </Typography>
              ) : (
                ""
              )}
              
              {data.comments.length !== 0 ? (
                <ViewModal
                  data={data}
                  message="Comments"
                  getPostss={getPostss}
                  token={token}
                  savePosts={savePosts}
                  text={text}
                  setText={setText}
                  handleOnEnter={handleOnEnter}
                />
                ) : (
                  ""
                  )}
              <Typography variant="caption" display="block" gutterBottom>
                {moment
                  .utc(data.createdAt)
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              </Typography>
            </CardContent>
            {/* <MentionsInput
              value={mention}
              onChange={(e) => setMention(e.target.value)}
              disabled={true}
            >
              <Mention
                trigger="@"
                data={(search: any) =>
                  umention.filter((u: any) => u.id.includes(search))
                }
                renderSuggestion={renderSuggestion}
                onAdd={onAdd}
                appendSpaceOnAdd={true}
              />
            </MentionsInput> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px",
                borderTop: "1px solid #DCDCDC",
              }}
            >
              <InputEmoji
                value={text}
                onChange={setText}
                height="100%"
                cleanOnEnter
                // borderColor="white"
                // onEnter={handleOnEnter}
                placeholder="Type a message"
              ></InputEmoji>

              <Button variant="text" onClick={() => handleOnEnter(data._id)}>
                Post
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
