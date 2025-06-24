import { ExploreClickEventName, type ExploreClickEvent } from '@utils/extension'

// import { fetchSections } from './fetchArxiv'

/**
 * Parses the content of a dt and dd element to extract article information.
 * @param dt - The dt element containing the article title and ID.
 * @param dd - The dd element containing additional article details.
 * @returns An object containing the article title, ID, and HTML link.
 */
const parseContent = (dt: Element, dd: Element): ExploreClickEvent => {
  // article id
  const code = dt.querySelector('a[title]')?.getAttribute('id') || ''

  // article title
  const titleContent =
    dd.querySelector('.list-title')?.textContent?.trim() || ''
  const title = titleContent
    .replace(/^Title:\s*/, '')
    .replace(/\.$/, '')
    .trim()

  // article HTML link
  const href =
    dt.querySelector('a[title="View HTML"]')?.getAttribute('href') || '#'

  return { title, code, href }
}

/**
 * This script adds a "summarize" link to each article in the articles list.
 * When clicked, it fetches the article's HTML from arXiv and generates a summary using OpenAI's API.
 * The summary is displayed below the article title.
 *
 */
export const insertSummarizeAnchor = (): void => {
  const articles = document.getElementById('articles')
  if (!articles) return

  const dtList = Array.from(articles.querySelectorAll('dt'))
  dtList.forEach((dt) => {
    const dd = dt.nextElementSibling

    if (!dd || dd.tagName !== 'DD') return
    if (dt.querySelector('a.explore')) return

    const summarizeLink = document.createElement('a')
    summarizeLink.className = 'explore'
    summarizeLink.innerText = 'explore'
    summarizeLink.href = '#'

    summarizeLink.addEventListener('click', (e) => {
      e.preventDefault()
      const { title, code, href } = parseContent(dt, dd)
      document.dispatchEvent(
        new CustomEvent<ExploreClickEvent>(ExploreClickEventName, {
          detail: { title, code, href },
        }),
      )
    })

    const separatorDiv = document.createElement('text')
    separatorDiv.innerText = ', '

    dt.insertBefore(separatorDiv, dt.lastChild)
    dt.insertBefore(summarizeLink, dt.lastChild)
  })
}
