import { Box, Grid } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BookModel from "../CommentModal/BookModal";
import ViewModal from "../CommentModal/ViewModal";

function Bookmark() {
  const [books, setBooks] = useState(JSON.parse(localStorage.getItem("currentUser") || "").savedPost || "");
  const [posts, setPosts] = useState([]);
    const user = JSON.parse(localStorage.getItem("currentUser") || "");
  function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res:any;
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
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

  let token = getCookie("_token");

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

  useEffect(() => {
    getPostss();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "80%",
        display: "flex",
        justifyContent: "center",
        paddingTop: 5,
      }}
    >
      <Grid container spacing={3} sx={{width:"65%"}}>
        {posts.map((data: any, i: any) =>
          books.includes(data._id) ? (
            <Grid item xs={4} key={i}>
              <ViewModal
                data={data}
                getPostss={getPostss}
                token={token}
                savePosts={savePosts}
              />
            </Grid>
          ) : (
            ""
          )
        )}
      </Grid>
    </Box>
  );
}

export default Bookmark;
