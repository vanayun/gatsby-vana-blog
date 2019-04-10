import Typography from "typography"

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: ['Noto Sans light', 'Malgun gothic', '맑은 고딕', 'sans-serif'],
  bodyFontFamily: ['Noto Sans light', 'Malgun gothic', '맑은 고딕', 'sans-serif'],
  bodyFontColor: '#333e4c'
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
