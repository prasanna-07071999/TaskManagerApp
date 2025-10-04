const bcrypt = require('bcryptjs');

async function insertedData(db) {

    const users = [
        { username: 'rahul', password: 'rahul@2025', email:'rahul2025@gmail.com' },
        { username: 'praneetha', password: 'praneetha@2025', email:'praneetha2025@gmail.com' },
        { username: 'mosh', password: 'DevMosh25', email:'mosh2025@gmail.com' },
        { username: 'robert', password: 'WilsonRobert45', email:'robert2025@gmail.com' },
        { username: 'david', password: 'the_miller@2025', email:'david2025@gmail.com' }
    ];

    const tasks = [
        {
            id: 1,
            title: "Need to complete JavaScript",
            description:
            "JavaScript is a versatile, widely-used programming language primarily for web development.It enables dynamic, interactive user interfaces in browsers and server-side with Node.js. JavaScript supports multiple programming styles including functional and object-oriented.",
            status: "Completed",
            due_date: "2025-10-05",
            user_id: 1,
            created_at: "2025-09-01",
            updated_at: "2025-09-15",
        },
        {
            id: 2,
            title: "Need to complete Python",
            description:
            "Python is a simple, readable, and powerful programming language used for web, data science, automation, and more. Its vast ecosystem supports rapid development with a focus on clear syntax and extensive libraries.",
            status: "In Progress",
            due_date: "2025-10-12",
            user_id: 2,
            created_at: "2025-09-02",
            updated_at: "2025-09-18",
        },
        {
            id: 3,
            title: "Need to complete ReactJs Project",
            description:
            "React.js is a popular JavaScript library for building reusable, component-based user interfaces. It uses a virtual DOM for efficient rendering and powers many modern, responsive single-page applications.",
            status: "In Progress",
            due_date: "2025-10-15",
            user_id: 3,
            created_at: "2025-09-03",
            updated_at: "2025-09-20",
        },
        {
            id: 4,
            title: "Need to complete Nodejs",
            description:
            "Node.js is a JavaScript runtime built on Chrome’s V8 engine that enables server-side JavaScript execution. It features an event-driven, non-blocking architecture, making it ideal for scalable web servers and APIs.",
            status: "In Progress",
            due_date: "2025-10-18",
            user_id: 1,
            created_at: "2025-09-05",
            updated_at: "2025-09-21",
        },
        {
            id: 5,
            title: "Need to complete FrontendDevelopment",
            description:
            "Frontend development involves creating the client-side part of web applications using HTML, CSS, and JavaScript frameworks. It focuses on responsive, interactive, and user-friendly interfaces across devices and browsers.",
            status: "In Progress",
            due_date: "2025-10-20",
            user_id: 2,
            created_at: "2025-09-05",
            updated_at: "2025-09-22",
        },
    ];


    try {
        for (const user of users) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        await db.run(`INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)`, [user.username, user.email, hashedPassword]);
        }

        for (const user of users){
            const userRow = await db.get(`SELECT id FROM users WHERE email = ?`, [user.email]);
            for (const task of tasks){
            
            await db.run(`
                INSERT INTO tasks (user_id, title, description, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            `, [userRow.id, task.title, task.description, task.status]
            );
        }
    }   
        console.log("Data Inserted Successfully.");
  } catch (error) {
        console.log("Error in inserting data:", error);
        throw error;
  }
}  

module.exports = insertedData