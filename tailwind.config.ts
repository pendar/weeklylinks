import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        foreground: 'rgb(17 17 17)',
        muted: 'rgb(153 153 153)'
      },
      borderRadius: {
        xl: '20px'
      },
      boxShadow: {
        spotlight:
          '0px 594px 166px 0 rgba(0,0,0,0), 0px 380px 152px 0 rgba(0,0,0,0.02), 0px 214px 128px 0 rgba(0,0,0,0.08), 0px 95px 95px 0 rgba(0,0,0,0.13), 0px 24px 52px 0 rgba(0,0,0,0.15)',
        stacked:
          '183px 565px 166px 0 rgba(0,0,0,0), 117px 361px 152px 0 rgba(0,0,0,0.01), 66px 203px 128px 0 rgba(0,0,0,0.03), 29px 90px 95px 0 rgba(0,0,0,0.08), 7px 23px 52px 0 rgba(0,0,0,0.10)'
      }
    }
  },
  plugins: []
}

export default config



