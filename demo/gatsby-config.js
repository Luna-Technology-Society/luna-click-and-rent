module.exports = {
  siteMetadata: {
    title: `Click and rent`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Click & Rent Demo`,
      short_name: `C&R Demo`,
      start_url: `/`,
      background_color: `#ffffff`,
      theme_color: `#0d96a8`,
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