import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';

const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;

async function getVertexAIClient(): Promise<VertexAI> {
  console.log("Initializing VertexAI client");
  
  const vertexAI = new VertexAI({
    project: projectId,
    location: 'europe-west8',
  });

  return vertexAI;
}

export async function searchContent() {
  const vertexAI = await getVertexAIClient();
  const model = 'gemini-1.5-flash-002';

  // Instantiate the models
  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      'maxOutputTokens': 8192,
      'temperature': 1,
      'topP': 0.95,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      }
    ],
    tools: [
      {
        retrieval: {
          vertexAiSearch: {
            datastore: 'projects/enterprise-search-402309/locations/global/collections/default_collection/dataStores/agent-robotics_1732363078115',
          }
        },
      },
    ],
  });

  const chat = generativeModel.startChat({});

  return chat;
}

export async function sendMessage(prompt: string = 'tell me about racer 5'): Promise<string> {
  const chat = await searchContent();
  const streamResult = await chat.sendMessageStream(prompt);

  const streamingResponse = await streamResult.response;
  process.stdout.write('stream result: ' + JSON.stringify(streamingResponse) + '\n');
  console.log("Streaming response:", streamingResponse);

  if (streamingResponse.candidates && streamingResponse.candidates.length > 0) {
    return streamingResponse.candidates[0].content?.parts[0]?.text || '';
  } else {
    console.error('No candidates found in the streaming response:', streamingResponse);
    throw new Error('No candidates found in the streaming response');
  }
}
