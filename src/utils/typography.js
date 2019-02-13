import Typography from "typography"

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: ['Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif'],
  bodyFontFamily: ['Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif'],
  bodyFontColor: '#404040'
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
