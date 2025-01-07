export const getTextTrueBBox = (containerId: string) => {
  const original = document.getElementById(containerId);
  if (!original) {
    console.error(
      "No element with ID: " +
        containerId +
        " has been found for 'getTextTrueBBox'!"
    );

    return [];
  }
  const body = document.body;

  // Step 1: Extract text content
  function extractText(node: ChildNode) {
    let text = "";
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.nodeValue?.trim(); // Get text from text nodes
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        text += " " + extractText(child); // Recursively handle child elements
      }
    });
    return text.trim();
  }

  // Extract text from the original element
  const text = extractText(original);

  if (!text) {
    console.error("The element: " + containerId + " doesn't contain any text!");
    return [];
  }

  const originalContent = original.innerHTML;
  // Step 2: Clear the original container and replace content with word-wrapped spans
  original.innerHTML = ""; // Clear original content

  const words = text.split(/([ ,.;!?]+)/); // Split by word breaks (including delimiters)
  words.forEach((word) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline"; // Inline to preserve flow
    original.appendChild(span);
  });

  // Step 3: Process spans to determine lines
  const spans = Array.from(original.children);
  let prevY = NaN;
  let currentLine: any[] = [];
  const lineDivs: any[] = [];
  const lineDivsId: string[] = [];

  const lastLine = spans.reduce(
    (acc, span, index) => {
      const rect = span.getBoundingClientRect();
      const newY = rect.top;

      if (Number.isNaN(prevY) || Math.abs(newY - prevY) < 1) {
        // Same line: Expand width
        acc.width += rect.width;
        acc.height = rect.height;
        acc.top = rect.top;
        if (Number.isNaN(acc.left)) acc.left = rect.left;
        currentLine.push(span);
      } else {
        // New line: Append a hidden div
        createLineDiv(acc, rect, currentLine, index);
        currentLine = [span];
        acc = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      }

      prevY = newY;
      return acc;
    },
    { top: NaN, left: NaN, width: 0, height: 0 }
  );

  // Handle the last line
  if (currentLine.length > 0) {
    const rect = currentLine[0].getBoundingClientRect();
    createLineDiv(lastLine, rect, currentLine, words.length - 1);
  }

  // Helper function to create a hidden div
  function createLineDiv(acc: any, rect: any, lineSpans: any, index: number) {
    const div = document.createElement("div");
    div.className = "line-div";
    div.style.top = `${acc.top + window.scrollY}px`;
    div.style.left = `${acc.left - 10 + window.scrollX}px`;
    div.style.width = `${acc.width + 20}px`;
    div.style.height = `${acc.height}px`;
    div.style.position = "absolute";
    div.style.visibility = "hidden"; // Set to 'visible' for debugging
    div.id = `${acc.width}.${acc.height}.${acc.left}.${acc.top}-${index}`;
    body.appendChild(div);
    lineDivs.push(div);
    lineDivsId.push(div.id);
  }

  original.innerHTML = originalContent;

  // Debugging: Set visibility to visible to see line divs
  // lineDivs.forEach((div) => (div.style.visibility = "visible"));
  return lineDivsId;
};
