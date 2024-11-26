const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Define the endpoint to execute Julia code
app.post('/execute', (req, res) => {
  const userCode = req.body.code;

  // Validate input
  if (!userCode) {
    return res.status(400).json({ error: 'No code provided' });
  }

  const escapedCode = userCode.replace(/(["\\$`])/g, '\\$1');

  // Construct the Docker command
  const dockerCommand = `docker run --rm julia-playground bash -c "julia -e '${escapedCode}'"`;

  // Execute the command
  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        error: `Execution failed: ${error.message}`,
        stderr: stderr,
      });
    }

    // Return the output of the execution
    res.json({ result: stdout });
  });
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});