import {
  SummarizePaperRequestSchema,
  type SummarizePaperResponse,
} from '@arxiv-explorer/types/api'
import type { NextFunction, Request, Response } from 'express'
import { JSDOM } from 'jsdom'

import type { Services } from '../../../services'
import { ErrorWithStatus } from '../../../util/error'
import { logger } from '../../../util/logging'

/**
 * Finds the section to extract from the given sections.
 * Try with the following order: conclusions, summary, abstract.
 * If none of these sections are found, it returns undefined.
 * @param sections - The sections of the paper
 */
const findSectionToExtract = (
  sections: Record<string, string>,
): string | undefined => {
  for (const key of Object.keys(sections)) {
    if (
      /conclusion/i.test(key) ||
      /summary/i.test(key) ||
      /abstract/i.test(key)
    ) {
      return sections[key]
    }
  }
  return undefined
}

/**
 * Fetches the HTML content of an arXiv paper and extracts each section's content.
 * @param event
 */
export const fetchSections = async (
  href: string,
): Promise<Record<string, string>> => {
  try {
    // 1. fetch paper
    const response = await fetch(href)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const htmlText = await response.text()

    // 2. parse into dom
    const dom = new JSDOM(htmlText)

    // 3. collect all <h2> headings
    const sectionHeadings = Array.from(
      dom.window.document.querySelectorAll('h2'),
    )

    const sections: Record<string, string> = {}

    for (let i = 0; i < sectionHeadings.length; i++) {
      const heading = sectionHeadings[i]

      const title = heading.textContent!.trim()

      // 4. gather everything until the next <h2> heading
      let contentHTML = ''
      let sibling = heading.nextElementSibling

      while (sibling && sibling.tagName !== 'H2') {
        contentHTML += sibling.textContent!.trim() + '\n'
        sibling = sibling.nextElementSibling
      }

      sections[title] = contentHTML
    }

    // 5. add the abstract section if it exists
    const abstractElement =
      dom.window.document.querySelector('div.ltx_abstract')
    if (abstractElement) {
      sections.Abstract = abstractElement.textContent?.trim() || ''
    }

    return sections
  } catch (err) {
    logger.error('Failed to fetch or parse arXiv content:', err)
  }

  return {}
}

/**
 * Get the neighbors of a paper based on the provided parameters.
 * @param services
 * @returns
 */
export const post = (services: Services) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parsedParams = SummarizePaperRequestSchema.parse({
      ...req.params,
      ...req.body,
    })

    // check paper exists
    try {
      const summary = await services.rdsService.paper.getByCode(
        parsedParams.code,
      )
      res.status(200).json(summary)
      return
    } catch (err: unknown) {
      if (
        !(
          err instanceof ErrorWithStatus &&
          err.statusMessage === 'PaperNotFound'
        )
      ) {
        next(err)
        return
      }
    }

    // parse sections
    const sections = await fetchSections(parsedParams.href)
    const sectionToExtract = findSectionToExtract(sections)

    if (!sectionToExtract) {
      next(
        new ErrorWithStatus(
          'Conclusion section not found in the paper',
          400,
          'NoConclusionSectionFoundError',
        ),
      )
      return
    }

    // invoke the service to process the paper
    const summary = await services.openAIService.summarizePaper(
      parsedParams.title,
      sectionToExtract,
    )

    // embedding
    const embedding = await services.openAIService.embedPaper(summary.summary)

    // store records in db
    const paper_id = await services.rdsService.paper.create({
      title: parsedParams.title,
      summary: summary.summary,
      embedding,
      code: parsedParams.code,
      href: parsedParams.href,
    })

    await services.rdsService.idea.create(summary.follow_up_projects, paper_id)
    await services.rdsService.reference.create(summary.references, paper_id)

    try {
      res.status(200).json(summary as SummarizePaperResponse)
    } catch (err) {
      logger.error({ message: 'Failed to process paper', err })

      next(err)
    }
  }
}
