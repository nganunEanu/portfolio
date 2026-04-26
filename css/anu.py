import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

# Generate 16 vertices of a tesseract in 4D space
def generate_tesseract():
    vertices = []
    for i in range(16):
        x = -1 if (i & 1) == 0 else 1
        y = -1 if (i & 2) == 0 else 1
        z = -1 if (i & 4) == 0 else 1
        w = -1 if (i & 8) == 0 else 1
        vertices.append([x, y, z, w])
    return np.array(vertices)

# 4D to 3D projection with continuous rotation
def project_4d_to_3d(vertices, frame):
    """ Rotates in 4D space continuously and loops perfectly """
    angle = (frame * np.pi / 100) % (2 * np.pi)  # Smooth continuous rotation

    # 4D Rotation Matrices (XY, XZ, XW)
    rotation_xy = np.array([
        [np.cos(angle), -np.sin(angle), 0, 0],
        [np.sin(angle), np.cos(angle), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ])
    
    rotation_xw = np.array([
        [np.cos(angle / 2), 0, 0, -np.sin(angle / 2)],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [np.sin(angle / 2), 0, 0, np.cos(angle / 2)]
    ])

    # Apply 4D Rotations
    rotated_vertices = vertices @ rotation_xy.T @ rotation_xw.T

    # Controlled perspective projection to prevent extreme scaling
    w_factor = 2 + rotated_vertices[:, 3]
    w_factor = np.clip(w_factor, 1.5, 3)  # Keep projection stable
    projected_vertices = rotated_vertices[:, :3] / w_factor[:, np.newaxis]
    return projected_vertices

# Define edges of the tesseract
edges = []
for i in range(16):
    for j in range(i + 1, 16):
        if bin(i ^ j).count('1') == 1:
            edges.append((i, j))

# Setup Matplotlib 3D figure
fig = plt.figure(figsize=(6, 6))
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim([-1, 1])
ax.set_ylim([-1, 1])
ax.set_zlim([-1, 1])
ax.set_facecolor("black")

# Store line objects
lines = [ax.plot([], [], [], 'cyan')[0] for _ in edges]

# Animation function
def update(frame):
    projected_vertices = project_4d_to_3d(generate_tesseract(), frame)
    
    for line, (i, j) in zip(lines, edges):
        xdata = [projected_vertices[i, 0], projected_vertices[j, 0]]
        ydata = [projected_vertices[i, 1], projected_vertices[j, 1]]
        zdata = [projected_vertices[i, 2], projected_vertices[j, 2]]
        line.set_data(xdata, ydata)
        line.set_3d_properties(zdata)

    return lines

# Run animation with 200 frames (perfect looping cycle)
ani = animation.FuncAnimation(fig, update, frames=200, interval=30, blit=False)
plt.show()
