import { type SummarizePaperResponse } from '@arxiv-explorer/types/api'
import { Box, Container, HStack, VStack, Tabs, List } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { LuTelescope, LuLightbulb, LuCircleCheck, LuBook } from 'react-icons/lu'

import { insertSummarizeAnchor } from './host-updates'
import { ArxivExplorerLogo } from '@components/ui/logo'
import { type ExploreClickEvent, ExploreClickEventName } from '@utils/extension'

/**
 * Widget component.
 */
export const Widget: React.FC = () => {
  const [header, setHeader] = React.useState<string>('arXiv Explorer')
  const [content, setContent] = React.useState<SummarizePaperResponse>({
    summary: 'Click on an article to explore it.',
    follow_up_projects: [],
    references: [],
  })
  const [exploreRequest, setExploreRequest] = React.useState<ExploreClickEvent>(
    {
      title: '',
      code: '',
      href: '',
    },
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  useEffect(() => {
    // Insert the "explore" link into the articles list
    insertSummarizeAnchor()

    /**
     * Handler: Custom event listener for article clicks
     * @param e ExploreClickEvent - Custom event triggered when an article is clicked
     */
    const onExplore = (e: CustomEventInit<ExploreClickEvent>) => {
      setExploreRequest(e.detail as unknown as ExploreClickEvent)
      setHeader(`Exploring ${e.detail!.code}`)
      setContent({
        summary: 'Fetching summary...',
        follow_up_projects: [],
        references: [],
      })
    }
    document.addEventListener(ExploreClickEventName, onExplore as EventListener)

    return () => {
      document.removeEventListener(
        ExploreClickEventName,
        onExplore as EventListener,
      )
    }
  }, [])

  useEffect(() => {
    if (!exploreRequest.code) return

    setIsLoading(true)

    fetch('http://localhost:3002/v1/paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exploreRequest),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`)
        return res.json()
      })
      .then((data: SummarizePaperResponse) => {
        setHeader('Summary completed')
        setContent(data)
      })
      .catch((err) => {
        setHeader('Error')
        setContent({
          summary: `Failed to fetch summary: ${err instanceof Error ? err.message : 'Unknown error'}`,
          follow_up_projects: [],
          references: [],
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [exploreRequest.code])

  return (
    <Container
      w="md"
      p={4}
      zIndex={9999}
      position={'fixed'}
      bottom={'1rem'}
      right={'1rem'}
      fontFamily={'Inter, sans-serif'}
      fontSize={'sm'}
      backgroundColor={'gray.800'}
      shadow={'sm'}
      borderRadius={'md'}
    >
      <HStack>
        <Box boxSize="30%">
          <ArxivExplorerLogo
            width={'100%'}
            height={'100%'}
            isLoading={isLoading}
          />
        </Box>

        <VStack gap="2" width="full" align={'start'}>
          <Box fontWeight="bold" fontSize="md">
            {header}
          </Box>
          <Tabs.Root defaultValue="summary" variant={'subtle'}>
            <Tabs.List>
              <Tabs.Trigger value="summary">
                <LuTelescope />
                Summary
              </Tabs.Trigger>
              <Tabs.Trigger value="ideas">
                <LuLightbulb />
                Ideas
              </Tabs.Trigger>
              <Tabs.Trigger value="references">
                <LuBook />
                References
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="summary">
              <Box fontSize="sm">{content.summary}</Box>
            </Tabs.Content>
            <Tabs.Content value="ideas">
              <Box fontSize="sm">
                {content.follow_up_projects.length > 0 ? (
                  <List.Root gap="2" variant="plain" align="center">
                    {content.follow_up_projects.map((project, index) => (
                      <List.Item key={index}>
                        <List.Indicator asChild color="green.500">
                          <LuCircleCheck />
                        </List.Indicator>
                        {project}
                      </List.Item>
                    ))}
                  </List.Root>
                ) : (
                  <Box>No follow-up projects found.</Box>
                )}
              </Box>
            </Tabs.Content>
            <Tabs.Content value="references">
              <Box fontSize="sm">
                {content.references.length > 0 ? (
                  <List.Root gap="2" variant="plain" align="center">
                    {content.references.map((reference, index) => (
                      <List.Item key={index}>
                        <List.Indicator asChild color="blue.500">
                          <LuBook />
                        </List.Indicator>
                        {reference}
                      </List.Item>
                    ))}
                  </List.Root>
                ) : (
                  <Box>No references found.</Box>
                )}
              </Box>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </HStack>
    </Container>
  )
}
