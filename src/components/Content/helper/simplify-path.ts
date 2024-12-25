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
      // Quadratic Bezier command
      const [cx, cy, x, y] = args; // Control point and endpoint

      // Process control point
      const controlPoint = [cx, cy];
      const controlDifferenceVector = [
        controlPoint[0] - currentPoint[0],
        controlPoint[1] - currentPoint[1],
      ];
      const controlCosine = calculateCosine(controlDifferenceVector, [1, 0]);

      if (lastCosine === null || controlCosine !== lastCosine) {
        coordinates.push(controlPoint);
      } else {
        coordinates[coordinates.length - 1] = controlPoint; // Replace last point
      }

      // Update for endpoint
      const endPoint = [x, y];
      const endpointDifferenceVector = [
        endPoint[0] - controlPoint[0],
        endPoint[1] - controlPoint[1],
      ];
      const endpointCosine = calculateCosine(endpointDifferenceVector, [1, 0]);

      if (controlCosine !== endpointCosine) {
        coordinates.push(endPoint);
      } else {
        coordinates[coordinates.length - 1] = endPoint; // Replace last point
      }

      currentPoint = endPoint;
      lastCosine = endpointCosine;
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
