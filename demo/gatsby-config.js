module.exports = {
  siteMetadata: {
    title: `Click and rent`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `CodeWithLinda`,
      short_name: `CodeWithLinda`,
      start_url: `/`,
      background_color: `#212121`,
      theme_color: `#f39ca9`,
      display: `standalone`,
      icon: `src/images/icon.png`
    },
  }, "gatsby-plugin-styled-components", {
    resolve: `gatsby-plugin-offline`,
    options: {
      precachePages: [`/`, `/app/access/*`],
    },
  },]
};