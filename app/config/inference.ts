const INFERENCE_BASE_URL =
  (process.env.INFERENCE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export async function generateImage(payload: {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  negative_prompt?: string;
  nologo?: boolean;
  model?: string;
}) {
  const url = `${INFERENCE_BASE_URL}/inference/image`;
  console.log("[Inference] generateImage URL:", url, "base:", INFERENCE_BASE_URL, "env:", process.env.INFERENCE_API_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.INFERENCE_API_KEY
        ? { "X-API-Key": process.env.INFERENCE_API_KEY }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  console.log("[Inference] generateImage status:", response.status, response.statusText, "ok:", response.ok);

  if (!response.ok) {
    throw new Error(`Inference API error: ${response.statusText}`);
  }

  return response.json();
}

export async function generateVideo(payload: {
  prompt: string;
  duration?: number;
  width?: number;
  height?: number;
  fps?: number;
  model?: string;
}) {
  const url = `${INFERENCE_BASE_URL}/inference/video`;
  console.log("[Inference] generateVideo URL:", url, "base:", INFERENCE_BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.INFERENCE_API_KEY
        ? { "X-API-Key": process.env.INFERENCE_API_KEY }
        : {}),
    },
    body: JSON.stringify(payload),
  });
  console.log("[Inference] generateVideo status:", response.status, response.statusText, "ok:", response.ok);

  if (!response.ok) {
    throw new Error(`Inference API error: ${response.statusText}`);
  }

  return response.json();
}

export async function enhanceImage(payload: {
  image_url: string;
  enhancement_type: string;
  scale_factor?: number;
  model?: string;
}) {
  const response = await fetch(`${INFERENCE_BASE_URL}/inference/enhance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.INFERENCE_API_KEY
        ? { "X-API-Key": process.env.INFERENCE_API_KEY }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Inference API error: ${response.statusText}`);
  }

  return response.json();
}

export async function listModels(task?: string) {
  const url = new URL(`${INFERENCE_BASE_URL}/inference/models`);
  if (task) url.searchParams.append("task", task);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Inference API error: ${response.statusText}`);
  }

  return response.json();
}
