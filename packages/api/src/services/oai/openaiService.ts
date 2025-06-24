import { type SummarizePaperResponse } from '@arxiv-explorer/types/api'
import OpenAI from 'openai'

import { fetchSecret } from '../../util/secret'

/**
 * Service to interact with RDS Vector database
 */
export class OpenAIService {
  public client!: OpenAI

  /**
   * Initializes the RDSService with connections to various services.
   */
  constructor() {}

  /**
   * Initializes the RDSService by creating access patterns.
   * It retrieves a PostgreSQL client from the RDSConnection and initializes the services.
   * @returns {Promise<void>} A promise that resolves when the service is initialized.
   */
  public async init(): Promise<void> {
    this.client = new OpenAI({
      apiKey: await fetchSecret('/openai/api-key'),
    })
  }

  /**
   * Prompt openai to
   */
  public async summarizePaper(
    title: string,
    conclusions: string,
  ): Promise<SummarizePaperResponse> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `Please provide a concise summary of these conclusions from a scientific paper: "${conclusions}".
          Title: "${title}". Provide a list of follow-up projects that could be derived from this paper. 
          Add a list of three references that could be useful for further reading on this topic.
          The summary should be clear and informative, suitable for a general audience.
          Return the results in a JSON format with the following structure:
          {
            "summary": "The summary of the paper",
            "follow_up_projects": [
              "Project 1",
              "Project 2",
              "Project 3"
            ],
            "references": [
              "Reference 1",
              "Reference 2",
              "Reference 3"
            ]
          }`,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    })

    const contentJson = response.choices[0].message.content?.trim() || ''
    const content = JSON.parse(contentJson)

    return {
      summary: content.summary || '',
      follow_up_projects: content.follow_up_projects || [],
      references: content.references || [],
    }
  }

  /**
   * Embedding paper
   */
  public async embedPaper(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  }
}
