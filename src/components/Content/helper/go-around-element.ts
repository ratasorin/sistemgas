import { Position, getSmoothStepPath } from "@xyflow/react";
import { simplifyQuadraticPath } from "./simplify-path";

export function modifySvgPathToAvoidCollisions(
  pathString: string,
  elementIds: string[],
  padding = 15,
  roundingRadius = 10
) {
  const parseSvgPoints = (pathData: string) =>
    pathData.match(/[MLZ][^MLZ]*/g)?.map((cmd) => {
      const type = cmd[0]; // First character is the command type (e.g., M, L, Z)
      const coords = cmd
        .slice(1)
        .trim()
        .split(/[\s,]+/); // Extract the rest of the string after the type
      return {
        type,
        x: parseFloat(coords[0]) || 0, // Handle potential NaN with fallback to 0
        y: parseFloat(coords[1]) || 0, // Handle potential NaN with fallback to 0
      };
    }) || [];

  let points = parseSvgPoints(pathString);
  if (points.length < 2) return pathString;

  const newPathData = [];
  let currentPoint = points[0];
  const endPoint = points[points.length - 1];
  newPathData.push(`M${currentPoint.x},${currentPoint.y}`);

  const formatSmoothPath = (pathData: string) => {
    return (
      pathData
        // Split commands into separate entries
        .match(/[MLQ][^MLQ]*/g)
        ?.map((segment) => {
          const command = segment[0]; // First character is the command
          const coords = segment.slice(1).trim(); // Extract coordinates

          // Ensure proper formatting with a space between command and coordinates
          return `${command}${coords.replace(/[\s,]+/g, ",")}`;
        })
        .filter((formattedSegment) => !formattedSegment.startsWith("M")) // Remove the M command
        .join(" ") // Join back into a single string
        .trim()
    ); // Remove trailing whitespace
  };

  const findIntersections = (p1, p2, rect) => {
    const paddedRect = {
      left: rect.left - padding,
      right: rect.right + padding,
      top: rect.top - padding,
      bottom: rect.bottom + padding,
    };

    const rectEdges = [
      {
        start: { x: paddedRect.left, y: paddedRect.top },
        end: { x: paddedRect.right, y: paddedRect.top },
      }, // Top
      {
        start: { x: paddedRect.right, y: paddedRect.top },
        end: { x: paddedRect.right, y: paddedRect.bottom },
      }, // Right
      {
        start: { x: paddedRect.right, y: paddedRect.bottom },
        end: { x: paddedRect.left, y: paddedRect.bottom },
      }, // Bottom
      {
        start: { x: paddedRect.left, y: paddedRect.bottom },
        end: { x: paddedRect.left, y: paddedRect.top },
      }, // Left
    ];

    const ccw = (a, b, c) =>
      (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    const intersects = (a, b, c, d) =>
      ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);

    const intersections = [];

    for (const edge of rectEdges) {
      if (intersects(p1, p2, edge.start, edge.end)) {
        const { start, end } = edge;
        const dx1 = p2.x - p1.x;
        const dy1 = p2.y - p1.y;
        const dx2 = end.x - start.x;
        const dy2 = end.y - start.y;

        const determinant = dx1 * dy2 - dy1 * dx2;
        if (determinant === 0) continue; // Parallel lines

        const t =
          ((start.x - p1.x) * dy2 - (start.y - p1.y) * dx2) / determinant;
        const intersection = {
          x: p1.x + t * dx1,
          y: p1.y + t * dy1,
          edge: { start, end },
        };
        intersections.push(intersection);
      }
    }

    return intersections;
  };

  // Method to check if two rectangles intersect
  const doesRectIntersect = (rectA, rectB) => {
    return (
      rectA.left < rectB.right &&
      rectA.right > rectB.left &&
      rectA.top < rectB.bottom &&
      rectA.bottom > rectB.top
    );
  };

  const handleIntersection = (intersection, end, rect) => {
    const { x: ix, y: iy } = intersection;
    const { start, end: edgeEnd } = intersection.edge;

    // Check if the edge is horizontal or vertical
    const isHorizontal = start.x === edgeEnd.x;

    let firstPoint;
    let secondPoint;

    // Move along the perpendicular axis
    if (isHorizontal) {
      // Move along the y-axis (up or down) to avoid the rectangle
      firstPoint = {
        x: ix,
        y: end.y > iy ? rect.bottom + padding : rect.top - padding, // Move just outside the rectangle
      };

      // Check if the first point avoids the element
      const rect1 = {
        left: Math.min(firstPoint.x, end.x),
        right: Math.max(firstPoint.x, end.x),
        top: Math.min(firstPoint.y, end.y),
        bottom: Math.max(firstPoint.y, end.y),
      };

      // If no intersection, we can safely return the first point
      if (!doesRectIntersect(rect1, rect)) {
        return [intersection, firstPoint];
      }

      // Otherwise, move along the x-axis (left or right)
      secondPoint = {
        x: end.x > ix ? rect.right + padding : rect.left - padding,
        y: firstPoint.y,
      };
    } else {
      // Move along the x-axis (left or right) to avoid the rectangle
      firstPoint = {
        x: end.x > ix ? rect.right + padding : rect.left - padding,
        y: iy,
      };

      // Check if the first point avoids the element
      const rect1 = {
        left: Math.min(firstPoint.x, end.x),
        right: Math.max(firstPoint.x, end.x),
        top: Math.min(firstPoint.y, end.y),
        bottom: Math.max(firstPoint.y, end.y),
      };

      // If no intersection, return the first point
      if (!doesRectIntersect(rect1, rect)) {
        return [intersection, firstPoint];
      }

      // Otherwise, move along the y-axis (up or down)
      secondPoint = {
        x: firstPoint.x,
        y: end.y > iy ? rect.bottom + padding : rect.top - padding,
      };
    }

    // Return both deflection points if necessary
    return [intersection, firstPoint, secondPoint];
  };

  const calculateVectorDirection = (start, end) => ({
    x: end.x - start.x,
    y: end.y - start.y,
  });

  for (const elementId of elementIds) {
    for (let i = 1; i < points.length; i++) {
      const nextPoint = points[i];
      let collisionDetected = false;

      const element = document.getElementById(elementId);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const intersections = findIntersections(currentPoint, nextPoint, rect);
      let closestInteraction;

      if (intersections.length === 1) {
        closestInteraction = intersections[0];
      }

      if (intersections.length === 2) {
        const [intersection1, intersection2] = intersections;
        const vector1 = calculateVectorDirection(currentPoint, nextPoint);
        const vector2 = calculateVectorDirection(intersection1, intersection2);

        // Calculate dot product to compare directions
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
        if (dotProduct > 0) closestInteraction = intersections[0];
        else closestInteraction = intersections[1];
      }

      if (closestInteraction) {
        collisionDetected = true;
        const deflectionPoints = handleIntersection(
          closestInteraction,
          endPoint,
          rect
        );

        deflectionPoints.forEach((point, index) => {
          newPathData.push(`L${point.x},${point.y}`);
        });

        const directionsToTake = { x: undefined, y: undefined };

        const dfLength = deflectionPoints.length;
        const lastDfPoint = deflectionPoints[dfLength - 1];
        const secondLastDfPoint = deflectionPoints[dfLength - 2];
        let direction;

        if (lastDfPoint.x - endPoint.x > 0) directionsToTake.x = "left";
        else directionsToTake.x = "right";

        if (lastDfPoint.y - endPoint.y > 0) directionsToTake.y = "top";
        else directionsToTake.y = "bottom";

        if (lastDfPoint.x === secondLastDfPoint.x) {
          if (lastDfPoint.y > secondLastDfPoint.y) direction = "bottom";
          else direction = "top";
        } else {
          if (lastDfPoint.x > secondLastDfPoint.x) direction = "right";
          else direction = "left";
        }

        const directionLeft = Object.values(directionsToTake).filter(
          (v) => v !== direction
        );

        console.log({
          directionsToTake,
          directionLeft,
          lastDfPoint,
          secondLastDfPoint,
        });

        if (
          Math.abs(
            deflectionPoints[deflectionPoints.length - 1].x - endPoint.x
          ) < -1
        ) {
          const [smoothPath] = getSmoothStepPath({
            sourceX: deflectionPoints[deflectionPoints.length - 1].x,
            sourceY: deflectionPoints[deflectionPoints.length - 1].y,
            sourcePosition: "bottom",
            targetX:
              endPoint.x -
              Math.abs(
                deflectionPoints[deflectionPoints.length - 1].x - endPoint.x
              ),
            targetY: endPoint.y,
            targetPosition: "top",
          });

          console.log({
            smooth: formatSmoothPath(simplifyQuadraticPath(smoothPath)),
          });

          newPathData.push(formatSmoothPath(simplifyQuadraticPath(smoothPath)));
          break;
        } else {
          const [smoothPath] = getSmoothStepPath({
            sourceX: deflectionPoints[deflectionPoints.length - 1].x,
            sourceY: deflectionPoints[deflectionPoints.length - 1].y,
            sourcePosition: directionLeft[0],
            targetX: endPoint.x,
            targetY: endPoint.y,
            targetPosition: "top",
          });

          console.log({
            smooth: formatSmoothPath(simplifyQuadraticPath(smoothPath)),
          });

          newPathData.push(formatSmoothPath(simplifyQuadraticPath(smoothPath)));
          break;
        }
      }

      if (!collisionDetected) {
        newPathData.push(`L${nextPoint.x},${nextPoint.y}`);
        currentPoint = nextPoint;
      }
    }
  }

  let pathSegments = parseSvgPoints(newPathData.join(" "));

  console.log({ npd: newPathData });
  // Function to modify the path data with rounding
  const addRoundedPath = (start, middle, end) => {
    console.log({ start, middle, end });
    // Calculate direction vectors for the two lines
    const dx1 = middle.x - start.x;
    const dy1 = middle.y - start.y;
    const dx2 = end.x - middle.x;
    const dy2 = end.y - middle.y;

    // Normalize the direction vectors
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

    const unitDx1 = len1 === 0 ? 0 : dx1 / len1;
    const unitDy1 = len1 === 0 ? 0 : dy1 / len1;
    const unitDx2 = len2 === 0 ? 0 : dx2 / len2;
    const unitDy2 = len2 === 0 ? 0 : dy2 / len2;

    // Calculate new points shortened by roundingRadius
    const shortStart = {
      x: middle.x - unitDx1 * roundingRadius,
      y: middle.y - unitDy1 * roundingRadius,
    };

    const shortEnd = {
      x: middle.x + unitDx2 * roundingRadius,
      y: middle.y + unitDy2 * roundingRadius,
    };

    // Create the path: Line -> Quadratic -> Line
    const line1 = `L${shortStart.x},${shortStart.y}`;
    const quadraticCurve = `Q${middle.x},${middle.y} ${shortEnd.x},${shortEnd.y}`;
    return { line1, quadraticCurve };
  };

  const finalPathData = [];
  let lastPoint = null;
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];

    if (segment.type === "M") {
      // Handle MoveTo command
      lastPoint = { x: segment.x, y: segment.y };
      finalPathData.push(`M${lastPoint.x},${lastPoint.y}`);
    } else if (segment.type === "L") {
      const currentPoint = { x: segment.x, y: segment.y };

      if (
        lastPoint &&
        i + 1 < pathSegments.length &&
        pathSegments[i + 1].type === "L"
      ) {
        const nextPoint = {
          x: pathSegments[i + 1].x,
          y: pathSegments[i + 1].y,
        };

        // Apply rounding between lastPoint, currentPoint, and nextPoint
        const { line1, quadraticCurve } = addRoundedPath(
          lastPoint,
          currentPoint,
          nextPoint,
          roundingRadius
        );
        finalPathData.push(line1);
        finalPathData.push(quadraticCurve);

        // Update lastPoint to the endpoint of the quadratic curve
        lastPoint = currentPoint;
      } else {
        // If no rounding is needed, just add a straight line
        finalPathData.push(`L${currentPoint.x},${currentPoint.y}`);
        lastPoint = currentPoint;
      }
    }
  }

  // Add the last segment without any rounding
  console.log({ finalPathData });
  return finalPathData.join(" ");
}
