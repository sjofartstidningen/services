const fs = require('fs');
const { join } = require('path');
const execa = require('execa');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

async function run() {
  try {
    const projects = await readdir(join(__dirname, '../services'));
    await Promise.all(
      projects.map(project =>
        execa('cross-env', [`PROJECT=${project}`, 'backpack', 'build']),
      ),
    );
  } catch (error) {
    console.error(error.message);
  }
}

run();
