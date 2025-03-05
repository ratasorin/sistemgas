import { getSmoothStepPath, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import { modifySvgPathToAvoidCollisions } from "../helper/go-around-element";
import { simplifyQuadraticPath } from "../helper/simplify-path";
import { Coordinates } from "../Scene/Text/helpers/math/coordinates";

export const useGoAroundElement = (
  source: Coordinates,
  destination: Coordinates,
  sourcePosition: Position,
  destinationPosition: Position,
  obstacleIds: string[]
) => {
  const [path] = getSmoothStepPath({
    sourceX: source.x,
    sourceY: source.y,
    sourcePosition: sourcePosition,
    targetX: destination.x,
    targetY: destination.y,
    targetPosition: destinationPosition,
    borderRadius: 12,
  });
  const [newPath, setNewPath] = useState<string | undefined>(undefined);

  useEffect(() => {
    let prevPath = path;
    obstacleIds.forEach((obstacleId) => {
      const simplePath = simplifyQuadraticPath(prevPath);
      prevPath = modifySvgPathToAvoidCollisions(
        simplePath,
        [obstacleId],
        16,
        12,
        destinationPosition
      );
    });


    setNewPath(prevPath);
  }, [path]);

  return newPath;
};
