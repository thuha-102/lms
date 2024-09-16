import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { PythonRunnerRequestDto } from './dto/pythonRunner.dto';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('pythonRunner')
export class PythonRunnerController {
  constructor() {}

  @Post()
  async runPython(@Body() body: PythonRunnerRequestDto) {
    try {
      // Copy input files from upload
      if (body.inputModelFiles) {
        body.inputModelFiles.forEach(async (fileName) => {
          await fs.copyFile(`uploads/models/${fileName}`, `input/models/${fileName}`);
        });
      }

      if (body.inputDatasetFiles) {
        body.inputDatasetFiles.forEach(async (fileName) => {
          await fs.copyFile(`../../../uploads/datasets/${fileName}`, `input/models/${fileName}`);
        });
      }

      const executeCode = body.inputTestFile
        ? `python temp.py ${'uploads/materialFiles/' + body.inputTestFile}`
        : 'python temp.py';

      // Write the user's Python code to a temporary file
      await fs.writeFile('temp.py', body.code);

      // Run code
      const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        exec(executeCode, async (error, stdout, stderr) => {
          // Delete the temporary file
          await fs.unlink('temp.py');
          if (error) {
            reject(error);
            return;
          }
          resolve({ stdout, stderr });
        });
      });

      const inputFolderExists = await fs
        .access('input')
        .then(() => true)
        .catch(() => false);
      if (inputFolderExists) {
        await fs.rm('input', { recursive: true });
        console.log('Input folder deleted.');
      }

      return JSON.stringify({ stdout: stdout, stderr: stderr });
    } catch (err) {
      throw new Error(err);
    }
  }
}
