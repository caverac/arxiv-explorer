import React from 'react'
import styled from 'styled-components'

const StyledLogoContainer = styled.div`
  line-height: 0;
  margin: 0;
  padding: 0;
`

type ArxivExplorerLogoProps = React.SVGProps<SVGSVGElement> & {
  isLoading?: boolean
}

/**
 * ArxivExplorerLogo component
 * @returns A React component that renders the Arxiv Explorer logo
 */
export const ArxivExplorerLogo: React.FC<ArxivExplorerLogoProps> = (props) => {
  return (
    <StyledLogoContainer>
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g id="arxiv-explorer">
          <g id="icon">
            <rect
              id="bg"
              x="89.2817"
              y="91.2065"
              width="328.88"
              height="332.168"
              fill="#9DF44C"
              stroke="black"
              stroke-width="6"
            />
            <g id="bones">
              {props.isLoading && (
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 256 256"
                  to="360 256 256"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
              <g id="bone-bl">
                <path
                  id="outline"
                  d="M120.873 415.033L174.404 361.262L152.362 339.122L98.8311 392.892C79.308 373.282 42.1512 416.931 81.1972 429.583C95.6822 471.966 137.248 431.48 120.873 415.033Z"
                  fill="white"
                  stroke="black"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  id="shade"
                  d="M152.362 339.122L159.92 346.713L104.499 402.381C92.7433 409.129 99.4609 383.403 66.0828 406.809C62.556 395.169 88.7547 380.24 98.2014 393.525L152.362 339.122Z"
                  fill="#D8D8D8"
                />
                <path
                  id="elbow"
                  d="M99.4612 393.525C77.419 371.384 34.5939 425.787 93.793 430.848"
                  stroke="black"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </g>
              <g id="bone-br">
                <path
                  id="outline_2"
                  d="M413.434 390.836L359.903 337.066L337.861 359.207L391.392 412.977C371.869 432.588 415.323 469.911 427.919 430.69C470.114 416.14 429.808 374.389 413.434 390.836Z"
                  fill="white"
                  stroke="black"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  id="shade_2"
                  d="M337.861 359.207L345.418 351.616L400.839 407.284C407.556 419.092 381.945 412.345 405.247 445.872C393.659 449.415 378.796 423.099 392.022 413.61L337.861 359.207Z"
                  fill="#D6D6D6"
                />
                <path
                  id="elbow_2"
                  d="M392.021 412.344C369.979 434.485 424.14 477.502 429.179 418.038"
                  stroke="black"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </g>
              <g id="bone-tr">
                <path
                  id="outline_3"
                  d="M391.127 96.9671L337.596 150.738L359.638 172.878L413.169 119.108C432.692 138.718 469.849 95.0693 430.803 82.4172C416.318 40.0336 374.752 80.5196 391.127 96.9671Z"
                  fill="white"
                  stroke="black"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  id="shade_3"
                  d="M359.638 172.878L352.08 165.287L407.501 109.619C419.257 102.871 412.539 128.597 445.917 105.191C449.444 116.831 423.245 131.76 413.799 118.475L359.638 172.878Z"
                  fill="#D8D8D8"
                />
                <path
                  id="elbow_3"
                  d="M412.539 118.476C434.581 140.616 477.406 86.2129 418.207 81.1522"
                  stroke="black"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </g>
              <g id="bone-tl">
                <path
                  id="outline_4"
                  d="M96.7847 121.164L150.316 174.934L172.358 152.793L118.827 99.0227C138.35 79.4123 94.8953 42.0893 82.2996 81.3099C40.1047 95.8598 80.4104 137.611 96.7847 121.164Z"
                  fill="white"
                  stroke="black"
                  stroke-width="4"
                  stroke-linejoin="round"
                />
                <path
                  id="shade_4"
                  d="M172.358 152.793L164.801 160.384L109.38 104.716C102.663 92.9077 128.273 99.6554 104.972 66.1279C116.56 62.5854 131.422 88.9013 118.197 98.3902L172.358 152.793Z"
                  fill="#D8D8D8"
                />
                <path
                  id="elbow_4"
                  d="M118.197 99.6557C140.24 77.5149 86.0784 34.4982 81.0402 93.962"
                  stroke="black"
                  stroke-width="4"
                  stroke-linecap="round"
                />
              </g>
            </g>
            <g id="face" filter="url(#filter0_d_9_98)">
              <ellipse
                cx="256.394"
                cy="259.079"
                rx="136.268"
                ry="136.877"
                fill="#FFF75A"
              />
              <ellipse
                cx="256.394"
                cy="259.079"
                rx="136.268"
                ry="136.877"
                stroke="black"
                stroke-width="6"
              />
            </g>
            <ellipse
              id="right-eye"
              cx="216.315"
              cy="216.138"
              rx="16.0315"
              ry="29.5226"
              fill="#040404"
            />
            <ellipse
              id="left-eye"
              cx="296.473"
              cy="216.138"
              rx="16.0315"
              ry="29.5226"
              fill="#040404"
            />
            <path
              id="mouth"
              d="M180.69 293.97C213.643 342.279 292.91 346.753 330.317 293.97M318.739 281.445L341.895 306.495M191.377 281.445L170.002 306.495"
              stroke="black"
              stroke-width="6"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_d_9_98"
            x="115.126"
            y="119.202"
            width="286.536"
            height="287.755"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="2" dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_9_98"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_9_98"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </StyledLogoContainer>
  )
}
