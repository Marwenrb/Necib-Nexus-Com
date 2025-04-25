/**
 * Duplicate Package Resolution Guide
 *
 * The following packages have duplicate versions in the dependency tree:
 *
 * 1. react-is
 *    - 16.13.1 ./~/react-is
 *    - 18.2.0 ./~/next\dist\compiled\react-is
 *
 * 2. scheduler
 *    - 0.21.0 ./~/scheduler
 *    - 0.23.2 ./~/react-dom/~/scheduler
 *
 * 3. zustand
 *    - 3.7.2 ./~/@react-three\fiber/~/zustand
 *    - 4.3.6 ./~/zustand
 *    - 5.0.3 ./~/@react-three\drei/~/zustand
 *
 * To resolve duplicates, add the following to your package.json:
 *
 * "resolutions": {
 *   "react-is": "18.2.0",
 *   "scheduler": "0.23.2",
 *   "zustand": "5.0.3"
 * }
 *
 * Then run:
 * npm install
 *
 * For Yarn:
 * yarn install
 *
 * Note: You may need to use npm install --legacy-peer-deps or yarn install --ignore-engines
 * if you encounter peer dependency conflicts.
 */

console.log('Run this script to see instructions for fixing duplicate packages')
console.log(
  'Add the resolutions field to package.json and reinstall dependencies'
)
