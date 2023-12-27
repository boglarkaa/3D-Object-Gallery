# Interactive 3D Object Gallery - Computer Graphics Project

This project showcases an interactive gallery featuring 3D objects within a virtual scene. Users can interact with these objects using various actions like mouse clicks, key presses, and mouse movement to manipulate perspectives.

## Technologies Used

- **JavaScript:** Handling events such as mouse clicks and key presses.
- **HTML:** Container for displaying graphics and instructions.
- **CSS:** Styling HTML elements.
- **Three.js:** Library for creating and managing 3D objects, light sources, camera, animations, interactions (e.g., mouse-object), and adding audio.

## Project Structure

1. **Initialization:** Creation of the scene, camera, and renderer with necessary specifications.
2. **Audio Integration:** Background music integration.
3. **3D Objects Creation:** Building cube, cone, sphere, and ground plane forming the scene.
4. **Light Sources:** Incorporating directional, ambient, and animated point lights.
5. **Interactions:** Utilizing raycaster to detect mouse clicks and object intersections triggering various behaviors.
6. **Audio Interaction:** Adding sound on object clicks.
7. **Perspective Animation:** Implementing perspective change through mouse movements.
8. **Stopping Animations:** Functionality to halt all animations via the "Space" key.

## Functionalities and Interactions

- **Perspective Change:** Altering scene perspective through mouse movement.
- **Cube Rotation:** Start/stop cube rotation via click.
- **Cone Scaling:** Start/stop cone scaling on click.
- **Sphere Movement:** Use arrow keys to move the sphere in different directions.
- **Stop Animations:** Pressing the "Space" key halts all ongoing animations.

## Running the Project

To run the project:

1. Navigate to the project directory.
2. Run the command `npx serve` in the command line.
