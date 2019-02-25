module.exports = {
  siteMetadata: {
    title: `ClassClock`,
    description: `A Better School Scheduling Tool.`,
    author: `@MoralCode & @nbd9`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    'gatsby-plugin-typescript',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ClassClock`,
        short_name: `ClassClock`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/classclockicon-512.png`,
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Play`
          },
          {
            family: `Source Sans Pro`
          },
        ],
      },
    }
  ],
}
