import express from "express";
import bodyParser from "body-parser";
import methodOverride from 'method-override'; //html cannot use put and delete without this middleware.

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

let posts = [];

app.get('/', (req, res) => {
  console.log("GET / route accessed, posts:", posts);
  res.render('index', { posts });
});


app.get('/posts/new', (req, res) => {
  res.render('new');
});

app.post('/posts', (req, res) => {          //handles form submissions to create post
  const { title, content } = req.body;      //extracts title and content from form
  const id = Date.now().toString();         //creates unique id for post 
  posts.push({ id, title, content });       //pushes into posts array
  res.redirect('/');                        //redirects user to / page
});

app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);       //params thing extracts the id from url, seraches post array to find one with matching id.
  res.render('edit', { post });                               //passes the post object into edit.ejs
});

app.put('/posts/:id', (req, res) => {
  const { title, content } = req.body;                     //extracts the updated title and content
  const post = posts.find(p => p.id === req.params.id);
  post.title = title;                                      //updates title and content
  post.content = content;
  res.redirect('/');
});

app.delete('/posts/:id', (req, res) => {             //req.params.id gets id of the post to delete
  posts = posts.filter(p => p.id !== req.params.id); //deletes the target post(creates a new array with all posts except the one with matching id)
  res.redirect('/');
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
