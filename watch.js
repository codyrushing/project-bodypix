require('dotenv').config();
const globby = require('globby');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const { SSH_USER, SSH_HOST, TARGET_PROJECT_ROOT } = process.env;

(async () => {
	const paths = await globby('**/*.py');
  for(const source of paths){
		const target = path.dirname(
			path.join(
				TARGET_PROJECT_ROOT,
				path.relative(
					__dirname,
					source
				)
			)
		);
    fs.watch(source, function onFileChanged(event){
			const scpProcess = spawn('scp', [source, `${SSH_USER}@${SSH_HOST}:${target}`]);
			
			scpProcess
				.on('error', function onSCPError(err){
					console.error(err);
				})
				.on('exit', function onSCPExit(code){
					if(code){
						console.log(`Exit with code ${code}`);
					}
					else {
						console.log(`[${event}] Deployed ${source} to ${SSH_HOST} successfully`);
					}
				});

			scpProcess.stdout.on('data', (data) => console.log(data.toString()));
			scpProcess.stderr.on('data', (data) => console.error(data.toString()));

		});
  }
	console.log(`Watching ${paths.length} files for changes`);
})();