import { NextRequest, NextResponse } from 'next/server';
import { VertexAI, HarmCategory, HarmBlockThreshold, GenerateContentResponse } from '@google-cloud/vertexai';

const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;

async function getVertexAIClient(): Promise<VertexAI> {
  console.log("Initializing VertexAI client");
  console.log("Project ID:", projectId);
  
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_PROJECT_ID is not defined');
  }

  const vertexAI = new VertexAI({
    project: projectId,
    location: 'europe-west8',
  });

  return vertexAI;
}

async function searchContent() {
  try {
    const vertexAI = await getVertexAIClient();
    const model = 'gemini-1.5-flash-002';

    console.log("Creating generative model");
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

    console.log("Starting chat");
    const chat = generativeModel.startChat({});
    return chat;
  } catch (error) {
    console.error('Error in searchContent:', error);
    throw error;
  }
}

export async function getChatResponse(prompt: string = 'tell me about racer 5'): Promise<GenerateContentResponse> {
  try {
    console.log("getResponse called with prompt:", prompt);
    const chat = await searchContent();
    console.log("Chat created, sending message stream");
    const streamResult = await chat.sendMessageStream(prompt);

    console.log("Message stream sent, waiting for response");
    const streamingResponse = await streamResult.response;
    process.stdout.write('stream result: ' + JSON.stringify(streamingResponse) + '\n');
    
    return streamingResponse;
  } catch (error) {
    console.error('Error in getResponse:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }    
    const data= await getChatResponse(prompt);
    


    if (data.candidates && data.candidates.length > 0) {
      // create a VertexAiResponse object

      return NextResponse.json({text: data.candidates[0].content?.parts[0]?.text || '' , groundingChunks: data.candidates[0].groundingMetadata?.groundingChunks || []});
    } else {
      console.error('No candidates found in the streaming response:', data);
      throw new Error('No candidates found in the streaming response');
    }

    // console.log('in getResponse route:', data);
    // return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
 
