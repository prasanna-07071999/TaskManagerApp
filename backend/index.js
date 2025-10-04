const express = require("express")
const path = require("path")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const {open} = require('sqlite')
const insertedData = require('./data')

const app = express()
app.use(cors())
app.use(express.json())


const dbPath =
  process.env.NODE_ENV === "production"
    ? path.join("/tmp", "userData.db")
    : path.join(__dirname, "db", "userData.db"); 

let db = null


async function createTables(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL UNIQUE,
            title TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL UNIQUE,
            status TEXT NOT NULL,
            due_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `)    
}


const initializeDbAndServer = async() =>{
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        await createTables(db);

        await insertedData(db);

        const PORT = process.env.PORT || 5000;

        app.listen(5000, () => {
            console.log(`Server running at http://localhost:${PORT}/`);
        })
    } catch(error){
        console.log(`DB Error: ${error.message}`)
        process.exit(1)
    }
}

initializeDbAndServer()

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "kajjehfxzcjhsdsaxdbsdhd", async (error, payload) => {
      if (error) {
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};


app.post("/signup", async (request, response) => {
    const { username, email, password } = request.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const selectUserQuery = `SELECT * FROM users WHERE username ='${username}'`;
    let passwordLength = password.length
    const dbUser = await db.get(selectUserQuery)
    
    if (dbUser === undefined){
    if(passwordLength > 6){
        const createUserQuery = `
        INSERT INTO users (username, email, password)
        VALUES('${username}', '${email}', '${hashedPassword}')`
        await db.run(createUserQuery)
        response.json({ message: "User Created Successfully" });
    } else {
        response.status(400)
        response.json({message: "Password too short"})
    }
    } else {
        response.status(400)
        response.json({message: "User Already Exists"})
    }
})

app.post("/signin", async (request, response) => {
  const { email, password } = request.body

  const selectQuery = `SELECT * FROM users WHERE email = '${email}'`
  const dbUser = await db.get(selectQuery)
  try{
    if (dbUser === undefined){
        response.status(400)
        response.send('Invalid User')
    } else {
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
        if(isPasswordMatched === true){
            const payload = {
            username: dbUser.username,
        }
        const jwtToken = jwt.sign(payload, "kajjehfxzcjhsdsaxdbsdhd")
        response.send({jwtToken})
        } else {
            response.status(401)
            response.send("Invalid Password")
        }
    } 
  } catch(error){
    return response.status(500).send('Internal Server Error');
  }
})

// Get Profile Data
app.get("/profile", authenticateToken, async (request, response) => {
    const userName = request.username
    const getUserQuery = `SELECT username, email, created_at FROM users WHERE username = '${userName}'`;
    const userData = await db.get(getUserQuery);
    response.send(userData);
});

// Update user profile
app.put("/profile", authenticateToken, async (request, response) => {
    const { username, email } = request.body;
    const originalUser = request.username
    const updateUserQuery = `
        UPDATE users
        SET username = '${username}', email = '${email}'
        WHERE username = '${originalUser}'`;
    await db.run(updateUserQuery);
    response.send("Profile Updated Successfully");
});

// Get tasks
app.get("/tasks", authenticateToken, async (request, response) => {
    const { search = "", status } = request.query;
    const params = [request.username];
    let getTaskquery = `SELECT * FROM tasks WHERE user_id = (SELECT id FROM users WHERE username = '${params}')`;
    if (search) {
        query += " AND title LIKE ?";
        params.push(`%${search}%`);
    }
    if (status) {
        query += " AND status = ?";
        params.push(status);
    }
    const tasksList = await db.all(getTaskquery);
    response.send(tasksList);
});

// Create a new task
app.post("/tasks", authenticateToken, async (request, response) => {
    const { title, description, status } = request.body;
    const originalUsername = request.username
    const getUserQuery = `SELECT id FROM users WHERE username = '${originalUsername}'`;
    const user = await db.get(getUserQuery);

    const createTaskQuery = `
        INSERT INTO tasks (user_id, title, description, status)
        VALUES (?, ?, ?, ?)`;
    await db.run(createTaskQuery, [user.id, title, description, status]);
    response.json({ message: "Task Created" });
});

// Get task by id
app.get("/tasks/:id", authenticateToken, async (request, response) => {
    const { id } = request.params;
    const user = request.username
    const userIdQuery = `SELECT id FROM users WHERE username = '${user}'`;
    const userTask = await db.get(userIdQuery);

    const taskQuery = `SELECT * FROM tasks WHERE id = '${id}' AND user_id = '${userTask.id}'`;
    const task = await db.get(taskQuery);
    if (task) {
        response.send(task);
    } else {
        response.status(404);
        response.send("Task not found")
    }
});

// Update a task
app.put("/tasks/:id", authenticateToken, async (request, response) => {
    const { id } = request.params;
    const { title, description, status } = request.body;
    const registeredUsername = request.username
    const userIdQuery = `SELECT id FROM users WHERE username = '${registeredUsername}'`;
    const user = await db.get(userIdQuery);

    const updateTaskQuery = `
        UPDATE tasks
        SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`;
    await db.run(updateTaskQuery, [title, description, status, id, user.id]);
    response.send("Task Updated");
});

// Delete a task
app.delete("/tasks/:id", authenticateToken, async (request, response) => {
  const { id } = request.params;
  const registeredUsername = request.username

  const userIdQuery = `SELECT id FROM users WHERE username = '${registeredUsername}'`;
  const user = await db.get(userIdQuery);

  const deleteTaskQuery = `DELETE FROM tasks WHERE id = '${id}' AND user_id = '${user.id}'`;
  await db.run(deleteTaskQuery);
  response.send("Task Deleted");
});
