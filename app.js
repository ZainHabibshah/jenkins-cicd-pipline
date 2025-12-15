const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>CI/CD Pipeline Demo</h1>
        <p>This is a simple demo of a CI/CD pipeline.</p>
        <ul>
          <li><a href="/bubble">Bubble Sort</a></li>
          <li><a href="/selection">Selection Sort</a></li>
    `);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`); 
    })
});