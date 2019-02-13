import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { FaGithub, FaFacebookSquare } from "react-icons/fa"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
              imgStyle={{
                borderRadius: `50%`,
              }}
            />
            <p class="author">
              Written by <strong>{author}</strong> 
              {` `}
              <p class="social">
                {social.github && (
                  <a href={`https://github.com/${social.github}`} target="_blank"><FaGithub/></a>
                )}
                {social.facebook && (
                  <a href={`https://www.facebook.com/${social.facebook}`} target="_blank"><FaFacebookSquare/></a>
                )}
              </p>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpeg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          facebook,
          github
        }
      }
    }
  }
`

export default Bio
