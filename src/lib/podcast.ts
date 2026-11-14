const WEBHOOK_URL =
  'https://fustiest-doggishly-sallie.ngrok-free.dev/webhook/a3c979b2-e186-4b4f-8167-c409a9472d76';

export async function generatePodcast(text: string): Promise<string> {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}