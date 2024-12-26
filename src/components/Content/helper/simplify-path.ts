export function simplifyQuadraticPath(pathData) {
  const commands = pathData.match(/[MLQZ][^MLQZ]*/gi); // Split path into commands
  if (!commands) return "";

  const coordinates = []; // Array to store coordinates
  let currentPoint = [0, 0];
  let lastCosine = null; // To store the cosine of the last segment

  const calculateCosine = (v1, v2) => {
    const dotProduct = v1[0] * v2[0] + v1[1] * v2[1];
    const magnitude1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
    const magnitude2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);
    return dotProduct / (magnitude1 * magnitude2);
  };

  commands.forEach((command) => {
    const type = command[0]; // Command type (M, L, Q, Z)
    const args = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number); // Arguments

    if (type === "M") {
      // Move command
      currentPoint = [args[0], args[1]];
      coordinates.push([...currentPoint]);
      lastCosine = null; // Reset cosine
    } else if (type === "L") {
      // Line command
      const newPoint = [args[0], args[1]];

      // Skip if newPoint is the same as currentPoint
      if (currentPoint[0] === newPoint[0] && currentPoint[1] === newPoint[1]) {
        return;
      }

      const differenceVector = [
        newPoint[0] - currentPoint[0],
        newPoint[1] - currentPoint[1],
      ];
      const currentCosine = calculateCosine(differenceVector, [1, 0]);

      if (lastCosine === null || currentCosine !== lastCosine) {
        coordinates.push(newPoint);
      } else {
        coordinates[coordinates.length - 1] = newPoint; // Replace last point
      }

      currentPoint = newPoint;
      lastCosine = currentCosine;
    } else if (type === "Q") {
      // Quadratic Bézier command
      const [cx, cy, x, y] = args; // Control point and endpoint

      // Skip the curve if control point equals either the start point or the end point
      const controlPoint = [cx, cy];
      const endPoint = [x, y];
      if (
        (controlPoint[0] === currentPoint[0] &&
          controlPoint[1] === currentPoint[1]) ||
        (controlPoint[0] === endPoint[0] && controlPoint[1] === endPoint[1])
      ) {
        currentPoint = endPoint; // Update the current point to the end point
        return; // Skip adding this segment
      }

      // Skip if endPoint is the same as currentPoint
      if (currentPoint[0] === endPoint[0] && currentPoint[1] === endPoint[1]) {
        return;
      }

      // Add end point as a line segment
      coordinates.push(endPoint);
      currentPoint = endPoint;
    } else if (type === "Z" || type === "z") {
      // Close path command
      coordinates.push("Z");
    }
  });

  // Convert coordinates array to path string
  let simplifiedPath = "";
  coordinates.forEach((point, index) => {
    if (Array.isArray(point)) {
      simplifiedPath += `${index === 0 ? "M" : "L"} ${point.join(" ")} `;
    } else {
      simplifiedPath += "Z ";
    }
  });

  return simplifiedPath.trim();
}
